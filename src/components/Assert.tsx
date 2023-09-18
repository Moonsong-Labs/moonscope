import { TestDataModel } from "../model";

export default ({ reportType, id, testId, collapse }: { reportType: string; id: string; testId: string; collapse?: boolean }) => {
  const tableModel = TestDataModel.getInstance(`${reportType}_reports`);
  const data = tableModel.fetchEntry(parseInt(id));

  if (data === undefined) {
    return <div>404</div>;
  }

  const [_, [__, testData]] = data;
  const testResult = testData.testResults[parseInt(testId)];

  return (
    <tr key={`details-${testResult.name}`} id={`details-${testResult.name}`}>
      <td>
        <table class="table table-xs w-full base-200">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Failure Messages</th>
            </tr>
          </thead>
          <tbody>
            {testResult.assertionResults.map((assertion, index) => (
              <tr key={index}>
                <td>{assertion.title}</td>
                <td>
                  {assertion.status == "failed" ? (
                    <p class="badge badge-error text-bold drop-shadow-md font-semibold ">FAILED</p>
                  ) : (
                    <p class="badge badge-success drop-shadow-md font-semibold ">PASS</p>
                  )}
                </td>
                <td>{assertion.duration}ms</td>
                <td>{assertion.failureMessages.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
};
