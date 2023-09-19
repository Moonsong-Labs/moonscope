import { type PropsWithChildren } from "@kitajs/html";

export default ({ children }: PropsWithChildren) =>
  `<!DOCTYPE html>
<html lang="en" data-theme="autumn">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MoonScope</title>
  <script src="https://unpkg.com/htmx.org@1.9.5" integrity="sha384-xcuj3WpfgjlKF+FXhSQFQ0ZNr39ln+hwjN3npfM9VBnUskLolQAcN80McRIVOPuO" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>
  <script src="https://unpkg.com/htmx.org/dist/ext/preload.js"></script>
  <link rel="apple-touch-icon" sizes="180x180" href="/public/icons/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/public/icons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/public/icons/favicon-16x16.png">
  <link href="/public/output.css" rel="stylesheet">
  <link rel="manifest" href="/site.webmanifest">
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
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
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
