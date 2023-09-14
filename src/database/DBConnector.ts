import pgPromise, { IDatabase } from "pg-promise";

class PostgreSQL {
  private static instance: PostgreSQL;
  private database: IDatabase<any>;

  private constructor() {
    const pgp = pgPromise({});
    if (Bun.env.DB_CONNECTION_STRING === undefined) {
      throw new Error("DB_CONNECTION_STRING is not defined");
    }
    this.database = pgp(Bun.env.DB_CONNECTION_STRING);
  }

  public static getInstance(): PostgreSQL {
    if (!PostgreSQL.instance) {
      PostgreSQL.instance = new PostgreSQL();
    }
    return PostgreSQL.instance;
  }

  public db(): IDatabase<any> {
    return this.database;
  }
}

export default PostgreSQL;
