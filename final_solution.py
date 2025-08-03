class Solution:
    def stackingMoney(self, A):
        n = len(A)
        if n == 0:
            return 0
            
        max_contributions = self.calculate_max_contributions(A)
        min_contributions = self.calculate_min_contributions(A)
        
        total_sum = 0
        for i in range(n):
            total_sum += A[i] * (max_contributions[i] - min_contributions[i])
            
        return total_sum
    
    def calculate_max_contributions(self, A):
        n = len(A)
        contributions = [0] * n
        
        prev_smaller = [-1] * n
        stack = []
        for i in range(n):
            while stack and A[stack[-1]] <= A[i]:
                stack.pop()
            if stack:
                prev_smaller[i] = stack[-1]
            stack.append(i)
        
        next_smaller = [n] * n
        stack = []
        for i in range(n-1, -1, -1):
            while stack and A[stack[-1]] <= A[i]:
                stack.pop()
            if stack:
                next_smaller[i] = stack[-1]
            stack.append(i)
        
        for i in range(n):
            left_count = i - prev_smaller[i]
            right_count = next_smaller[i] - i
            contributions[i] = left_count * right_count
            
        return contributions
    
    def calculate_min_contributions(self, A):
        n = len(A)
        contributions = [0] * n
        
        prev_greater = [-1] * n
        stack = []
        for i in range(n):
            while stack and A[stack[-1]] >= A[i]:
                stack.pop()
            if stack:
                prev_greater[i] = stack[-1]
            stack.append(i)
        
        next_greater = [n] * n
        stack = []
        for i in range(n-1, -1, -1):
            while stack and A[stack[-1]] >= A[i]:
                stack.pop()
            if stack:
                next_greater[i] = stack[-1]
            stack.append(i)
        
        for i in range(n):
            left_count = i - prev_greater[i]
            right_count = next_greater[i] - i
            contributions[i] = left_count * right_count
            
        return contributions