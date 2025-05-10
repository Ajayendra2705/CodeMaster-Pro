export type ProblemDetails = {
    contestId: number;
    index: string;
    name: string;
    rating?: number;
    tags: string[];
    statement: string;
    inputSpec: string;
    outputSpec: string;
    examples: Array<{ input: string; output: string }>;
    timeLimit: string;
    memoryLimit: string;
    solvedCount?: number;
  };
  
  export type SubmissionResultType = {
    status: 'success' | 'error';
    message: string;
    testsPassed?: number;
    totalTests?: number;
    executionTime?: string;
    memoryUsed?: string;
  };
  