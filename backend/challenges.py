challenges = [
    {
        "id": 1,
        "title": "Binary Search Edge Case",
        "difficulty": "easy",
        "tags": ["binary-search", "edge-case"],
        "problem": "Implement binary search to return -1 if target is not found.",
        "buggy_code": """int binary_search(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    // FIXME
}""",
        "test_cases": [
            {"input": {"arr": [1,2,3,4], "target": 5}, "output": -1},
            {"input": {"arr": [], "target": 1}, "output": -1},
            {"input": {"arr": [1], "target": 1}, "output": 0}
        ],
        "correct_line": "return -1;"
    },
    {
        "id": 2,
        "title": "Sum of Digits Zero Handling",
        "difficulty": "easy",
        "tags": ["math", "edge-case"],
        "problem": "Calculate the sum of digits for a non-negative integer n.",
        "buggy_code": """int sum_digits(int n) {
    int total = 0;
    while (n > 0) {
        total += n % 10;
        n /= 10;
    }
    // FIXME
}""",
        "test_cases": [
            {"input": {"n": 0}, "output": 0},
            {"input": {"n": 5}, "output": 5},
            {"input": {"n": 123}, "output": 6}
        ],
        "correct_line": "return total;"
    },
    {
        "id": 3,
        "title": "Palindrome Empty String",
        "difficulty": "easy",
        "tags": ["strings", "edge-case"],
        "problem": "Check if a string is a palindrome. An empty string is a palindrome.",
        "buggy_code": """bool is_palindrome(string s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        if (s[l] != s[r]) return false;
        l++; r--;
    }
    // FIXME
}""",
        "test_cases": [
            {"input": {"s": ""}, "output": True},
            {"input": {"s": "a"}, "output": True},
            {"input": {"s": "aba"}, "output": True},
            {"input": {"s": "abc"}, "output": False}
        ],
        "correct_line": "return true;"
    },
    {
        "id": 4,
        "title": "Max in Array Empty Case",
        "difficulty": "medium",
        "tags": ["arrays", "edge-case"],
        "problem": "Return the maximum element in an array. If empty, return INT_MIN.",
        "buggy_code": """int max_in_array(vector<int>& arr) {
    if (arr.empty()) {
        // FIXME
    }
    int mx = arr[0];
    for (int i = 1; i < arr.size(); ++i) {
        if (arr[i] > mx) mx = arr[i];
    }
    return mx;
}""",
        "test_cases": [
            {"input": {"arr": []}, "output": -2147483648},
            {"input": {"arr": [1,2,3]}, "output": 3},
            {"input": {"arr": [-5,-2,-7]}, "output": -2}
        ],
        "correct_line": "return INT_MIN;"
    },
    {
        "id": 5,
        "title": "Factorial Zero Case",
        "difficulty": "easy",
        "tags": ["math", "recursion", "edge-case"],
        "problem": "Return the factorial of n. 0! = 1.",
        "buggy_code": """int factorial(int n) {
    if (n < 0) return -1;
    if (n == 0) {
        // FIXME
    }
    return n * factorial(n - 1);
}""",
        "test_cases": [
            {"input": {"n": 0}, "output": 1},
            {"input": {"n": 5}, "output": 120},
            {"input": {"n": 1}, "output": 1}
        ],
        "correct_line": "return 1;"
    },
    {
        "id": 6,
        "title": "Sum of Array Single Element",
        "difficulty": "easy",
        "tags": ["arrays", "edge-case"],
        "problem": "Return the sum of all elements in an array.",
        "buggy_code": """int sum_array(vector<int>& arr) {
    int sum = 0;
    for (int i = 0; i < arr.size(); ++i) {
        sum += arr[i];
    }
    // FIXME
}""",
        "test_cases": [
            {"input": {"arr": [42]}, "output": 42},
            {"input": {"arr": [1,2,3]}, "output": 6},
            {"input": {"arr": []}, "output": 0}
        ],
        "correct_line": "return sum;"
    },
    {
        "id": 7,
        "title": "Division by Zero",
        "difficulty": "medium",
        "tags": ["math", "edge-case"],
        "problem": "Return a / b. If b is zero, return -1.",
        "buggy_code": """int safe_divide(int a, int b) {
    if (b == 0) {
        // FIXME
    }
    return a / b;
}""",
        "test_cases": [
            {"input": {"a": 10, "b": 2}, "output": 5},
            {"input": {"a": 5, "b": 0}, "output": -1},
            {"input": {"a": 0, "b": 3}, "output": 0}
        ],
        "correct_line": "return -1;"
    },
    {
        "id": 8,
        "title": "First Element in Empty Vector",
        "difficulty": "medium",
        "tags": ["arrays", "edge-case"],
        "problem": "Return the first element of a vector. If empty, return -1.",
        "buggy_code": """int first_element(vector<int>& arr) {
    if (arr.empty()) {
        // FIXME
    }
    return arr[0];
}""",
        "test_cases": [
            {"input": {"arr": [10, 20, 30]}, "output": 10},
            {"input": {"arr": []}, "output": -1}
        ],
        "correct_line": "return -1;"
    },
    {
        "id": 9,
        "title": "String to Int Conversion",
        "difficulty": "medium",
        "tags": ["strings", "parsing", "edge-case"],
        "problem": "Convert a string to int. If the string is empty, return 0.",
        "buggy_code": """int string_to_int(string s) {
    if (s.empty()) {
        // FIXME
    }
    return stoi(s);
}""",
        "test_cases": [
            {"input": {"s": "123"}, "output": 123},
            {"input": {"s": ""}, "output": 0},
            {"input": {"s": "0"}, "output": 0}
        ],
        "correct_line": "return 0;"
    },
    {
        "id": 10,
        "title": "Check Even Odd",
        "difficulty": "easy",
        "tags": ["math", "edge-case"],
        "problem": "Return true if n is even, false if odd.",
        "buggy_code": """bool is_even(int n) {
    // FIXME
}""",
        "test_cases": [
            {"input": {"n": 2}, "output": True},
            {"input": {"n": 5}, "output": False},
            {"input": {"n": 0}, "output": True}
        ],
        "correct_line": "return n % 2 == 0;"
    }
]
