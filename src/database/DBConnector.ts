import postgres, { Sql } from "postgres";

class PostgreSQL {
  private static instance: PostgreSQL;
  private database: Sql;

  private constructor() {
    const check = checkEnvVars();
    if (check !== true) {
      throw new Error(`${check.join(",")} environment variables are not defined, cannot connect.`);
    }

    const connectionString = `postgres://${Bun.env.PGUSER}:${encodeURIComponent(Bun.env.PGPASSWORD!)}@${
      Bun.env.PGHOST
    }:${Bun.env.PGPORT}/${Bun.env.PGDATABASE}`;

    const sql = postgres(
      connectionString,
      Bun.env.LOCAL_DB === "true"
        ? {}
        : {
            ssl: {
              rejectUnauthorized: false,
            },
          }
    );

    this.database = sql;
  }

  public static getInstance(): PostgreSQL {
    if (!PostgreSQL.instance) {
      PostgreSQL.instance = new PostgreSQL();
    }
    return PostgreSQL.instance;
  }

  public db(): Sql {
    return this.database;
  }
}

export default PostgreSQL;

function checkEnvVars(): true | ConnectionEnvVars[] {
  const missingEnvVars = requiredEnvVars.filter((envVar) => Bun.env[envVar] === undefined);
  return missingEnvVars.length > 0 ? missingEnvVars : true;
}

type ConnectionEnvVars = (typeof requiredEnvVars)[keyof typeof requiredEnvVars];

const requiredEnvVars = ["PGHOST", "PGPORT", "PGDATABASE", "PGUSER", "PGPASSWORD"] as const;
