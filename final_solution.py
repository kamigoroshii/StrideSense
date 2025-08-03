class Solution:
    def stackingMoney(self, A):
        """
        Find the sum of the difference of maximum and minimum number of coins 
        over all subarrays of A.
        
        Time complexity: O(n), Space complexity: O(n)
        
        Approach:
        1. For each element, calculate how many subarrays it contributes as maximum
        2. For each element, calculate how many subarrays it contributes as minimum  
        3. The contribution of element A[i] = A[i] * (max_count - min_count)
        4. Sum all contributions
        
        Use monotonic stacks to efficiently find previous/next smaller/greater elements.
        """
        n = len(A)
        if n == 0:
            return 0
            
        # Calculate contribution of each element as maximum
        max_contributions = self.calculate_max_contributions(A)
        
        # Calculate contribution of each element as minimum  
        min_contributions = self.calculate_min_contributions(A)
        
        # Sum up the total contribution
        total_sum = 0
        for i in range(n):
            total_sum += A[i] * (max_contributions[i] - min_contributions[i])
            
        return total_sum
    
    def calculate_max_contributions(self, A):
        """Calculate how many subarrays each element contributes as maximum"""
        n = len(A)
        contributions = [0] * n
        
        # Find previous smaller element for each index
        prev_smaller = [-1] * n
        stack = []
        for i in range(n):
            while stack and A[stack[-1]] <= A[i]:
                stack.pop()
            if stack:
                prev_smaller[i] = stack[-1]
            stack.append(i)
        
        # Find next smaller element for each index
        next_smaller = [n] * n
        stack = []
        for i in range(n-1, -1, -1):
            while stack and A[stack[-1]] <= A[i]:
                stack.pop()
            if stack:
                next_smaller[i] = stack[-1]
            stack.append(i)
        
        # Calculate contributions
        for i in range(n):
            left_count = i - prev_smaller[i]
            right_count = next_smaller[i] - i
            contributions[i] = left_count * right_count
            
        return contributions
    
    def calculate_min_contributions(self, A):
        """Calculate how many subarrays each element contributes as minimum"""
        n = len(A)
        contributions = [0] * n
        
        # Find previous greater element for each index
        prev_greater = [-1] * n
        stack = []
        for i in range(n):
            while stack and A[stack[-1]] >= A[i]:
                stack.pop()
            if stack:
                prev_greater[i] = stack[-1]
            stack.append(i)
        
        # Find next greater element for each index
        next_greater = [n] * n
        stack = []
        for i in range(n-1, -1, -1):
            while stack and A[stack[-1]] >= A[i]:
                stack.pop()
            if stack:
                next_greater[i] = stack[-1]
            stack.append(i)
        
        # Calculate contributions
        for i in range(n):
            left_count = i - prev_greater[i]
            right_count = next_greater[i] - i
            contributions[i] = left_count * right_count
            
        return contributions