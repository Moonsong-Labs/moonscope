import path from "path";
import { TestDataModel } from "../model";

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

export default ({ reportType, id, collapse }: { reportType: string; id: string; collapse?: boolean }) => {
  const tableModel = TestDataModel.getInstance(`${reportType}_reports`);
  const data = tableModel.fetchEntry(parseInt(id));

  if (data === undefined) {
    return <div>404</div>;
  }

  const [_, [env_name, testData]] = data;

  return (
    <div
      class="flex flex-col w-full h-[calc(100vh-64px)] justify-center items-center base-200 p-8"
      hx-boost="true"
      un-cloak
      hx-ext="preload"
    >
      <div class="w-full min-w-lg max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 max-h-[85vh] overflow-y-auto">
        <div class="text-l breadcrumbs">
          <ul>
            <li class="mb-5 mr-5 glass rounded drop-shadow-md inline-block p-2 text-shadow font-bold">
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
            <li class="mb-5 mr-5 glass rounded drop-shadow-md inline-block p-2 text-shadow font-bold">
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
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Test Run #{id}
            </li>
          </ul>
        </div>

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
                  <td>{`${new Date(testData.startTime).toLocaleString()} (${currentTz()})`}</td>
                  <td>{env_name}</td>
                  <td>{JSON.stringify(testData.numTotalTestSuites)}</td>
                  <td>{JSON.stringify(testData.numTotalTests)}</td>
                  <td>{JSON.stringify(testData.numFailedTests)}</td>
                  <td>{JSON.stringify(testData.numPendingTests)}</td>
                  <td>
                    {testData.success ? (
                      <p class="badge badge-success drop-shadow-md font-semibold ">PASS</p>
                    ) : (
                      <p class="badge badge-fail text-bold drop-shadow-md font-semibold ">FAILED</p>
                    )}
                  </td>
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
              {testData.testResults.map((testResult, index) => {
                return (
                  <>
                  
                    <tr
                      key={`${id}-${index}`}
                      class="hover:bg-gray-200 transition-colors duration-150"
                      data-expanded="false" 
                      // hx-get={`/${reportType}/${id}/${index}?=expanded=${!collapse}`}
                      hx-get={`/${reportType}/${id}/${index}`}
                      hx-trigger="click"
                      hx-swap="outerHTML"
                      hx-target={`#details-${id}`}
                      hx-vals="{ expanded: elt:data-expanded }"
                      hx-after-swap="updateExpandedState"
                      hx-replace-url="true"
                    >
                      <td>{path.basename(testResult.name)}</td>
                      <td>{`${new Date(testResult.startTime).toLocaleString()} (${currentTz()})`}</td>
                      <td>{`${new Date(testResult.endTime).toLocaleString()} (${currentTz()})`}</td>
                      <td>
                        {testResult.status == "failed" ? (
                          <p class="badge badge-fail text-bold drop-shadow-md font-semibold ">FAILED</p>
                        ) : (
                          <p class="badge badge-success drop-shadow-md font-semibold ">PASS</p>
                        )}
                      </td>
                      <td>
                        {testResult.message ? testResult.message : <div class="badge badge-ghost">no messages</div>}
                      </td>
                    </tr>

                    <tr key={`details-${id}`} id={`details-${id}`} class="hidden"></tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
