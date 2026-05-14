from collections import Counter
for _ in range(int(input())):
    n = int(input())
    arr = list(map(int, input().split()))
    max_count = max(arr)
    count = Counter(arr)
    print(count[max_count])