for _ in range(int(input())):
    n = int(input())
    a = list(map(int, input().split()))
    m = 0
    for i in range(n):
        for j in range(i+1, n):
            m = max(m, a[i] ^ a[j])
            
    print(m)