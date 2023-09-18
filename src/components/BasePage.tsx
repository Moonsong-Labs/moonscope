import { TestDataModel } from "../model";
import { type Children } from "@kitajs/html";

export default ({ reportType }: { reportType: string }) => {
  const tableModel = TestDataModel.getInstance(`${reportType}_reports`);
  const data = tableModel.fetchAllEntries();

  return (
    <div
      class="flex flex-col w-full h-[calc(100vh-64px)] justify-center items-center base-200 p-8"
      hx-boost="true"
      un-cloak
      hx-ext="preload"
    >
      <div class="w-full min-w-lg max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg max-h-[85vh] overflow-y-auto">
        <div class="text-l breadcrumbs">
          <ul>
            <li class="mb-5 mr-5 glass rounded drop-shadow-md inline-block p-2 text-shadow font-bold base-300">
              <a href="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="w-4 h-4 mr-2 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  ></path>
                </svg>
                Home
              </a>
            </li>
            <li class="mb-5 mr-5 glass rounded drop-shadow-md inline-block p-2 text-shadow font-bold">
              <a href={`/${reportType}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="w-4 h-4 mr-2 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  ></path>
                </svg>
                {reportType.toLocaleUpperCase()}
              </a>
            </li>
          </ul>
        </div>

        <div class="overflow-x-auto">
          <table className="table table-xs">
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
                  <tr key={id}
                  class="hover:bg-gray-200 transition-colors duration-150">
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
