import path from "path";
import { TestDataModel } from "../../model";
import { currentTz } from "../../common/utils";
import { CrumbBuilder, LinkedTableCell, NotFound } from "..";
import { TestData } from "../../types";

const ExpandedPage = ({
  reportType,
  id,
  testCase,
}: {
  reportType: string;
  id: string;
  testCase: string;
}) => {
  const tableModel = TestDataModel.getInstance(`${reportType}_reports`);
  const data = tableModel.fetchEntry(parseInt(id));
  const testCaseId = parseInt(testCase);

  if (!data) {
    return <NotFound />;
  }

  const [_, [__, testData]] = data;

  return (
    <div class="w-full min-w-lg max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 max-h-[85vh] overflow-y-auto ">
      <CrumbBuilder reportType={reportType} runId={id} expandTest={testCase} />
      <div class="overflow-x-auto">
        <TestFileTable data={data} id={id} href={`/${reportType}/${id}`} />
        <DetailsTable
          testData={testData}
          reportType={reportType}
          id={id}
          testCaseId={testCaseId}
        />
      </div>
    </div>
  );
};

const TestFileTable = ({
  data,
  id,
  href,
}: {
  data: [number, [string, TestData]];
  id: string;
  href: string;
}) => {
  const [_, [env_name, testData]] = data;

  return (
    <table name="testFile" class="table table-xs">
      <thead>
        <tr>
          <th>StartTime</th>
          <th>Moonwall Environment</th>
          <th>Test Suites</th>
          <th>Total Tests</th>
          <th>Failed Tests</th>
          <th>Skipped Tests</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {data === undefined ? (
          <tr key={id}>
            <td>
              <NotFound />;
            </td>
          </tr>
        ) : (
          <tr key={id}>
            <LinkedTableCell href={href}>{`${new Date(
              testData.startTime,
            ).toLocaleString()} (${currentTz()})`}</LinkedTableCell>
            <LinkedTableCell href={href}>{env_name}</LinkedTableCell>
            <LinkedTableCell href={href}>
              {JSON.stringify(testData.numTotalTestSuites)}
            </LinkedTableCell>
            <LinkedTableCell href={href}>
              {JSON.stringify(testData.numTotalTests)}
            </LinkedTableCell>
            <LinkedTableCell href={href}>
              {JSON.stringify(testData.numFailedTests)}
            </LinkedTableCell>
            <LinkedTableCell href={href}>
              {JSON.stringify(testData.numPendingTests)}
            </LinkedTableCell>
            <LinkedTableCell href={href}>
              {testData.success ? (
                <p class="badge badge-success drop-shadow-md font-semibold ">
                  PASS
                </p>
              ) : (
                <p class="badge badge-error text-bold drop-shadow-md font-semibold ">
                  FAILED
                </p>
              )}
            </LinkedTableCell>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const DetailsTable = ({
  testData,
  reportType,
  id,
  testCaseId,
}: {
  testData: TestData;
  reportType: string;
  id: string;
  testCaseId: number;
}) => {
  const testCaseResult = testData.testResults[testCaseId];
  const href = `/${reportType}/${id}`;

  return (
    <table name="details" class="table table-xs mt-5">
      <thead>
        <tr>
          <th>Test FileName</th>
          <th>StartTime</th>
          <th>EndTime</th>
          <th>Status</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {testData.testResults.map((testResult, index) => {
          const href = `/${reportType}/${id}/${index}`;

          return (
            <>
              <tr
                key={`${id}-${index}`}
                class="hover:bg-gray-200 transition-colors duration-150"
              >
                <LinkedTableCell href={href}>
                  {path.basename(testResult.name)}
                </LinkedTableCell>
                <LinkedTableCell href={href}>{`${new Date(
                  testResult.startTime,
                ).toLocaleString()} (${currentTz()})`}</LinkedTableCell>
                <LinkedTableCell href={href}>{`${new Date(
                  testResult.endTime,
                ).toLocaleString()} (${currentTz()})`}</LinkedTableCell>
                <LinkedTableCell href={href}>
                  {testResult.status == "failed" ? (
                    <p class="badge badge-error text-bold drop-shadow-md font-semibold ">
                      FAILED
                    </p>
                  ) : (
                    <p class="badge badge-success drop-shadow-md font-semibold ">
                      PASS
                    </p>
                  )}
                </LinkedTableCell>
                <LinkedTableCell href={href}>
                  {testResult.message ? (
                    testResult.message
                  ) : (
                    <div class="badge badge-outline text-xs">no messages</div>
                  )}
                </LinkedTableCell>
              </tr>
              {index === testCaseId ? (
                <tr
                  key={`details-${testResult.name}`}
                  id={`details-${testResult.name}`}
                >
                  <td colspan="5">
                    <table class="table table-xs w-full base-200 bg-gray-100 my-2">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Duration</th>
                          <th>Failure Messages</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testCaseResult.assertionResults.map(
                          (assertion, index) => (
                            <tr key={index} name="extraDetails">
                              <td>{assertion.title}</td>
                              <td>
                                {assertion.status == "failed" ? (
                                  <p class="badge badge-error text-bold drop-shadow-md font-semibold ">
                                    FAILED
                                  </p>
                                ) : (
                                  <p class="badge badge-success drop-shadow-md font-semibold ">
                                    PASS
                                  </p>
                                )}
                              </td>
                              <td>{assertion.duration}ms</td>
                              <td>{assertion.failureMessages.join(", ")}</td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ) : (
                <tr class="hidden"></tr>
              )}
            </>
          );
        })}
      </tbody>
    </table>
  );
};

export default ExpandedPage;
