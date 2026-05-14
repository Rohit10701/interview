import sys

def solve():
    # 1. Precompute Smallest Prime Factor (SPF) up to 10^6
    # This is done once outside the test case loop.
    MAX_A = 1000001
    spf = list(range(MAX_A))
    for i in range(2, int(MAX_A**0.5) + 1):
        if spf[i] == i:
            for j in range(i*i, MAX_A, i):
                if spf[j] == j:
                    spf[j] = i

    def get_prime_info(n):
        if n <= 1:
            return True, 1
        p = spf[n]
        temp = n
        while temp % p == 0:
            temp //= p
        # If temp is 1, it only has one distinct prime factor (it's a prime power)
        if temp == 1:
            return True, p
        # Otherwise, it has multiple distinct factors (Alice can choose order)
        return False, -1

    # Read t (number of test cases)
    line = sys.stdin.readline()
    if not line:
        return
    t = int(line.strip())
    
    for _ in range(t):
        n = int(sys.stdin.readline().strip())
        arr = list(map(int, sys.stdin.readline().split()))
        
        # Check if already non-decreasing
        is_sorted = True
        for i in range(n - 1):
            if arr[i] > arr[i+1]:
                is_sorted = False
                break
        
        if is_sorted:
            print("Bob")
            continue
            
        # The logic:
        # If Alice can find ANY number with 2+ distinct prime factors, 
        # she can split it in descending order (e.g., 6 -> 3, 2) and Bob is toast.
        # If every number is a prime power (p^k), they MUST eventually 
        # become (p, p, p...). Bob only wins if that prime sequence is sorted.
        
        possible_for_bob = True
        last_prime = -1
        
        for x in arr:
            is_prime_power, p_base = get_prime_info(x)
            
            if not is_prime_power:
                possible_for_bob = False
                break
            
            if p_base < last_prime:
                possible_for_bob = False
                break
            
            last_prime = p_base
            
        if not possible_for_bob:
            print("Alice")
        else:
            print("Bob")

if __name__ == "__main__":
    solve()