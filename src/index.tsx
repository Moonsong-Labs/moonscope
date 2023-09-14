import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { backEnd } from "./backend";
import BaseHtml from "./components/BaseHtml";
import BasePage from "./components/BasePage";
import NavBar from "./components/Nav";
import Splash from "./components/Splash";

const svr = await backEnd();

const app = new Elysia()
  .use(html())
  .use(staticPlugin())
  .get("/", () => {
    return (
      <BaseHtml>
      <Splash/>
      </BaseHtml>
    );
  })
  .get("/smoke", () => (
    <BaseHtml>
      <div class="App flex flex-col min-h-screen justify-between bg-base-300 w-full">
        <NavBar />
        <BasePage pageTitle="Smoke Tests" imageColor="red-500" imagePosition="left" tableName="smoke_reports" />
      </div>
    </BaseHtml>
  ))
  .get("/dev", () => (
    <BaseHtml>
      <div class="App flex flex-col min-h-screen justify-between bg-base-300 w-full">
        <NavBar />
        <BasePage pageTitle="Dev Tests" imageColor="green-500" imagePosition="center" tableName="dev_reports" />
      </div>
    </BaseHtml>
  ))
  .get("/coverage", () => (
    <BaseHtml>
      <div class="App flex flex-col min-h-screen justify-between bg-base-300 w-full">
        <NavBar />
        <BasePage pageTitle="Coverage" imageColor="yellow-500" imagePosition="right" tableName="coverage" />
      </div>
    </BaseHtml>
  ))
  .listen(3000);

console.log(`🦊 Elysia WebApp is running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`🦊 Elysia Server is running at ${svr.server?.hostname}:${svr.server?.port}`);
