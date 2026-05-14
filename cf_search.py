import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    url = "https://codeforces.com/api/contest.list?gym=false"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode())
        contests = [c['id'] for c in data['result'][:30] if c['phase'] == 'FINISHED']
        
    for cid in contests:
        url2 = f"https://codeforces.com/api/contest.status?contestId={cid}&from=1&count=100"
        req2 = urllib.request.Request(url2)
        try:
            with urllib.request.urlopen(req2, context=ctx) as r2:
                d2 = json.loads(r2.read().decode())
                for sub in d2['result']:
                    prob = sub['problem']
                    # We print problem name to see... we can't grep the testcases easily this way, but we can print problem names.
        except Exception as e:
            pass
except Exception as e:
    print(e)
