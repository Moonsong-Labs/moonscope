import { Elysia } from "elysia";
import { TestDataModel } from "./model";
import { z } from "zod";
import { TestDataSchema } from "./types";
import { Tables } from "./database";

export async function backEndApi() {
  for (const table of Tables) {
    const dbTable = TestDataModel.getInstance(table);
    await dbTable.ingest();
  }

  return new Elysia()
    .get("/", () => "Hello World")
    .get("/fetch", async ({ set, headers }) => {
      if (!headers.table) {
        set.status = 400;
        return { status: "error", message: "No table name provided" };
      }
      const allData = TestDataModel.getInstance(headers.table).fetchAllValues();
      set.status = 202;
      return allData;
    })
    .get("/fetch/:id", async ({ set, params: { id }, headers }) => {
      if (!headers.table) {
        set.status = 400;
        return { status: "error", message: "No table name provided" };
      }

      const result = TestDataModel.getInstance(headers.table).get(Number(id));

      set.status = result ? 202 : 404;
      return { result: result ? result : "NOT FOUND" };
    })
    .post("/insert", async ({ request, headers, body, set }) => {
      if (!headers.table) {
        set.status = 400;
        return { status: "error", message: "No table name provided" };
      }

      try {
        TestDataSchema.parse(body);
        const response = await TestDataModel.getInstance(headers.table).insert(headers.moonwallenv!, body as any);
        return { status: "ok", id: response };
      } catch (error) {
        set.status = 400;

        if (error instanceof z.ZodError) {
          console.error("Bad request received from REST API");
          console.error(error);
          return { status: "error", message: error.message, detail: error.issues };
        }

        return {
          status: "error",
          reason: "Improperly formatted input",
          message: (error as any).message,
          detail: (error as any).detail,
        };
      }
    })
    .listen(3001);
}
