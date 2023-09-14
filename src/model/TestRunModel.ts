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
    const results = await this.db.any<TableData>(`SELECT * FROM ${this.tableName} ;`);
    results.forEach((result) => {
      console.log(`Ingesting run #${result.id} : ${result.moonwall_env} for ${this.tableName}`)
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

  fetchAllEntries(): [number, [string, TestData]][] {
    return Array.from(this.state.entries());
  }

  fetchAllValues(): [string, TestData][] {
    return Array.from(this.state.values());
  }

  async insert(moonwall_env: string, data: TestData): Promise<number> {
    const insertResult = await this.db.one<{ id: number }>(
      `INSERT INTO ${this.tableName} (moonwall_env, data) VALUES ( $1, $2::jsonb) RETURNING id;`,
      [moonwall_env, data]
    );

    this.state.set(insertResult.id, [moonwall_env, data]);

    return insertResult.id
  }
}

export default TestRunModel;
