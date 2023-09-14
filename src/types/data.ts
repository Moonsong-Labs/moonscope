export interface AssertionResult {
  ancestorTitles: string[];
  fullName: string;
  status: "passed" | "failed" | "pending" | "todo";
  title: string;
  duration: number;
  failureMessages: string[];
}

export interface TestResult {
  assertionResults: AssertionResult[];
  startTime: number;
  endTime: number;
  status: "passed" | "failed" | "pending" | "todo";
  message: string;
  name: string;
}

export interface TestData {
  numTotalTestSuites: number;
  numPassedTestSuites: number;
  numFailedTestSuites: number;
  numPendingTestSuites: number;
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  numPendingTests: number;
  numTodoTests: number;
  startTime: number;
  success: boolean;
  testResults: TestResult[];
}

export interface TableData {
  id: number;

  /**
   * This is the moonwall env, e.g. smoke_alphanet, dev_moonbase etc
   */
  moonwall_env: string;

  data: TestData;
}
