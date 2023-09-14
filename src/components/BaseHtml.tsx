import { type PropsWithChildren } from "@kitajs/html";

export default ({ children }: PropsWithChildren) => `
<!DOCTYPE html>
<html lang="en" data-theme="autumn">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MoonScope</title>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
  <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>
  <script src="https://unpkg.com/htmx.org/dist/ext/preload.js"></script>
  <link
    href="https://cdn.jsdelivr.net/npm/daisyui@2.6.0/dist/full.css"
    rel="stylesheet"
    type="text/css"
  />
  <link rel="apple-touch-icon" sizes="180x180" href="/public/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/public/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/public/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    htmx.config.globalViewTransitions = true;
  </script>
  <script>
    window.__unocss = {
      rules: [
        [/^transition-name\\[([^\\]]+)\\]$/, ([, name]) => ({ 'view-transition-name': name })]
      ]
    };
  </script>
  <style>
    body {
      background-image: url('/public/assets/cmdCenter.png');
      background-size: cover;  /* To cover the entire viewport */
      background-repeat: no-repeat; /* To avoid repeating the image */
      background-position: center center; /* To center the image */
    }

    [un-cloak] {
      display: none;
    }

    body::before {
      content: "";
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
    }

  </style>
</head>

 ${children && (children! as any[]).join("")}

`;
