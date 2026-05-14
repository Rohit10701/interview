for _ in range(int(input())):
    n = int(input())
    s = list(input())
    stack = []
    for ch in s:
        flag = False
        while stack and stack[-1] == ch:
            stack.pop()
            flag = True
        if not flag:
            stack.append(ch)
    print("YES" if len(stack) == 0 else "NO")