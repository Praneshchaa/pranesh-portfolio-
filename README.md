# Pranesh Shrestha — Portfolio

Static site (no build step, no framework). Converted from a Claude Design
export into plain HTML/CSS/JS.

## Run locally
Just open `index.html`, or serve it:
    npx serve .

## Deploy to Vercel
    npm i -g vercel
    vercel

Or connect this folder as a GitHub repo and import it in the Vercel dashboard.
No build command / output directory settings needed — it's static.

## Notes
- All interactivity (timeline scrub/play, image crossfades, scroll-spy
  nav, article hover previews) is in `script.js`, no dependencies.
- Images in `uploads/` were resized (max 1800px) and compressed for web.
- `active` timeline row text is inserted via innerHTML in script.js and
  contains a couple of `&amp;` entities from the original content — fine
  as-is, but worth a look if you edit that JS.
