from collections import Counter

def is_sorted(arr):
    for i in range(1, len(arr)):
        if arr[i-1] > arr[i]:
            return False
    return True
    
for _ in range(int(input())):
    n = int(input())
    arr = list(map(int, input().split()))
    if is_sorted(arr):
        print(len(arr))
    else:
        print(1)