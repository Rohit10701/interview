import math




def test(arr):
    """
    is consuctive gcd is smae or not gcd(ai, ai+1)

    36 = 2 x 2 x 3 x 3
    60 = 2 x 2 x 3 x 5

    gcd = 2 x 2 x 3 = 12
    """
    seen = set()
    for i in range(len(arr) - 1):
        seen.add(math.gcd(arr[i], arr[i + 1]))
        # print(math.gcd(arr[i], arr[i + 1]))
    # print(len(seen))
    return len(seen) == len(arr) - 1


for _ in range(int(input())):
    n = int(input())
    prev = 1
    ans = []
    # any two odd number are coprime
    for i in range(1, n + 1):
        ans.append(prev * (prev + 2))
        prev += 2
     
        
    
    # print(test(ans))
    print(*ans)
