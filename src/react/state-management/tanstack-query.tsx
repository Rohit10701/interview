// @ts-nocheck


// WHY: It handles caching and "Loading/Error" states automatically.
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading user!</p>;

  return <div>{data.name}</div>;
}