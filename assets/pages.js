/* ============================================================
   SQL, step by step — reference pages
   ============================================================ */
(function () {
  const TABLES = [
    { name: 'regions',     x: 20,  y: 20,  cols: ['region_id', 'region_name'] },
    { name: 'countries',   x: 255, y: 20,  cols: ['country_id', 'country_name', 'region_id'] },
    { name: 'locations',   x: 490, y: 20,  cols: ['location_id', 'street_address', 'postal_code', 'city', 'state_province', 'country_id'] },
    { name: 'departments', x: 725, y: 20,  cols: ['department_id', 'department_name', 'location_id'] },
    { name: 'jobs',        x: 20,  y: 270, cols: ['job_id', 'job_title', 'min_salary', 'max_salary'] },
    { name: 'employees',   x: 390, y: 230, cols: ['employee_id', 'first_name', 'last_name', 'email', 'phone_number', 'hire_date', 'job_id', 'salary', 'commission_pct', 'manager_id', 'department_id'] },
    { name: 'dependents',  x: 725, y: 290, cols: ['dependent_id', 'first_name', 'last_name', 'relationship', 'employee_id'] }
  ];
  // [fromTable, fromCol, toTable]  (to = the target's primary key, row 0)
  const RELS = [
    ['countries', 'region_id', 'regions'],
    ['locations', 'country_id', 'countries'],
    ['departments', 'location_id', 'locations'],
    ['employees', 'department_id', 'departments'],
    ['employees', 'job_id', 'jobs'],
    ['dependents', 'employee_id', 'employees']
  ];
  const W = 215, HEAD = 26, ROW = 19;
  const T = n => TABLES.find(t => t.name === n);
  const rowY = (t, i) => t.y + HEAD + 6 + i * ROW + ROW / 2;

  function diagram() {
    let s = '<svg viewBox="0 0 960 470" role="img" aria-label="Diagram of the seven tables and how they link">';
    RELS.forEach(([ft, fc, tt]) => {
      const a = T(ft), b = T(tt);
      const ay = rowY(a, a.cols.indexOf(fc)), by = rowY(b, 0);
      const ax = a.x > b.x ? a.x : a.x + W, bx = a.x > b.x ? b.x + W : b.x;
      const mid = (ax + bx) / 2;
      s += '<path class="rel" d="M' + ax + ' ' + ay + ' C' + mid + ' ' + ay + ',' + mid + ' ' + by + ',' + bx + ' ' + by + '"/>';
      s += '<circle class="end" cx="' + bx + '" cy="' + by + '" r="3"/>';
    });
    // manager_id → employee_id self link
    const e = T('employees'), my = rowY(e, 9), py = rowY(e, 0);
    s += '<path class="rel" d="M' + e.x + ' ' + my + ' C' + (e.x - 55) + ' ' + my + ',' + (e.x - 55) + ' ' + py + ',' + e.x + ' ' + py + '"/>';
    TABLES.forEach(t => {
      const h = HEAD + 12 + t.cols.length * ROW;
      s += '<g class="tbl"><rect class="box" x="' + t.x + '" y="' + t.y + '" width="' + W + '" height="' + h + '"/>';
      s += '<rect class="hd" x="' + (t.x + .5) + '" y="' + (t.y + .5) + '" width="' + (W - 1) + '" height="' + HEAD + '"/><line class="hr" x1="' + t.x + '" x2="' + (t.x + W) + '" y1="' + (t.y + HEAD) + '" y2="' + (t.y + HEAD) + '"/>';
      s += '<text class="h" x="' + (t.x + 12) + '" y="' + (t.y + 17) + '">' + t.name + '</text>';
      t.cols.forEach((c, i) => {
        s += '<text class="' + (i === 0 ? 'pk' : '') + '" x="' + (t.x + 12) + '" y="' + (rowY(t, i) + 4) + '">' + c + (i === 0 ? '  (key)' : '') + '</text>';
      });
      s += '</g>';
    });
    return s + '</svg>';
  }

  const DESCRIPTIONS = {
    regions: 'The four world regions the company operates in.',
    countries: 'Countries, each in one region. Some have no office yet.',
    locations: 'Office addresses. Bengaluru has an office but no department based there yet.',
    departments: 'Ten departments, each based at one location. Legal has no employees.',
    jobs: 'Job titles with the allowed monthly salary range.',
    employees: '35 employees. manager_id points at another employee. Tom Harris has no department yet.',
    dependents: 'Children and spouses of employees.'
  };

  window.GUIDE_PAGES = {

  /* ─────────── schema ─────────── */
  schema: {
    eyebrow: 'Reference', title: 'The practice database',
    lead: 'A small fictional company. Keep this page open in another tab while you work through the chapters.',
    body: '<h2>How the tables connect</h2><p>Each table\'s first column, shown in blue, is its primary key. Each line runs from a foreign key to the table it points at. <code>employees.manager_id</code> loops back to <code>employees</code> itself.</p><div class="diagram">' + diagram() + '</div><div id="schemaTables"></div>' +
      '<h2>Get a copy for your own computer</h2><ul><li><a href="db/company.sqlite" download>company.sqlite</a>: open it directly in <i>DB Browser for SQLite</i>.</li><li><a href="db/company.sql" download>company.sql</a>: the SQL script that builds it (SQLite).</li><li><a href="db/company_postgres.sql" download>company_postgres.sql</a>: the same database for PostgreSQL.</li></ul><p>See <a href="#/setup">Set up SQL on Windows</a> for step-by-step instructions.</p>',
    after(root, ctx) {
      const box = root.querySelector('#schemaTables');
      let html = '<h2>Tables and columns</h2>';
      TABLES.forEach(t => {
        const info = ctx.runSql(ctx.sandbox, "SELECT name, type, CASE WHEN pk THEN 'primary key' WHEN \"notnull\" THEN 'required' ELSE '' END FROM pragma_table_info('" + t.name + "')");
        const fks = ctx.runSql(ctx.sandbox, "SELECT \"from\", \"table\" FROM pragma_foreign_key_list('" + t.name + "')");
        const fkMap = {}; (fks.result ? fks.result.values : []).forEach(([f, tt]) => { fkMap[f] = tt; });
        const count = ctx.runSql(ctx.sandbox, 'SELECT COUNT(*) FROM ' + t.name);
        html += '<h3><code>' + t.name + '</code> <span class="meta">· ' + (count.result ? count.result.values[0][0] : '?') + ' rows</span></h3><p class="meta" style="margin-top:0">' + DESCRIPTIONS[t.name] + '</p>';
        html += '<table class="doc"><tr><th>Column</th><th>Type</th><th>Notes</th></tr>' + (info.result ? info.result.values : []).map(([n, ty, note]) =>
          '<tr><td><code>' + n + '</code></td><td>' + ty + '</td><td>' + [note, fkMap[n] ? '→ links to <code>' + fkMap[n] + '</code>' : ''].filter(Boolean).join(' · ') + '</td></tr>').join('') + '</table>';
        html += '<pre class="run" data-label="Peek at ' + t.name + '">SELECT * FROM ' + t.name + ' LIMIT 5;</pre>';
      });
      box.innerHTML = html;
    }
  },

  /* ─────────── playground ─────────── */
  playground: {
    eyebrow: 'Practice', title: 'Playground',
    lead: 'A blank space to try anything you like. Changes you make stay until you click <b>Reset data</b> or reload the page.',
    body: '<pre class="run" data-label="Playground">-- Write any SQL here. Several statements are fine — the last result is shown.\nSELECT e.first_name, e.last_name, d.department_name\nFROM   employees e\nJOIN   departments d ON d.department_id = e.department_id\nWHERE  d.department_name = \'IT\';</pre>' +
      '<div class="note tip"><b class="t">Ideas to explore</b><ul style="margin:4px 0 0"><li>Which city has the highest average salary?</li><li>Who has been at the company longest in each department?</li><li>Which manager has the most dependents across their whole team?</li><li>Invent a new table (projects? customers?), fill it with rows, and join it to employees.</li></ul></div>'
  },

  /* ─────────── cheat sheet ─────────── */
  cheatsheet: {
    eyebrow: 'Reference', title: 'Cheat sheet',
    lead: 'The whole guide on one page. Worth printing.',
    body: `
<h2>Querying</h2>
<pre class="code">SELECT   [DISTINCT] col, expr AS alias, AGG(col)
FROM     table t
[INNER | LEFT | RIGHT | FULL] JOIN other o ON o.key = t.key
WHERE    row_condition
GROUP BY col
HAVING   group_condition
ORDER BY col [ASC | DESC]
LIMIT    n [OFFSET m];</pre>
<p><b>The order the database works through them:</b> FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</p>
<h2>Conditions</h2>
<table class="doc">
<tr><td><code>= &lt;&gt; != &lt; &lt;= &gt; &gt;=</code></td><td>compare</td></tr>
<tr><td><code>BETWEEN 5 AND 10</code></td><td>range, both ends included</td></tr>
<tr><td><code>IN ('a', 'b')</code> / <code>NOT IN</code></td><td>in a list (watch out for NULLs with NOT IN)</td></tr>
<tr><td><code>LIKE 'A%'</code>, <code>LIKE '_b%'</code></td><td><code>%</code> = any number of characters, <code>_</code> = exactly one</td></tr>
<tr><td><code>IS NULL</code> / <code>IS NOT NULL</code></td><td>the only way to test for NULL</td></tr>
<tr><td><code>AND</code>, <code>OR</code>, <code>NOT</code></td><td>AND is worked out first, so use brackets</td></tr>
<tr><td><code>EXISTS (subquery)</code></td><td>true if the subquery returns any rows</td></tr>
</table>
<h2>Functions</h2>
<table class="doc">
<tr><th>Text</th><td><code>UPPER LOWER LENGTH SUBSTR(t,start,len) INSTR(t,x) REPLACE(t,a,b) TRIM</code>, <code>a || b</code></td></tr>
<tr><th>Numbers</th><td><code>ROUND(n,d) ABS(n) a % b</code> — and <code>7/2 = 3</code> but <code>7/2.0 = 3.5</code></td></tr>
<tr><th>Dates (SQLite)</th><td><code>date('now') date(d,'+7 days') strftime('%Y',d) julianday(a)-julianday(b)</code></td></tr>
<tr><th>NULL</th><td><code>COALESCE(a,b,…) NULLIF(a,b)</code></td></tr>
<tr><th>Logic</th><td><code>CASE WHEN cond THEN x WHEN … ELSE y END</code></td></tr>
<tr><th>Types</th><td><code>CAST(x AS INTEGER | REAL | TEXT)</code></td></tr>
<tr><th>Aggregates</th><td><code>COUNT(*) COUNT(col) COUNT(DISTINCT col) SUM AVG MIN MAX</code> — these ignore NULLs</td></tr>
<tr><th>Window</th><td><code>ROW_NUMBER() RANK() DENSE_RANK() LAG(col) SUM(col) OVER (PARTITION BY … ORDER BY …)</code></td></tr>
</table>
<h2>Joins at a glance</h2>
<table class="doc">
<tr><td><code>JOIN</code></td><td>only rows that match on both sides</td></tr>
<tr><td><code>LEFT JOIN</code></td><td>every left row, plus any matches (NULL where there's none)</td></tr>
<tr><td><code>FULL OUTER JOIN</code></td><td>every row from both sides</td></tr>
<tr><td><code>LEFT JOIN … WHERE right.id IS NULL</code></td><td>left rows that have <i>no</i> match</td></tr>
<tr><td>self join</td><td><code>FROM employees e JOIN employees m ON e.manager_id = m.employee_id</code></td></tr>
</table>
<h2>Subqueries, CTEs and sets</h2>
<pre class="code">WHERE salary > (SELECT AVG(salary) FROM employees)      -- one value
WHERE dept_id IN (SELECT dept_id FROM …)               -- a list
WITH x AS (SELECT …), y AS (SELECT … FROM x) SELECT … FROM y;
SELECT … UNION [ALL] | INTERSECT | EXCEPT SELECT …</pre>
<h2>Changing data</h2>
<pre class="code">INSERT INTO t (a, b) VALUES (1, 'x'), (2, 'y');
UPDATE t SET a = a + 1 WHERE …;        -- always use WHERE!
DELETE FROM t WHERE …;                 -- always use WHERE!
BEGIN;  …  COMMIT;   /   ROLLBACK;</pre>
<h2>Defining tables</h2>
<pre class="code">CREATE TABLE t (
  id     INTEGER PRIMARY KEY,
  name   TEXT NOT NULL UNIQUE,
  qty    INTEGER CHECK (qty >= 0) DEFAULT 0,
  dept   INTEGER REFERENCES departments(department_id)
);
ALTER TABLE t ADD COLUMN note TEXT;
CREATE VIEW v AS SELECT …;     CREATE INDEX idx_t_name ON t(name);
DROP TABLE t;                  DROP VIEW v;</pre>
<h2>Same idea, different database</h2>
<table class="doc">
<tr><th></th><th>SQLite</th><th>PostgreSQL</th><th>MySQL</th><th>SQL Server</th><th>Oracle</th></tr>
<tr><td>Top N</td><td><code>LIMIT n</code></td><td><code>LIMIT n</code></td><td><code>LIMIT n</code></td><td><code>TOP n</code></td><td><code>FETCH FIRST n ROWS ONLY</code></td></tr>
<tr><td>Join text</td><td><code>||</code></td><td><code>||</code></td><td><code>CONCAT()</code></td><td><code>+</code></td><td><code>||</code></td></tr>
<tr><td>NULL default</td><td><code>IFNULL</code></td><td><code>COALESCE</code></td><td><code>IFNULL</code></td><td><code>ISNULL</code></td><td><code>NVL</code></td></tr>
<tr><td>Today</td><td><code>date('now')</code></td><td><code>CURRENT_DATE</code></td><td><code>CURDATE()</code></td><td><code>GETDATE()</code></td><td><code>SYSDATE</code></td></tr>
<tr><td>EXCEPT</td><td><code>EXCEPT</code></td><td><code>EXCEPT</code></td><td><code>EXCEPT</code> (8.0.31+)</td><td><code>EXCEPT</code></td><td><code>MINUS</code></td></tr>
</table>
<p class="meta"><code>COALESCE</code>, <code>CASE</code>, <code>CAST</code>, standard <code>JOIN</code> syntax and window functions work in all five.</p>`
  },

  /* ─────────── setup ─────────── */
  setup: {
    eyebrow: 'Your own computer', title: 'Set up SQL on Windows',
    lead: 'You can do the whole guide in the browser. When you\'re ready to work like a professional, these free tools put a real database on your PC.',
    body: `
<div class="note tip"><b class="t">Which option should I pick?</b>Start with <b>Option 1</b> (about 5 minutes). It uses exactly the same database engine as this guide, so everything here works there unchanged. Move to <b>Option 2</b> (PostgreSQL) once you've finished about chapter 7. It's what most companies use in production.</div>

<h2>Option 1 — DB Browser for SQLite (easiest)</h2>
<p>A free, friendly app for opening SQLite database files. There's no server to set up and no passwords.</p>
<ol>
  <li>Go to <a href="https://sqlitebrowser.org/dl/" target="_blank" rel="noopener">sqlitebrowser.org/dl</a> and download <b>DB Browser for SQLite – Standard installer for 64-bit Windows</b>.</li>
  <li>Run the installer. Accept the defaults, and tick the option to add a Start-menu shortcut.</li>
  <li>Download the practice database: <a href="db/company.sqlite" download><b>company.sqlite</b></a>.</li>
  <li>Open DB Browser for SQLite → <b>Open Database</b> → choose <code>company.sqlite</code>.</li>
  <li>Click the <b>Execute SQL</b> tab, type a query, and press <b>Ctrl + Enter</b> (or the ▶ button) to run it.</li>
</ol>
<ul>
  <li><b>Browse Data</b> tab: look through a table like a spreadsheet.</li>
  <li><b>Database Structure</b> tab: see every table and column.</li>
  <li>DB Browser doesn't save your changes until you click <b>Write Changes</b> (Ctrl + S). Click <b>Revert Changes</b> to undo them. To start completely fresh, just download the file again.</li>
</ul>

<h2>Option 2 — PostgreSQL + pgAdmin (the real thing)</h2>
<p>PostgreSQL ("Postgres") is a free, professional database that's very popular with companies. The Windows installer also includes <b>pgAdmin</b>, a graphical tool for working with it.</p>
<ol>
  <li>Go to <a href="https://www.postgresql.org/download/windows/" target="_blank" rel="noopener">postgresql.org/download/windows</a> → <b>Download the installer</b> (from EDB) → pick the newest version for Windows x86-64.</li>
  <li>Run the installer and keep all the components ticked (PostgreSQL Server, pgAdmin 4, Command Line Tools). You can untick <i>Stack Builder</i>, since you won't need it.</li>
  <li>When it asks for a password for the <code>postgres</code> superuser, choose one and <b>write it down</b>. Keep the default port, <b>5432</b>.</li>
  <li>Open <b>pgAdmin 4</b> from the Start menu. Expand <i>Servers → PostgreSQL</i> and enter your password.</li>
  <li>Right-click <i>Databases</i> → <b>Create → Database…</b>, name it <code>company</code>, and click Save.</li>
  <li>Select the new <code>company</code> database, then click <b>Tools → Query Tool</b>.</li>
  <li>Download <a href="db/company_postgres.sql" download><b>company_postgres.sql</b></a>. In the Query Tool, open it (folder icon) or paste its contents in, then press <b>F5</b> to run it. That creates all the tables and data.</li>
  <li>Run <code>SELECT * FROM employees;</code> to check it worked.</li>
</ol>
<div class="note dialect"><b class="t">What changes in PostgreSQL</b>Almost everything in chapters 1–3 and 5–12 works as written. The main differences:
<ul style="margin:4px 0 0">
<li><b>Dates</b> are a real <code>DATE</code> type. Use <code>EXTRACT(YEAR FROM hire_date)</code> instead of <code>strftime('%Y', hire_date)</code>, <code>CURRENT_DATE</code> instead of <code>date('now')</code>, and <code>CURRENT_DATE - hire_date</code> for the number of days between.</li>
<li><code>LIKE</code> <b>is case-sensitive</b>. Use <code>ILIKE</code> to ignore case.</li>
<li><code>ROUND(x, 2)</code> needs a <code>NUMERIC</code> value: <code>ROUND(AVG(salary)::numeric, 2)</code>.</li>
<li>To see a table's structure: <code>SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'employees';</code></li>
<li><code>GROUP BY</code> is strict: every selected column must be grouped or aggregated. That's good discipline.</li>
</ul></div>

<h2>Option 3 — DBeaver (one tool for every database)</h2>
<p><a href="https://dbeaver.io/download/" target="_blank" rel="noopener">DBeaver Community</a> is a free tool that connects to SQLite, PostgreSQL, MySQL, SQL Server, Oracle and more. Many developers use it every day. Once it's installed: <b>Database → New Database Connection</b> → choose <b>SQLite</b> and browse to <code>company.sqlite</code>, or choose <b>PostgreSQL</b> with host <code>localhost</code>, port 5432, database <code>company</code>, user <code>postgres</code>.</p>

<h2>No install at all</h2>
<ul>
  <li><a href="https://sqliteonline.com" target="_blank" rel="noopener">SQLite Online</a>: an SQLite editor in the browser. You can also pick PostgreSQL or MySQL.</li>
  <li><a href="https://www.db-fiddle.com" target="_blank" rel="noopener">DB Fiddle</a>: paste <code>company_postgres.sql</code> into the left panel and write queries on the right. Choose PostgreSQL at the top.</li>
</ul>
`
  },

  /* ─────────── resources ─────────── */
  resources: {
    eyebrow: 'Keep going', title: 'More resources',
    lead: 'Hand-picked, free, and good. You don\'t need all of them. Pick one practice site and one course, and stick with them.',
    body: `
<h2>Practise every day</h2>
<table class="doc">
<tr><th>Site</th><th>Why it's good</th><th>When</th></tr>
<tr><td><a href="https://sqlbolt.com" target="_blank" rel="noopener">SQLBolt</a></td><td>Short interactive lessons with exercises in the browser. A great way to warm up and revise.</td><td>Alongside chapters 2–7</td></tr>
<tr><td><a href="https://sqlzoo.net" target="_blank" rel="noopener">SQLZoo</a></td><td>Lots of exercises on real-world tables (countries, Nobel prizes, football).</td><td>Chapters 3–9</td></tr>
<tr><td><a href="https://selectstarsql.com" target="_blank" rel="noopener">Select Star SQL</a></td><td>An interactive "book" that teaches SQL by investigating one real dataset. Very well written.</td><td>After chapter 6</td></tr>
<tr><td><a href="https://mystery.knightlab.com" target="_blank" rel="noopener">SQL Murder Mystery</a></td><td>Solve a crime using queries. Fun, and it really tests joins and subqueries.</td><td>After chapter 8</td></tr>
<tr><td><a href="https://pgexercises.com" target="_blank" rel="noopener">PostgreSQL Exercises</a></td><td>Graded exercises on a country-club booking database, from easy to hard.</td><td>After installing PostgreSQL</td></tr>
<tr><td><a href="https://www.hackerrank.com/domains/sql" target="_blank" rel="noopener">HackerRank SQL</a> · <a href="https://leetcode.com/studyplan/top-sql-50/" target="_blank" rel="noopener">LeetCode SQL 50</a></td><td>Interview-style problems. Employers do use these.</td><td>After chapter 13</td></tr>
</table>

<h2>Free courses</h2>
<ul>
  <li><a href="https://cs50.harvard.edu/sql/" target="_blank" rel="noopener"><b>CS50's Introduction to Databases with SQL</b></a> (Harvard). Video lectures, notes and problem sets. It also uses SQLite, so it fits well with this guide. The best next step if you want to go deeper.</li>
  <li><a href="https://www.khanacademy.org/computing/computer-programming/sql" target="_blank" rel="noopener"><b>Khan Academy — Intro to SQL</b></a>. A gentle pace with short videos. Good if you prefer watching to reading.</li>
</ul>

<h2>References to look things up</h2>
<ul>
  <li><a href="https://www.sqlitetutorial.net" target="_blank" rel="noopener">SQLite Tutorial</a> and <a href="https://www.postgresqltutorial.com" target="_blank" rel="noopener">PostgreSQL Tutorial</a>: clear pages for every command, with examples.</li>
  <li><a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener">W3Schools SQL</a>: quick syntax lookups.</li>
  <li><a href="https://www.sqlite.org/lang.html" target="_blank" rel="noopener">The official SQLite language reference</a>: the final word on exactly how something behaves.</li>
</ul>

<h2>When you're ready to go deeper</h2>
<ul>
  <li><a href="https://use-the-index-luke.com" target="_blank" rel="noopener">Use The Index, Luke</a>: a free online book about making SQL fast, written for developers.</li>
  <li>Learn <b>database design</b>: normalisation (1NF, 2NF, 3NF) and entity-relationship diagrams. CS50 SQL covers both well.</li>
  <li>Pick a direction. <b>Data analysis</b> means SQL, then spreadsheets or Power BI, then Python (pandas). <b>Software development</b> means SQL, then a programming language that talks to a database.</li>
</ul>

<h2>A suggested 6-week plan</h2>
<table class="doc">
<tr><th>Week</th><th>This guide</th><th>Extra practice</th></tr>
<tr><td>1</td><td>Chapters 1–3</td><td>SQLBolt lessons 1–6</td></tr>
<tr><td>2</td><td>Chapters 4–5</td><td>SQLZoo: SELECT basics, SELECT from World</td></tr>
<tr><td>3</td><td>Chapters 6–7</td><td>SQLBolt joins lessons, and install DB Browser for SQLite</td></tr>
<tr><td>4</td><td>Chapters 8–9</td><td>SQL Murder Mystery</td></tr>
<tr><td>5</td><td>Chapters 10–11</td><td>Install PostgreSQL and rebuild the company database there</td></tr>
<tr><td>6</td><td>Chapters 12–13</td><td>Start CS50 SQL, or HackerRank Basic and Intermediate</td></tr>
</table>
`
  }
  };
})();
