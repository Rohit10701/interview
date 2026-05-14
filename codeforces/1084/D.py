for _ in range(int(input())):
    n, x, y = list(map(int, input().split()))
    arr = list(map(int, input().split()))

    left = arr[:x]
    temp_mid = arr[x:y]
    right = arr[y:]

    if not temp_mid:
        print(*(left + right))
        continue

    m_idx = temp_mid.index(min(temp_mid))
    middle = temp_mid[m_idx:] + temp_mid[m_idx:] 
    middle = temp_mid[m_idx:] + temp_mid[:m_idx]
    min_middle = middle[0]

    move_right = []
    move_left = []

    i = 0
    while i < len(left) and left[i] <= min_middle:
        i += 1
    
    if i < len(left):
        move_right = left[i:]
        left = left[:i]
    else:
        j = 0
        while j < len(right) and right[j] <= min_middle:
            j += 1
        move_left = right[:j]
        right = right[j:]

    final = left + move_left + middle + move_right + right
    print(*final)