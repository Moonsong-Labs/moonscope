import { Elysia } from "elysia";
import { TestDataModel } from "./model";
import { z } from "zod";
import { bearer } from "@elysiajs/bearer";
import { TestData, TestDataSchema } from "./types";
import { Tables } from "./database";

export async function backEndApi() {
	for (const table of Tables) {
		const dbTable = TestDataModel.getInstance(table);
		await dbTable.ingest();
	}

	return new Elysia()
		.use(bearer())
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
		.post("/insert", async ({ bearer, body, request, headers, set }) => {
			if (!bearer) {
				set.status = 400;
				set.headers["WWW-Authenticate"] =
					`Bearer realm='sign', error="invalid_request"`;

				return "Unauthorized";
			}

			const authFail = validateBearerToken(bearer);

			if (authFail) {
				set.status = 401; // Unauthorized
				return "Unauthorized";
			}

			if (!headers.table) {
				set.status = 400;
				return { status: "error", message: "No table name provided" };
			}

			try {
				TestDataSchema.parse(body);

				if (!headers.moonwallenv) {
					throw new Error("No headers provided");
				}

				const response = await TestDataModel.getInstance(headers.table).insert(
					headers.moonwallenv,
					body as TestData,
				);
				return { status: "ok", id: response };
			} catch (error: unknown) {
				set.status = 400;

				if (error instanceof z.ZodError) {
					console.error("Bad request received from REST API");
					console.error(error);
					return {
						status: "error",
						message: error.message,
						detail: error.issues,
					};
				}

				if (error instanceof Error) {
					return {
						status: "error",
						reason: "Improperly formatted input",
						message: error.message,
					};
				}

				return {
					status: "error",
					reason: "Unknown error",
					message: "An unknown error occurred",
				};
			}
		})
		.listen(3001);
}

// Placeholder until we have a bearer token generaton source external to the API
function validateBearerToken(
	token?: string,
): false | { status: string; message: string } {
	const envToken = process.env.MOONSCOPE_TOKEN;
	if (envToken !== token) {
		return {
			status: "error",
			message: "Invalid bearer token",
		};
	}
	return false;
}
