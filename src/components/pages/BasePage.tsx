import { CrumbBuilder } from "../ui/BreadCrumbs";
import { currentTz } from "../../common/utils";
import { LinkedTableCell } from "../ui/Table";
import { TableData } from "../../types";

export default ({ reportType, data, sort, direction }: { reportType: string , data: any[], sort: string, direction: "asc" | "desc"  }) => {

  const toggleDirection = (current: "asc" | "desc") => current === "asc" ? "desc" : "asc";


  return (
    <div class="w-full min-w-lg max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg max-h-[85vh] overflow-y-auto">
      <CrumbBuilder reportType={reportType} />

      <div class="overflow-x-auto">
        <table class="table table-xs">
          <thead>
            <tr>
            <th>
                <a href={`/${reportType}?sort=id&direction=${sort === "id" ? toggleDirection(direction) : "asc"}`}>ID</a>
              </th>
              <th>
                <a href={`/${reportType}?sort=startTime`}>StartTime</a>
              </th>
              <th>
                <a href={`/${reportType}?sort=moonwall_env`}>Moonwall Environment</a>
              </th>
              <th>
                <a href={`/${reportType}?sort=testSuites`}>Test Suites</a>
              </th>
              <th>
                <a href={`/${reportType}?sort=totalTests`}>Total Tests</a>
              </th>
              <th>
                <a href={`/${reportType}?sort=failedTests`}>Failed Tests</a>
              </th>
              <th>
                <a href={`/${reportType}?sort=skippedTests`}>Skipped Tests</a>
              </th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {data.map(([id, [env, testData]]) => (
              <TableRow
                id={id}
                reportType={reportType}
                env={env}
                testData={testData}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableRow = ({ id, reportType, env, testData }: TableRowProps) => {
  const href = `/${reportType}/${id}`;

  return (
    <tr key={id} class="hover:bg-gray-200 transition-colors duration-150">
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
            <p class="badge badge-error text-bold drop-shadow-md font-semibold ">
              FAILED
            </p>
          </a>
        )}
      </td>
    </tr>
  );
};

interface TableRowProps {
  id: TableData["id"];
  reportType: string;
  env: TableData["moonwall_env"];
  testData: TableData["data"];
}
