import { DBConnector } from "../database";
import { TableData, TestData } from "../types/data";

// TODO: Turn these queries into DB queries which are cached
type TestRunStore = Map<number, [string, string, TestData]>;

class TestRunModel {
  private static instances: Map<string, TestRunModel> = new Map();
  private state: TestRunStore;
  private db = DBConnector.getInstance().db();
  tableName: string;

  private constructor(table: string) {
    this.state = new Map<number, [string, string, TestData]>();
    this.tableName = table;
  }

  async ingest(): Promise<void> {
    const table = this.tableName;
    const results: TableData[] = await this.db`select * from ${this.db(table)}`;
    results.forEach((result) => {
      console.log(
        `Ingesting run #${result.id} : ${result.moonwall_env} for ${this.tableName}`,
      );
      this.state.set(result.id, [result.moonwall_env, result.branch || "", result.data]);
    });
  }

  static getInstance(table: string): TestRunModel {
    if (!this.instances.has(table)) {
      this.instances.set(table, new TestRunModel(table));
    }
    return this.instances.get(table)!;
  }

  get(id: number): [string, string, TestData] | undefined {
    return this.state.get(id);
  }

  get currentState(): TestRunStore {
    return this.state;
  }

  fetchEntry(id: number): [number, [string, string, TestData]] | undefined {
    const values = this.state.get(id);
    return values ? [id, values] : undefined;
  }

  fetchTestResults(runId: number, testId: number) {
    return this.state.get(runId)?.[2].testResults;
  }

  fetchAllEntries(): [number, [string, string, TestData]][] {
    return Array.from(this.state.entries());
  }

  fetchAllEntriesSorted(
    sortBy: string,
    direction: "asc" | "desc" = "asc",
  ): [number, [string, string, TestData]][] {
    const validColumns = ["id", "moonwall_env", "branch", "data"];

    if (!validColumns.includes(sortBy)) {
      throw new Error("Invalid sort column");
    }

    const entriesArray = Array.from(this.state.entries());

    return entriesArray.sort((a, b) => {
      let comparisonValueA, comparisonValueB;

      switch (sortBy) {
        case "id":
          comparisonValueA = a[0];
          comparisonValueB = b[0];
          break;
        case "moonwall_env":
          comparisonValueA = a[1][0];
          comparisonValueB = b[1][0];
          break;
        case "branch":
          comparisonValueA = a[1][1];
          comparisonValueB = b[1][1];
          break;
        /// WIP
        case "data":
          comparisonValueA = a[1][2].startTime;
          comparisonValueB = b[1][2].startTime;
          break;
        default:
          return 0;
      }

      if (direction === "asc") {
        return comparisonValueA > comparisonValueB ? 1 : -1;
      } else {
        return comparisonValueA < comparisonValueB ? 1 : -1;
      }
    });
  }
  fetchAllValues(): [string, string, TestData][] {
    return Array.from(this.state.values());
  }

  async insert(moonwall_env: string, branch: string, data: TestData): Promise<number> {
    const requestData = { moonwall_env, branch, data: data as any };
    const insertResult = await this.db`INSERT INTO ${this.db(
      this.tableName,
    )} ${this.db(requestData, "moonwall_env", "branch", "data")} RETURNING id;`;

    this.state.set(insertResult[0].id, [moonwall_env, branch, data]);
    return insertResult[0].id;
  }
}

export default TestRunModel;
