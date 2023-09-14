export default () => {
  return (
    <nav class="drop-shadow-xl ">
      {/* <div class="navbar bg-primary text-primary-content row-span-full gap-5"> */}
      <div class="navbar bg-accent row-span-full gap-5 flex justify-between">
        <a class="normal-case btn glass text-4xl text-secondary-focus text-accent-content  font-extrabold drop-shadow-md " href="/">
        🔭 MoonScope
        </a>
        <div class="flex space-x-4">
          <a href="/smoke" class="btn btn-primary text-xl drop-shadow-md " preload="mouseover">
            Smoke Tests
          </a>
          <a href="/dev" class="btn btn-secondary text-xl drop-shadow-md " preload="mouseover">
            Dev Tests
          </a>
          <a href="/coverage" class="btn base-300 text-xl drop-shadow-md " preload="mouseover">
            Coverage
          </a>
        </div>
      </div>
    </nav>
  );
};
