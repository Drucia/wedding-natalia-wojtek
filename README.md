# Natalia & Wojtek — wedding site

A static wedding invitation (HTML, CSS, JavaScript), set up for [GitHub Pages](https://pages.github.com/) (this repo includes a `.nojekyll` file).

**Event date:** June 20, 2026.

## Project layout

| Path         | Contents |
|--------------|----------|
| `index.html` | Page markup |
| `css/`       | Styles |
| `js/`        | Scripts (including the envelope intro) |
| `images/`    | Images and graphics |
| `config.js`  | Editable settings in one place |

## Local preview

From the project directory, run any static file server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## GitHub Pages

In the GitHub repository: **Settings → Pages** — select the branch (e.g. `master` or `main`) and the root folder (`/`).

The repo includes **`.nojekyll`** so GitHub does not run Jekyll; everything is served as plain static files (HTML, CSS, JS, images). That matches what GitHub Pages can host: no server-side code, no secrets on the server (anything in `config.js` is public in the browser).

**Paths:** Asset links are **relative** (`css/…`, `js/…`, `images/…`), so they work both on `username.github.io` and on **project** URLs like `username.github.io/repo-name/`.

**Google Drive:** The site only shows the **share link** and the **`id=`** query snippet for the folder (from `config.js`). There is no embedded Drive preview on the page.
