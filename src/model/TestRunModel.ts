import { DBConnector } from "../database";
import { TableData, TestData } from "../types/data";

type TestRun = Map<number, [string, TestData]>;

class TestRunModel {
  private static instances: Map<string, TestRunModel> = new Map();
  private state: TestRun;
  private db = DBConnector.getInstance().db();
  tableName: string;

  private constructor(table: string) {
    this.state = new Map<number, [string, TestData]>();
    this.tableName = table;
  }

  async ingest(): Promise<void> {
    const table = this.tableName;
    const results: TableData[] = await this.db`select * from ${this.db(table)}`;
    results.forEach((result) => {
      console.log(`Ingesting run #${result.id} : ${result.moonwall_env} for ${this.tableName}`);
      this.state.set(result.id, [result.moonwall_env, result.data]);
    });
  }

  static getInstance(table: string): TestRunModel {
    if (!this.instances.has(table)) {
      this.instances.set(table, new TestRunModel(table));
    }
    return this.instances.get(table)!;
  }

  get(id: number): [string, TestData] | undefined {
    return this.state.get(id);
  }

  get currentState(): TestRun {
    return this.state;
  }

  fetchEntry(id: number): [number, [string, TestData]] | undefined {
    const values =this.state.get(id);
    return (values ? [id, values] : undefined)
  }

  fetchTestResults(runId:number, testId:number){
    return this.state.get(runId)?.[1].testResults
  }

  fetchAllEntries(): [number, [string, TestData]][] {
    return Array.from(this.state.entries());
  }

  fetchAllValues(): [string, TestData][] {
    return Array.from(this.state.values());
  }

  async insert(moonwall_env: string, data: TestData): Promise<number> {
    const requestData = { moonwall_env, data: data as any };
    const insertResult = await this.db`INSERT INTO ${this.db(this.tableName)} ${this.db(
      requestData,
      "moonwall_env",
      "data"
    )} RETURNING id;`;

    this.state.set(insertResult[0].id, [moonwall_env, data]);
    return insertResult[0].id;
  }
}

export default TestRunModel;
