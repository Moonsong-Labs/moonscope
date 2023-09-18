import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { backEnd } from "./backend";
import BaseHtml from "./components/BaseHtml";
import BasePage from "./components/BasePage";
import NavBar from "./components/Nav";
import Splash from "./components/Splash";
import DetailPage from "./components/DetailPage";
import TestAssert from "./components/Assert";

const svr = await backEnd();

const app = new Elysia()
  .use(html())
  .use(staticPlugin())
  .get("/", () => {
    return (
      <BaseHtml>
        <Splash />
      </BaseHtml>
    );
  })
  .get("/:type", ({ params: { type } }) => (
    <BaseHtml>
      <div class="App flex flex-col min-h-screen justify-between bg-base-300 w-full">
        <NavBar />
        <BasePage reportType={type} />
      </div>
    </BaseHtml>
  ))
  .get("/:type/:id", ({ params: { type, id }, query }) => {
    console.log(`query: ${JSON.stringify(query)}`)
    return (
    <BaseHtml>
      <div class="App flex flex-col min-h-screen justify-between bg-base-300 w-full">
        <NavBar />
        <DetailPage reportType={type} id={id} />
      </div>
    </BaseHtml>
  )})
  .get("/:type/:id/:test", ({ params: { type, id, test }, query }) => {
    console.log(`query: ${JSON.stringify(query)}`)
    const isExpanded = query.expanded === "true";
    return !isExpanded ? <TestAssert reportType={type} id={id} testId={test} /> : <></>;
  })
  .listen(3000);

console.log(`🦊 Elysia WebApp is running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`🦊 Elysia Server is running at ${svr.server?.hostname}:${svr.server?.port}`);
