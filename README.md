# Portfolio

My personal portfolio site, built with plain HTML, CSS and JavaScript. It has no build step and no dependencies.

## Files

```
index.html        ← all the content (text, projects, links)
css/style.css     ← how it looks (colors are at the top)
js/main.js        ← animations, dark mode, mobile menu
assets/           ← favicon, resume.pdf, images
```

## Editing

- **Content:** open `index.html` and search for `TODO`. Every placeholder is marked.
- **Add a project:** copy one whole `<article class="card">…</article>` block and edit it.
- **Resume:** save your PDF as `assets/resume.pdf`.
- **Accent color:** change `--accent` in `css/style.css`. Light mode is set in `:root` and dark mode in `[data-theme="dark"]`.

## Preview locally

Double-click `index.html`, or run:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy (GitHub Pages, free)

1. Push to GitHub: `git add . && git commit -m "Portfolio" && git push`
2. On GitHub, go to the repo **Settings → Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**, then pick `main` and `/ (root)`. Save.
4. After about a minute the site is live at **https://jaryalarshita.github.io/portfolio/**

After that, every `git push` updates the site automatically.
