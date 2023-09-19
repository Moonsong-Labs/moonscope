import path from "path";
import { TestDataModel } from "../../model";
import { currentTz } from "../../common/utils";
import { CrumbBuilder, LinkedTableCell, NotFound } from "..";
import { TestResult } from "../../types";

export default ({
  reportType,
  id,
  collapse,
}: {
  reportType: string;
  id: string;
  collapse?: boolean;
}) => {
  const tableModel = TestDataModel.getInstance(`${reportType}_reports`);
  const data = tableModel.fetchEntry(parseInt(id));

  if (data === undefined) {
    return <NotFound />;
  }

  const [_, [env_name, testData]] = data;
  const href = `/${reportType}`;
  return (
    <div class="w-full min-w-lg max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 max-h-[85vh] overflow-y-auto">
      <CrumbBuilder reportType={reportType} runId={id} />

      <div class="overflow-x-auto">
        <table class="table table-xs">
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
                <td>404</td>
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

        <table class="table table-xs mt-5">
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
            {testData.testResults.map((testResult, index) => (
              <DetailTableRow
                reportType={reportType}
                id={id}
                testResult={testResult}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DetailTableRow = ({
  reportType,
  id,
  testResult,
  index,
}: DetailTableRowProps) => {
  const href = `/${reportType}/${id}/${index}`;
  return (
    <>
      <tr
        key={`${id}-${index}`}
        class="hover:bg-gray-200 transition-colors duration-150"
      >
        <LinkedTableCell
          href={href}
          children={path.basename(testResult.name)}
        />
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
            <div class="badge badge-ghost">no messages</div>
          )}
        </LinkedTableCell>
      </tr>

      <tr key={`details-${id}`} id={`details-${id}`} class="hidden"></tr>
    </>
  );
};

interface DetailTableRowProps {
  reportType: string;
  id: string;
  testResult: TestResult;
  index: number;
}
