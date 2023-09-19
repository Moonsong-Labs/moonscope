import { z } from "zod";

export const AssertionResultSchema = z.object({
  ancestorTitles: z.array(z.string()),
  fullName: z.string(),
  status: z.union([
    z.literal("passed"),
    z.literal("failed"),
    z.literal("pending"),
    z.literal("todo"),
    z.literal("skipped"),
  ]),
  title: z.string(),
  duration: z.union([z.number(), z.undefined()]),
  failureMessages: z.array(z.string()),
});

export const TestResultSchema = z.object({
  assertionResults: z.array(AssertionResultSchema),
  startTime: z.number(),
  endTime: z.number(),
  status: z.union([
    z.literal("passed"),
    z.literal("failed"),
    z.literal("pending"),
    z.literal("todo"),
    z.literal("skipped"),
  ]),
  message: z.string(),
  name: z.string(),
});

export const TestDataSchema = z.object({
  numTotalTestSuites: z.number(),
  numPassedTestSuites: z.number(),
  numFailedTestSuites: z.number(),
  numPendingTestSuites: z.number(),
  numTotalTests: z.number(),
  numPassedTests: z.number(),
  numFailedTests: z.number(),
  numPendingTests: z.number(),
  numTodoTests: z.number(),
  startTime: z.number(),
  success: z.boolean(),
  testResults: z.array(TestResultSchema),
});
