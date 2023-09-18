import { TestDataModel } from "../model";
import { type Children } from "@kitajs/html";

export default ({ pageTitle, reportType }: { pageTitle: string; reportType: string }) => {
  const tableModel = TestDataModel.getInstance(`${reportType}_reports`);
  const data = tableModel.fetchAllEntries();

  return (
    <div
      class="flex flex-col w-full h-[calc(100vh-64px)] justify-center items-center base-200 p-8"
      hx-boost="true"
      un-cloak
      hx-ext="preload"
    >
      <div class="w-full min-w-lg max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 max-h-[85vh] overflow-y-auto">
        <p class="mb-5 glass rounded bg-brown drop-shadow-md inline-block p-2 text-shadow font-bold">{pageTitle}</p>

        <div class="overflow-x-auto">
          <table class="table table-xs">
            <thead>
              <tr>
                <th>ID</th>
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
              {data.map(([id, [env, testData]]) => {
                const href = `/${reportType}/${id}`;

                return (
                  <tr key={id}>
                    <LinkedTableCell href={href}>{id}</LinkedTableCell>
                    <LinkedTableCell href={href}>{`${new Date(
                      testData.startTime
                    ).toLocaleString()} (${currentTz()})`}</LinkedTableCell>
                    <LinkedTableCell href={href}>{env}</LinkedTableCell>
                    <LinkedTableCell href={href}>{JSON.stringify(testData.numTotalTestSuites)}</LinkedTableCell>
                    <LinkedTableCell href={href}>{JSON.stringify(testData.numTotalTests)}</LinkedTableCell>
                    <LinkedTableCell href={href}>{JSON.stringify(testData.numFailedTests)}</LinkedTableCell>
                    <LinkedTableCell href={href}>{JSON.stringify(testData.numPendingTests)}</LinkedTableCell>
                    <td>
                      {testData.success ? (
                        <a href={href}>
                          <p class="badge badge-success drop-shadow-md font-semibold ">PASS</p>
                        </a>
                      ) : (
                        <a href={href}>
                          <p class="badge badge-fail text-bold drop-shadow-md font-semibold ">FAILED</p>
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const currentTz = () => {
  const timezoneOffsetMinutes = new Date().getTimezoneOffset();
  const hours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60);
  const minutes = Math.abs(timezoneOffsetMinutes) % 60;
  const hoursString = (hours < 10 ? "0" : "") + hours;
  const minutesString = (minutes < 10 ? "0" : "") + minutes;

  // Construct the timezone offset string
  const timezoneOffsetString = (timezoneOffsetMinutes > 0 ? "-" : "+") + hoursString + minutesString;
  return `GMT${timezoneOffsetString}`;
};

type LinkedTableCellProps = {
  href: string;
  children: Children;
};

const LinkedTableCell = ({ href, children }: LinkedTableCellProps) => (
  <td>
    <a href={href}>{children}</a>
  </td>
);
