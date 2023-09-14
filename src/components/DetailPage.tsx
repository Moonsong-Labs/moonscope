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

export default ({
  pageTitle,
  tableName,
  path
}: {
  pageTitle: string;
  tableName: string;
  path: string;
}) => {

  const tableModel = TestDataModel.getInstance(tableName);
  const data = tableModel.fetchAllEntries();

  return (
    <div
      class="flex flex-col w-full h-[calc(100vh-64px)] justify-center items-center base-200 p-8"
      hx-boost="true"
      un-cloak
      hx-ext="preload"
    >
      <div class="w-full min-w-lg max-w-6xl mx-auto rounded-xl shadow-lg p-6 max-h-[85vh] overflow-y-auto">
        <p class="glass rounded drop-shadow-md inline-block text-shadow font-bold">{pageTitle}</p>

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
              {data.map(([id, [env, testData]]) => (
                <tr key={id} class="hover:bg-gray-200 cursor-pointer transition-colors duration-150" hx-get={`${path}/${id}`} hx-trigger="click">
                  <td>{id}</td>
                  <td>{`${new Date(testData.startTime).toLocaleString()} (${currentTz()})`}</td>
                  <td>{env}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
