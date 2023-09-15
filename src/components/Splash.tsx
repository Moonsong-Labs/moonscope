export default () => {
    return (
      <>
        <style>
          {`
            @keyframes colorShift {
              0%, 100% {
                color: #f06;
              }
              50% {
                color: #9f6;
              }
            }
  
            .shift-color {
              animation-name: colorShift;
              animation-duration: 4s;
              animation-timing-function: ease-in-out;
              animation-iteration-count: infinite;
              -webkit-text-fill-color: currentColor;
            }
            * {
              scrollbar-width: thin;
              scrollbar-color: #888 #f0f0f0;
            }
            
          `}
        </style>
        <div class="hero min-h-screen">
          <div class="hero-overlay bg-opacity-60"></div>
          <div class="hero-content text-center text-neutral-content">
            <div>
              <h1 class="mb-5 text-6xl font-bold">
                🔭 <span class="shift-color drop-shadow-md">MoonScope</span>
              </h1>
              <p class="mb-5 glass rounded drop-shadow-md inline-block p-2">Access all your Moonwall test reports in one place.</p>
  
              <div class="flex gap-4 justify-center mt-4">
                <a class="btn btn-primary btn-wide text-xl drop-shadow-md text-shadow" href="/smoke">
                  Smoke Tests
                </a>
                <a class="btn btn-secondary btn-wide text-xl drop-shadow-md text-shadow" href="/dev">
                  Dev Tests
                </a>
                <a class="btn btn-accent btn-wide text-xl drop-shadow-md text-shadow" href="/coverage">
                  Coverage
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
