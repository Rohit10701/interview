"""
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    tier_id UUID,
    
    
    CONSTRAINT fk_tier
        FOREIGN KEY (tier_id) 
        REFERENCES public.tiers(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.tiers (
    id uuid primary key,
    name text not null,
    description text,
    hourly_limit int not null,
    daily_limit int not null,
    price int not null,
    is_active boolean default true,
    create_at timestamp default current_timestamp
);

# enum -> active, revoked, expired, 
CREATE TYPE api_key_status AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

CREATE TABLE IF NOT EXISTS public.api_keys (
    id uuid primary key,
    user_id uuid not null,
    status api_key_status default active,
    key_prefix text not null,
    key_hash text not null,
    is_active boolean default true,
    create_at default timestamp
    
    CONSTRAINT fk_users FOREIGN key
    (user_id) REFERENCES public.users(id)
    on DELETE CASCADE
);

"""


from abc import ABC, abstractmethod
from typing import Dict, str, Any

class IApiRepo(ABC):
    @absctractmethod
    def get_key_metadata(self, key_hash : str) -> Optional[Dict[str, Any]]:
        pass

class IRateLimitStorage(ABC):
    @abstractmethod
    def increment_usage(self, user_id : str, window_key: str, limit: int, ttl: int) -> bool:
        pass
    
    @abstractmethod
    def get_cache_metadata(self, hash_key : str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def set_cache_metadata(self, hash_key : str, data : Dict[str, Any], ttl: int) -> None:
        pass


class RedisRateLimitStorage(IRateLimitStorage):
    def __init__(self, redis_client):
        self.redis_client = redis_client

    def increment_usages(self, user_id : str, window_key : str, limit : int, ttl : int ) -> bool:
        pipe = self.redis_client.pipeline()
        pipe.incr(window_key)
        pipe.expire(window_key, ttl, nx=True) 
        
        results = pipe.execute()
        current_usage = results[0]
        
        return current_usage <= limit


class ApiKeyAuthenticator:
    def __init__(self, db: IApiRepo, cache: IRateLimitStorage):
        self.db = db
        self.cache = cache

    def hash_key(self, api_key: str) -> str:
        return hash_lib.sha256(api_key.encode()).hexidigest()

    def authenticate(self, api_key: str) -> Optional[Dict[str, Any]]:
        key_hash = self.hash_key(api_key)

        #cache check first
        metadata = self.cache.get_cache_metadata(key_hash)
        if metadata:
            return metadata
        
        metadata = self.db.get_key_metadata(key_hash)
        # 5min ttl
        self.cache.set_cache_metadata(key_hash, metadata, 300)
        return metadata

class RateLimiter:
    def __init__(self, storage : IRateLimitStorage):
        self.storage = storage

    def is_allowed(self, user_id : str, hourly_limit : int, daily_limit : int) -> bool:
        current_hour = date.strftime("%Y-%m-%d-%h")
        current_day = date.strftime("%Y-%m-%d")

        hourly_key = f"rate:{user_id}:hr:{current_hour}"
        daily_key = f"rate:{user_id}:day:{current_day}"

        if not self.storage.increment_usage(user_id, hourly_key, hourly_limit, 3600):
            return False
            
        if not self.storage.increment_usage(user_id, daily_key, daily_limit, 86400):
            return False
            
        return True


from fastapi import FastAPI, Header, HTTPException, Depends
import redis


app = FastAPI()

redis_client = redis.Redis(host='localhost', port=6379, db=0)
cache_storage = RedisRateLimitStorage(redis_client)

db_repo = PostgresApiRepo() 

authenticator = ApiKeyAuthenticator(db=db_repo, cache=cache_storage)
rate_limiter = RateLimiter(storage=cache_storage)

def api_key_middleware(x_api_key: str = Header(None)):
    if not x_api_key:
        raise HTTPException(status_code=401, detail="Missing API Key header")

    metadata = authenticator.authenticate(x_api_key)
    
    if not metadata or metadata.get("status") != "ACTIVE":
        raise HTTPException(status_code=401, detail="Invalid, Revoked, or Expired API Key")

    user_id = str(metadata.get("user_id"))
    hourly_limit = metadata.get("hourly_limit")
    daily_limit = metadata.get("daily_limit")

    if not rate_limiter.is_allowed(user_id, hourly_limit, daily_limit):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    return metadata


@app.get("/api/v1/protected-data")
def get_secure_data(user_metadata: dict = Depends(api_key_middleware)):
    user_id = user_metadata["user_id"]
    return {
        "message": "You successfully bypassed the rate limiter!",
        "user_data": f"Fetching secure info for user: {user_id}"
    }
