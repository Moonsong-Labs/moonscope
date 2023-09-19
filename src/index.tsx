import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { type PropsWithChildren } from "@kitajs/html";
import { Elysia } from "elysia";
import { backEndApi } from "./api";
import {
  BaseHtml,
  BasePage,
  DetailPage,
  Expanded,
  Landing,
  NavBar,
} from "./components";
import { TestDataModel } from "./model";

const svr = await backEndApi();

const app = new Elysia()
  .use(html())
  .use(staticPlugin())
  .get("/", () => (
    <BaseHtml>
      <Landing />
    </BaseHtml>
  ))
  .get("/:type", ({ params: { type }, query: { sort, direction = "asc" } }) => {
    const tableModel = TestDataModel.getInstance(`${type}_reports`);
  
    const sortedData = typeof sort === "string"
      ? tableModel.fetchAllEntriesSorted(sort, direction as "asc" | "desc")
      : tableModel.fetchAllEntries();

    return (
      <Layout>
        <BasePage reportType={type} data={sortedData} direction={direction as any} sort={sort as any}  />
      </Layout>
    );
  })
  .get("/:type/:id", ({ params: { type, id } }) => (
    <Layout>
      <DetailPage reportType={type} id={id} />
    </Layout>
  ))
  .get("/:type/:id/:test", ({ params: { type, id, test } }) => (
    <Layout>
      <Expanded reportType={type} id={id} testCase={test} />
    </Layout>
  ))
  .listen(3000);

console.log(
  `🖥️ Elysia WebApp is running at ${app.server?.hostname}:${app.server?.port}`,
);
console.log(
  `⚙️ Elysia Server is running at ${svr.server?.hostname}:${svr.server?.port}`,
);

const Layout = ({ children, ...props }: PropsWithChildren) => (
  <BaseHtml>
    <div class="App flex flex-col min-h-screen justify-between bg-base-300 w-full">
      <NavBar />
      <div
        class="flex flex-col w-full h-[calc(100vh-64px)] justify-center items-center base-200 p-8"
        hx-boost="true"
        un-cloak
        hx-ext="preload"
      >
        {children}
      </div>
    </div>
  </BaseHtml>
);
