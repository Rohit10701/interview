for _ in range(int(input())):
    arr = list(map(int, input().split()))
    max_value = max(arr)
    rem_sum = -(sum(arr) - max_value)
    print(rem_sum + max_value)