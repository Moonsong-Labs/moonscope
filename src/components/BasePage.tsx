import { TestDataModel } from "../model";
import { CrumbBuilder } from "./BreadCrumbs";
import { currentTz } from "../common/utils";
import { LinkedTableCell } from "./table";

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
        <CrumbBuilder reportType={reportType} />

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
                  <tr
                    key={id}
                    class="hover:bg-gray-200 transition-colors duration-150"
                  >
                    <LinkedTableCell href={href} children={id} />
                    <LinkedTableCell
                      href={href}
                      children={`${new Date(
                        testData.startTime,
                      ).toLocaleString()} (${currentTz()})`}
                    />
                    <LinkedTableCell href={href}>{env}</LinkedTableCell>
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
                    <td>
                      {testData.success ? (
                        <a href={href}>
                          <p class="badge badge-success drop-shadow-md font-semibold ">
                            PASS
                          </p>
                        </a>
                      ) : (
                        <a href={href}>
                          <p class="badge badge-fail text-bold drop-shadow-md font-semibold ">
                            FAILED
                          </p>
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
