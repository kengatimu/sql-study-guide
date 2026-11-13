# SQL Study Guide

A hands-on SQL study guide for beginners. Every example and exercise runs against a real
SQLite database **inside the browser** (via [sql.js](https://sql.js.org)), so there's nothing to
install to get started.

- 13 chapters, from `SELECT` to window functions, each split into short steps: one idea, one runnable example, then a small "Your turn" task
- 78 auto-checked exercises with hints, expected output, and model answers; Continue unlocks when the step's task is solved (or skipped)
- Progress is saved in the learner's browser
- A practice database of a fictional company, downloadable for DB Browser for SQLite and PostgreSQL
- Windows setup guide, cheat sheet, and curated free resources

## Run locally

Opening `index.html` directly works in most browsers. A local server is more reliable:

```bash
python3 -m http.server 8765
# then open http://localhost:8765
```

Visit `#/selftest` to run every example and model answer and get a pass/fail report.

## Publish on GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**,
   set the branch to `main` and the folder to `/ (root)`, then click **Save**.
3. The site appears at `https://<username>.github.io/<repo-name>/` after a minute or two.

## Editing

| What | Where |
|---|---|
| Chapters and exercises (each `<h2>` becomes a step; an exercise's `at` picks its step) | `assets/content.js` |
| Reference pages (schema, cheat sheet, setup, resources) | `assets/pages.js` |
| App logic (runner, checker, progress) | `assets/app.js` |
| Styles | `assets/style.css` |
| Practice data | `db/company.sql`, then run `python3 tools/build_db.py` |

`tools/build_db.py` regenerates `assets/db.js`, `db/company.sqlite`, and `db/company_postgres.sql`
from `db/company.sql`. Run it after every data change, then check `#/selftest`.
