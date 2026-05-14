for _ in range(int(input())):
    n = int(input())
    max_value = 3 * n
    partition = 0
    skip = 2
    ans = []
    j = 1
    i = max_value
    while i > 0:
        if skip == 0:
            partition += 1
            # print(ans)
            ans.append(j)
            j += 1
            skip = 2
            i += 1
            if partition == n:
                break
        else:
            ans.append(i)
            skip -= 1
        i -= 1
    print(*ans)
    
