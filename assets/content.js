/* ============================================================
   SQL Study Guide — chapters and exercises
   ------------------------------------------------------------
   Markup conventions inside `body`:
     <pre class="run">…</pre>   → becomes a live, editable query
     <pre class="code">…</pre>  → static code (not runnable)
     <div class="note tip|warn|dialect"><b class="t">Title</b>…</div>
   Inside HTML, write < as &lt; (e.g. salary &lt; 5000).

   Exercise fields:
     prompt   (HTML)   what to do — always name the exact columns
     solution (SQL)    a model answer; the checker compares results
     hint     (HTML)   optional nudge
     ordered  (bool)   true when row order matters (ORDER BY questions)
     check    (SQL)    for INSERT/UPDATE/DELETE/CREATE: query run after
                       the learner's SQL to compare the database state
     setup    (SQL)    optional SQL run before both answers
     level    easy | medium | hard
     at       which lesson step (index of the h2 section) shows it as
              "Your turn", or 'practice' for the chapter's final Practice step
   ============================================================ */
window.GUIDE = { chapters: [

/* ───────────────────────────── 1 ───────────────────────────── */
{
  id: 'intro', num: 1, minutes: 30,
  title: 'Databases, tables and your first query',
  summary: 'What a relational database is, how tables connect, and the company database you\'ll use all the way through.',
  body: `
<h2>What is a database?</h2>
<p>A <b>database</b> is an organised collection of data that a program — the <b>database management system</b> (DBMS) — looks after for you. It stores the data safely, lets many people use it at once, and answers questions about it quickly, even when there are millions of rows.</p>
<p>Most business databases are <b>relational</b>. That just means the data lives in <b>tables</b>, and tables are linked to each other through shared values. Popular relational databases include <b>PostgreSQL</b>, <b>MySQL</b>, <b>Microsoft SQL Server</b>, <b>Oracle</b> and <b>SQLite</b>. They all speak SQL, with small differences in "accent" — this guide points those out as you go.</p>

<h2>Tables, rows and columns</h2>
<p>A table looks a lot like a spreadsheet:</p>
<ul>
  <li>Each <b>column</b> holds one kind of information, and has a <b>data type</b> — text, a whole number, a decimal, a date.</li>
  <li>Each <b>row</b> (also called a <i>record</i>) is one thing: one employee, one department, one country.</li>
  <li>A <b>primary key</b> is a column whose value is unique for every row, like <code>employee_id</code>. It's how you point at exactly one row.</li>
  <li>A <b>foreign key</b> is a column that holds another table's primary key. <code>employees.department_id</code> holds a value from <code>departments.department_id</code> — that's the link between the two tables.</li>
</ul>
<p>Unlike a spreadsheet, a database <i>enforces</i> rules. It won't let you give two employees the same ID, or put an employee in a department that doesn't exist.</p>

<h2>Meet the practice database</h2>
<p>Everything in this guide uses one small, made-up company. It has offices around the world, ten departments and 35 employees.</p>
<table class="doc">
  <tr><th>Table</th><th>One row is…</th><th>Links to</th></tr>
  <tr><td><code>regions</code></td><td>a world region (Europe, Americas…)</td><td>—</td></tr>
  <tr><td><code>countries</code></td><td>a country</td><td>regions</td></tr>
  <tr><td><code>locations</code></td><td>an office address</td><td>countries</td></tr>
  <tr><td><code>departments</code></td><td>a department (Sales, IT…)</td><td>locations</td></tr>
  <tr><td><code>jobs</code></td><td>a job title with its salary range</td><td>—</td></tr>
  <tr><td><code>employees</code></td><td>an employee</td><td>jobs, departments, and other employees (their manager)</td></tr>
  <tr><td><code>dependents</code></td><td>an employee's child or spouse</td><td>employees</td></tr>
</table>
<p>There's a diagram and a full column list on <a href="#/schema">The practice database</a> page. Keep it open in a second tab while you work.</p>

<h2>Your first query</h2>
<p>Here is a complete SQL statement. Press <b>▶ Run</b>:</p>
<pre class="run">SELECT * FROM departments;</pre>
<p>Read it out loud: <i>"Select everything from departments."</i> The <code>*</code> means "all columns". You get every row and every column of the <code>departments</code> table.</p>
<p>Now change <code>departments</code> to <code>jobs</code> and run it again. Then try <code>employees</code>.</p>

<h2>SQL's three families of commands</h2>
<table class="doc">
  <tr><th>Family</th><th>Commands</th><th>Used to…</th><th>Chapters</th></tr>
  <tr><td>Querying</td><td><code>SELECT</code></td><td>read data and answer questions</td><td>2 – 9</td></tr>
  <tr><td>Data Manipulation (DML)</td><td><code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code></td><td>add, change and remove rows</td><td>10</td></tr>
  <tr><td>Data Definition (DDL)</td><td><code>CREATE</code>, <code>ALTER</code>, <code>DROP</code></td><td>create and change tables</td><td>11</td></tr>
</table>
<p>About 80% of day-to-day SQL work is <code>SELECT</code>, so that's where most of this guide goes.</p>

<h2>A few ground rules</h2>
<ul>
  <li><b>Keywords aren't case-sensitive.</b> <code>select</code>, <code>SELECT</code> and <code>Select</code> all work. Writing keywords in CAPITALS is a common habit because it makes queries easier to read.</li>
  <li><b>Text values are case-sensitive, and go in single quotes:</b> <code>'Sales'</code>. Double quotes are for column and table names, so don't use them for text.</li>
  <li><b>End each statement with a semicolon</b> <code>;</code>. It tells the database where one statement ends and the next begins.</li>
  <li><b>Spacing and new lines don't matter.</b> Spread a query over several lines so it's easy to read.</li>
</ul>
<pre class="run">select first_name, last_name
from   employees;</pre>
<div class="note tip"><b class="t">Don't be scared of errors</b>Misspell something on purpose — <code>SELEKT * FROM jobs;</code> — and run it. Error messages are clues, not punishments. For common ones, the guide adds a plain-English tip underneath.</div>

<h2>Comments</h2>
<p>Anything after <code>--</code> on a line is a comment, and the database ignores it. Use comments to leave notes for yourself.</p>
<pre class="run">-- Every country we have data for
SELECT * FROM countries;   -- 12 rows</pre>
`,
  exercises: [
    { at: 3, level: 'easy', prompt: '<p>Show every column and every row of the <code>regions</code> table.</p>', hint: 'Use <code>SELECT *</code> and the table name.', solution: 'SELECT * FROM regions;' },
    { at: 5, level: 'easy', prompt: '<p>Show every column of the <code>locations</code> table.</p>', solution: 'SELECT * FROM locations;' },
    { at: 6, level: 'easy', prompt: '<p>Show every column of the <code>dependents</code> table. How many dependents are there? (Look at the row count under the result.)</p>', solution: 'SELECT * FROM dependents;' }
  ]
},

/* ───────────────────────────── 2 ───────────────────────────── */
{
  id: 'select', num: 2, minutes: 45,
  title: 'SELECT: choosing columns',
  summary: 'Pick the columns you want, rename them, do arithmetic, join text together, and remove duplicates.',
  body: `
<h2>Choosing specific columns</h2>
<p>Most of the time you don't want <i>every</i> column. List the ones you want, separated by commas, in the order you want them:</p>
<pre class="run">SELECT first_name, last_name, salary
FROM   employees;</pre>
<div class="note warn"><b class="t">The classic mistake</b>A comma after the last column — <code>SELECT first_name, last_name, FROM employees</code> — causes a syntax error. Commas go <i>between</i> columns, not after the last one.</div>
<div class="note tip"><b class="t">Avoid SELECT * in real work</b><code>SELECT *</code> is great for exploring a table. In real applications, name the columns you need: it's faster, and your query keeps working if someone adds columns later.</div>

<h2>Arithmetic</h2>
<p>You can calculate new values from columns using <code>+</code>, <code>-</code>, <code>*</code> and <code>/</code>. Salaries here are monthly, so the yearly salary is <code>salary * 12</code>:</p>
<pre class="run">SELECT first_name, salary, salary * 12
FROM   employees;</pre>
<p>Normal maths rules apply: <code>*</code> and <code>/</code> happen before <code>+</code> and <code>-</code>, and brackets change the order. Compare these two:</p>
<pre class="run">SELECT first_name, salary,
       salary * 12 + 1000   AS bonus_after,
       (salary + 1000) * 12 AS raise_first
FROM   employees;</pre>
<p>A calculation doesn't change the data in the table. It only changes what the query shows.</p>

<h2>Column aliases with AS</h2>
<p>The column heading <code>salary * 12</code> isn't very friendly. An <b>alias</b> gives a result column a new name:</p>
<pre class="run">SELECT first_name AS name,
       salary * 12 AS annual_salary
FROM   employees;</pre>
<p>If the alias has spaces in it, wrap it in double quotes: <code>AS "Annual Salary"</code>. The word <code>AS</code> is optional (<code>salary * 12 annual_salary</code> works too), but using it makes queries easier to read.</p>

<h2>Joining text together</h2>
<p>The <code>||</code> operator glues values together into one piece of text (this is called <b>concatenation</b>):</p>
<pre class="run">SELECT first_name || ' ' || last_name AS full_name,
       email
FROM   employees;</pre>
<p>The <code>' '</code> in the middle is a <b>literal</b>: a fixed value typed straight into the query. Literals can be text (<code>'hello'</code>) or numbers (<code>42</code>):</p>
<pre class="run">SELECT first_name || ' works as ' || job_id AS sentence
FROM   employees;</pre>
<p>To put an apostrophe inside text, type it twice. One of our employees is called Liam O'Brien:</p>
<pre class="run">SELECT 'Liam O''Brien' AS name;</pre>
<div class="note dialect"><b class="t">Other databases</b><code>||</code> works in SQLite, PostgreSQL and Oracle. SQL Server uses <code>+</code> for text, and MySQL uses <code>CONCAT(first_name, ' ', last_name)</code>. <code>CONCAT()</code> also works in PostgreSQL, SQL Server and Oracle.</div>

<h2>NULL: the missing value</h2>
<p>Look at the <code>commission_pct</code> column. Most employees show <b>NULL</b>:</p>
<pre class="run">SELECT first_name, salary, commission_pct
FROM   employees;</pre>
<p><b>NULL means "no value" or "unknown".</b> It is not zero, and it is not an empty string. Only sales staff earn commission, so everybody else has NULL.</p>
<p>NULL spreads: <b>any calculation that involves NULL gives NULL.</b> If you don't know the commission, you can't know the salary plus commission either:</p>
<pre class="run">SELECT first_name, salary, commission_pct,
       salary * commission_pct AS commission_amount
FROM   employees;</pre>
<p>You'll learn how to handle NULLs in chapters 3 and 5. For now, just remember that they exist.</p>

<h2>Removing duplicates with DISTINCT</h2>
<p>Which jobs do our employees actually have? If you just select the column, every job appears once per employee:</p>
<pre class="run">SELECT job_id FROM employees;</pre>
<p><code>DISTINCT</code> removes repeated rows from the result:</p>
<pre class="run">SELECT DISTINCT job_id FROM employees;</pre>
<p>With more than one column, <code>DISTINCT</code> looks at the <i>combination</i> of values:</p>
<pre class="run">SELECT DISTINCT department_id, job_id FROM employees;</pre>

<h2>Looking at a table's structure</h2>
<p>To see which columns a table has and what type each one is, use:</p>
<pre class="run">SELECT name, type FROM pragma_table_info('employees');</pre>
<div class="note dialect"><b class="t">Other databases</b>This is a SQLite feature. In Oracle you'd type <code>DESCRIBE employees</code>. In MySQL, <code>DESCRIBE employees</code> or <code>SHOW COLUMNS FROM employees</code>. In PostgreSQL's command line, <code>\\d employees</code>. Every database also has <code>information_schema.columns</code>.</div>
`,
  exercises: [
    { at: 0, level: 'easy', prompt: '<p>Show the <code>department_id</code> and <code>department_name</code> of every department.</p>', solution: 'SELECT department_id, department_name FROM departments;' },
    { at: 'practice', level: 'easy', prompt: '<p>Show each job\'s <code>job_title</code>, <code>min_salary</code> and <code>max_salary</code>.</p>', solution: 'SELECT job_title, min_salary, max_salary FROM jobs;' },
    { at: 2, level: 'easy', prompt: '<p>For every job, show <code>job_title</code> and the gap between its maximum and minimum salary, named <code>salary_range</code>.</p>', hint: 'Subtract one column from the other, then give the result an alias with <code>AS</code>.', solution: 'SELECT job_title, max_salary - min_salary AS salary_range FROM jobs;' },
    { at: 3, level: 'easy', prompt: '<p>Show one column named <code>full_name</code> for every employee: their first name, a space, then their last name (e.g. <i>Grace Mwangi</i>).</p>', solution: "SELECT first_name || ' ' || last_name AS full_name FROM employees;" },
    { at: 'practice', level: 'medium', prompt: '<p>Each employee is getting a raise of 500 per month. Show <code>first_name</code>, <code>salary</code>, and their new <b>yearly</b> salary as <code>new_annual</code>.</p>', hint: 'Add the raise first, then multiply by 12. Brackets matter!', solution: 'SELECT first_name, salary, (salary + 500) * 12 AS new_annual FROM employees;' },
    { at: 5, level: 'easy', prompt: '<p>Show the list of distinct <code>country_id</code> values that appear in the <code>locations</code> table.</p>', solution: 'SELECT DISTINCT country_id FROM locations;' },
    { at: 'practice', level: 'medium', prompt: '<p>Make a contact list with one column named <code>contact</code>, in the form <i>Grace Mwangi &lt;gmwangi@company.example&gt;</i>.</p>', hint: 'Concatenate five pieces: first name, a space, last name, <code>\' &lt;\'</code>, email and <code>\'&gt;\'</code>.', solution: "SELECT first_name || ' ' || last_name || ' <' || email || '>' AS contact FROM employees;" }
  ]
},

/* ───────────────────────────── 3 ───────────────────────────── */
{
  id: 'where', num: 3, minutes: 60,
  title: 'Filtering and sorting rows',
  summary: 'WHERE picks which rows you get; ORDER BY puts them in order; LIMIT gives you just the top few.',
  body: `
<h2>WHERE: keeping only the rows you want</h2>
<p><code>WHERE</code> comes after <code>FROM</code> and holds a <b>condition</b>. Only the rows where the condition is true are returned.</p>
<pre class="run">SELECT first_name, last_name, salary
FROM   employees
WHERE  salary > 15000;</pre>
<p>Text and dates go in single quotes:</p>
<pre class="run">SELECT first_name, last_name, job_id
FROM   employees
WHERE  job_id = 'DEV';</pre>
<div class="note warn"><b class="t">Case matters inside quotes</b><code>WHERE job_id = 'dev'</code> returns nothing, because the stored value is <code>'DEV'</code>. Try it.</div>

<h2>Comparison operators</h2>
<table class="doc">
  <tr><th>Operator</th><th>Meaning</th><th>Example</th></tr>
  <tr><td><code>=</code></td><td>equal to</td><td><code>department_id = 60</code></td></tr>
  <tr><td><code>&lt;&gt;</code> or <code>!=</code></td><td>not equal to</td><td><code>job_id &lt;&gt; 'DEV'</code></td></tr>
  <tr><td><code>&gt;</code>, <code>&gt;=</code></td><td>greater than (or equal to)</td><td><code>salary &gt;= 10000</code></td></tr>
  <tr><td><code>&lt;</code>, <code>&lt;=</code></td><td>less than (or equal to)</td><td><code>hire_date &lt; '2015-01-01'</code></td></tr>
</table>
<p>Dates are stored as text in the form <code>'YYYY-MM-DD'</code>, so comparisons work just like you'd expect. Here's everyone hired before 2015:</p>
<pre class="run">SELECT first_name, last_name, hire_date
FROM   employees
WHERE  hire_date &lt; '2015-01-01';</pre>

<h2>BETWEEN, IN and LIKE</h2>
<p><code>BETWEEN a AND b</code> checks a range, and <b>includes both ends</b>:</p>
<pre class="run">SELECT first_name, salary
FROM   employees
WHERE  salary BETWEEN 5000 AND 7000;</pre>
<p><code>IN (…)</code> checks against a list. It's a shorter way of writing several <code>=</code> conditions:</p>
<pre class="run">SELECT first_name, department_id
FROM   employees
WHERE  department_id IN (20, 30, 50);</pre>
<p><code>LIKE</code> matches text against a pattern. <code>%</code> stands for "any number of characters (including none)". <code>_</code> stands for "exactly one character".</p>
<pre class="run">-- last names starting with M
SELECT first_name, last_name FROM employees WHERE last_name LIKE 'M%';</pre>
<pre class="run">-- first names whose second letter is 'a'
SELECT first_name FROM employees WHERE first_name LIKE '_a%';</pre>
<div class="note dialect"><b class="t">Other databases</b>In SQLite and MySQL, <code>LIKE</code> ignores upper/lower case by default. In PostgreSQL and Oracle it doesn't. PostgreSQL has <code>ILIKE</code> for case-insensitive matching.</div>

<h2>IS NULL</h2>
<p>You can't test for NULL with <code>=</code>, because NULL means "unknown", and nothing is ever equal to unknown. Use <code>IS NULL</code> or <code>IS NOT NULL</code> instead:</p>
<pre class="run">-- who has no department yet?
SELECT first_name, last_name, department_id
FROM   employees
WHERE  department_id IS NULL;</pre>
<p>Now try changing <code>IS NULL</code> to <code>= NULL</code>. You get no rows at all. This catches out experienced developers too.</p>

<h2>Combining conditions: AND, OR, NOT</h2>
<pre class="run">-- developers earning over 10,000
SELECT first_name, job_id, salary
FROM   employees
WHERE  job_id = 'DEV' AND salary > 10000;</pre>
<pre class="run">-- anyone in Finance OR anyone earning over 20,000
SELECT first_name, department_id, salary
FROM   employees
WHERE  department_id = 20 OR salary > 20000;</pre>
<p><code>NOT</code> flips a condition: <code>NOT IN</code>, <code>NOT LIKE</code>, <code>NOT BETWEEN</code>, <code>IS NOT NULL</code>.</p>
<h3>Watch the order</h3>
<p><code>AND</code> is worked out before <code>OR</code>, just as multiplication comes before addition. This query <i>looks</i> like it means "sales reps or managers, earning over 10,000", but it doesn't:</p>
<pre class="run">SELECT first_name, job_id, salary
FROM   employees
WHERE  job_id = 'SA_REP' OR job_id = 'SA_MAN' AND salary > 10000;</pre>
<p>It returns <i>every</i> sales rep, whatever they earn. Brackets fix it:</p>
<pre class="run">SELECT first_name, job_id, salary
FROM   employees
WHERE  (job_id = 'SA_REP' OR job_id = 'SA_MAN') AND salary > 10000;</pre>
<div class="note tip"><b class="t">Rule of thumb</b>Whenever a condition mixes <code>AND</code> and <code>OR</code>, add brackets — even when you think you don't need them.</div>

<h2>ORDER BY: sorting</h2>
<p>Without <code>ORDER BY</code>, the database can return rows in <i>any</i> order. If the order matters to you, ask for it:</p>
<pre class="run">SELECT first_name, last_name, salary
FROM   employees
ORDER  BY salary DESC;</pre>
<p><code>ASC</code> (smallest first) is the default. <code>DESC</code> gives you largest first. You can sort by several columns: here, by department first, then by salary within each department:</p>
<pre class="run">SELECT department_id, first_name, salary
FROM   employees
ORDER  BY department_id, salary DESC;</pre>
<p>You can also sort by an alias: <code>ORDER BY annual_salary</code>.</p>

<h2>LIMIT: the top N</h2>
<pre class="run">-- the three highest earners
SELECT first_name, last_name, salary
FROM   employees
ORDER  BY salary DESC
LIMIT  3;</pre>
<p><code>LIMIT 3 OFFSET 3</code> skips the first three rows and returns the next three. That's how "page 2" of results works on websites.</p>
<div class="note dialect"><b class="t">Other databases</b>SQLite, PostgreSQL and MySQL use <code>LIMIT</code>. SQL Server uses <code>SELECT TOP 3 …</code>. The SQL standard way, which works in Oracle 12c+, PostgreSQL and SQL Server, is <code>FETCH FIRST 3 ROWS ONLY</code>.</div>

<h2>The order of the clauses</h2>
<pre class="code">SELECT   columns
FROM     table
WHERE    row conditions
ORDER BY columns
LIMIT    n;</pre>
<p>You always <i>write</i> them in this order. You'll add two more clauses, <code>GROUP BY</code> and <code>HAVING</code>, in chapter 6.</p>
`,
  exercises: [
    { at: 0, level: 'easy', prompt: '<p>Show <code>first_name</code>, <code>last_name</code> and <code>salary</code> of employees earning more than 10,000.</p>', solution: 'SELECT first_name, last_name, salary FROM employees WHERE salary > 10000;' },
    { at: 1, level: 'easy', prompt: '<p>Show <code>first_name</code> and <code>last_name</code> of everyone in department 60 (IT).</p>', solution: 'SELECT first_name, last_name FROM employees WHERE department_id = 60;' },
    { at: 2, level: 'easy', prompt: '<p>Show <code>first_name</code>, <code>last_name</code> and <code>hire_date</code> of everyone hired during 2016.</p>', hint: 'Use <code>BETWEEN \'2016-01-01\' AND \'2016-12-31\'</code>, or <code>LIKE \'2016%\'</code>.', solution: "SELECT first_name, last_name, hire_date FROM employees WHERE hire_date BETWEEN '2016-01-01' AND '2016-12-31';" },
    { at: 3, level: 'easy', prompt: '<p>Show <code>first_name</code>, <code>last_name</code> and <code>commission_pct</code> of everyone who earns a commission.</p>', hint: 'Employees with no commission have NULL.', solution: 'SELECT first_name, last_name, commission_pct FROM employees WHERE commission_pct IS NOT NULL;' },
    { at: 4, level: 'medium', prompt: '<p>Show <code>first_name</code> and <code>last_name</code> of employees whose last name contains the letter <b>a</b> anywhere, <b>and</b> who work in department 40 or 60.</p>', hint: '<code>LIKE \'%a%\'</code>, plus <code>IN</code>. Brackets aren\'t needed with <code>IN</code>, but they never hurt.', solution: "SELECT first_name, last_name FROM employees WHERE last_name LIKE '%a%' AND department_id IN (40, 60);" },
    { at: 'practice', level: 'medium', prompt: '<p>Show <code>first_name</code>, <code>job_id</code> and <code>salary</code> of everyone who is <b>not</b> a developer (<code>DEV</code>) or support agent (<code>SUP_AGT</code>) and earns less than 6,000.</p>', solution: "SELECT first_name, job_id, salary FROM employees WHERE job_id NOT IN ('DEV', 'SUP_AGT') AND salary < 6000;" },
    { at: 5, level: 'easy', ordered: true, prompt: '<p>List every employee\'s <code>first_name</code>, <code>last_name</code> and <code>hire_date</code>, newest hire first.</p>', solution: 'SELECT first_name, last_name, hire_date FROM employees ORDER BY hire_date DESC;' },
    { at: 6, level: 'medium', ordered: true, prompt: '<p>Show the <code>first_name</code>, <code>last_name</code> and <code>salary</code> of the <b>five</b> lowest-paid employees, lowest first.</p>', solution: 'SELECT first_name, last_name, salary FROM employees ORDER BY salary ASC LIMIT 5;' },
    { at: 'practice', level: 'medium', ordered: true, prompt: '<p>List <code>department_id</code>, <code>last_name</code> and <code>salary</code> of everyone who has a department, sorted by department (ascending) and then by salary (highest first).</p>', solution: 'SELECT department_id, last_name, salary FROM employees WHERE department_id IS NOT NULL ORDER BY department_id, salary DESC;' }
  ]
},

/* ───────────────────────────── 4 ───────────────────────────── */
{
  id: 'functions', num: 4, minutes: 60,
  title: 'Functions for text, numbers and dates',
  summary: 'Built-in functions that change values row by row: upper-casing names, rounding numbers, working with dates.',
  body: `
<h2>What is a function?</h2>
<p>A function takes one or more inputs (called <b>arguments</b>, written in brackets) and gives back a value. The functions in this chapter are <b>single-row functions</b>: they work on each row on its own, so you get one answer per row.</p>
<pre class="run">SELECT last_name, UPPER(last_name), LENGTH(last_name)
FROM   employees;</pre>
<p>You can use functions in <code>SELECT</code>, in <code>WHERE</code> and in <code>ORDER BY</code>, and you can put one function inside another.</p>

<h2>Text functions</h2>
<table class="doc">
  <tr><th>Function</th><th>Does</th><th>Example → result</th></tr>
  <tr><td><code>UPPER(t)</code> / <code>LOWER(t)</code></td><td>change the case</td><td><code>UPPER('kenya')</code> → <code>KENYA</code></td></tr>
  <tr><td><code>LENGTH(t)</code></td><td>number of characters</td><td><code>LENGTH('Nairobi')</code> → 7</td></tr>
  <tr><td><code>SUBSTR(t, start, len)</code></td><td>cut out part of the text (counting starts at 1)</td><td><code>SUBSTR('Database', 1, 4)</code> → <code>Data</code></td></tr>
  <tr><td><code>INSTR(t, find)</code></td><td>position of <i>find</i> in <i>t</i> (0 if it's not there)</td><td><code>INSTR('a@b.com', '@')</code> → 2</td></tr>
  <tr><td><code>REPLACE(t, old, new)</code></td><td>swap every <i>old</i> for <i>new</i></td><td><code>REPLACE('2024-01-08', '-', '/')</code></td></tr>
  <tr><td><code>TRIM(t)</code>, <code>LTRIM</code>, <code>RTRIM</code></td><td>remove spaces from the ends</td><td><code>TRIM('  hi  ')</code> → <code>hi</code></td></tr>
</table>
<pre class="run">SELECT email,
       INSTR(email, '@')                     AS at_position,
       SUBSTR(email, 1, INSTR(email, '@') - 1) AS username
FROM   employees;</pre>
<p>That last column puts one function inside another: it finds the <code>@</code>, then takes everything before it. The innermost function runs first. This is called <b>nesting</b>.</p>
<p>Functions in <code>WHERE</code> are handy when you can't be sure how the text was typed:</p>
<pre class="run">SELECT first_name, last_name
FROM   employees
WHERE  LOWER(last_name) = 'okafor';</pre>
<div class="note dialect"><b class="t">Other databases</b>SQL Server uses <code>LEN()</code> and <code>SUBSTRING()</code>. MySQL and PostgreSQL accept both <code>SUBSTR</code> and <code>SUBSTRING</code>. Oracle and MySQL have <code>LPAD</code>/<code>RPAD</code> for padding text to a fixed width. <code>INSTR</code> is called <code>POSITION</code> or <code>STRPOS</code> in PostgreSQL, and <code>CHARINDEX</code> in SQL Server.</div>

<h2>Number functions</h2>
<table class="doc">
  <tr><th>Function</th><th>Does</th><th>Example → result</th></tr>
  <tr><td><code>ROUND(n, d)</code></td><td>round to <i>d</i> decimal places</td><td><code>ROUND(3.14159, 2)</code> → 3.14</td></tr>
  <tr><td><code>ABS(n)</code></td><td>drop the minus sign</td><td><code>ABS(-7)</code> → 7</td></tr>
  <tr><td><code>a % b</code></td><td>remainder after dividing</td><td><code>17 % 5</code> → 2</td></tr>
</table>
<pre class="run">SELECT first_name, salary,
       ROUND(salary / 30, 2)     AS per_day,
       ROUND(salary * 12 / 1000) AS annual_thousands
FROM   employees;</pre>
<div class="note warn"><b class="t">Whole-number division</b>In SQLite, PostgreSQL and SQL Server, dividing one whole number by another <i>throws away</i> the remainder: <code>7 / 2</code> gives <code>3</code>. Write <code>7 / 2.0</code> to get <code>3.5</code>. Run <code>SELECT 7 / 2, 7 / 2.0;</code> to see it for yourself.</div>

<h2>Dates</h2>
<p>SQLite stores dates as text (<code>'2024-06-17'</code>) and gives you functions to work with them. Every database handles dates a little differently, but the ideas are the same everywhere: get today's date, pull out parts (year, month), and add or subtract time.</p>
<pre class="run">SELECT date('now')              AS today,
       date('now', '+30 days')  AS in_30_days,
       date('now', '-1 year')   AS a_year_ago;</pre>
<p><code>strftime(format, date)</code> pulls out parts of a date. <code>%Y</code> is the year, <code>%m</code> the month and <code>%d</code> the day:</p>
<pre class="run">SELECT first_name, hire_date,
       strftime('%Y', hire_date) AS hire_year,
       strftime('%m', hire_date) AS hire_month
FROM   employees;</pre>
<p>To find how much time has passed, <code>julianday()</code> turns a date into a day number, so subtracting two of them gives a number of days:</p>
<pre class="run">SELECT first_name, hire_date,
       CAST(julianday('now') - julianday(hire_date) AS INTEGER)          AS days_employed,
       ROUND((julianday('now') - julianday(hire_date)) / 365.25, 1)      AS years_employed
FROM   employees
ORDER  BY hire_date;</pre>
<div class="note dialect"><b class="t">Dates elsewhere — the same ideas, different spellings</b>
<table class="doc" style="box-shadow:none;margin:6px 0 0">
<tr><th></th><th>PostgreSQL</th><th>MySQL</th><th>SQL Server</th><th>Oracle</th></tr>
<tr><td>Today</td><td><code>CURRENT_DATE</code></td><td><code>CURDATE()</code></td><td><code>GETDATE()</code></td><td><code>SYSDATE</code></td></tr>
<tr><td>Year of a date</td><td><code>EXTRACT(YEAR FROM d)</code></td><td><code>YEAR(d)</code></td><td><code>YEAR(d)</code></td><td><code>EXTRACT(YEAR FROM d)</code></td></tr>
<tr><td>Add 30 days</td><td><code>d + 30</code></td><td><code>DATE_ADD(d, INTERVAL 30 DAY)</code></td><td><code>DATEADD(day, 30, d)</code></td><td><code>d + 30</code></td></tr>
</table></div>
`,
  exercises: [
    { at: 0, level: 'easy', prompt: '<p>Show every employee\'s <code>last_name</code> in capital letters, in a column named <code>surname</code>.</p>', solution: 'SELECT UPPER(last_name) AS surname FROM employees;' },
    { at: 1, level: 'easy', prompt: '<p>Show <code>first_name</code> and its length, named <code>name_length</code>, for employees whose first name is longer than 6 characters.</p>', solution: 'SELECT first_name, LENGTH(first_name) AS name_length FROM employees WHERE LENGTH(first_name) > 6;' },
    { at: 'practice', level: 'medium', prompt: '<p>Make a short code for every employee, named <code>initials</code>: the first letter of their first name followed by the first letter of their last name, e.g. <i>GM</i> for Grace Mwangi.</p>', hint: '<code>SUBSTR(first_name, 1, 1)</code>, then <code>||</code>.', solution: 'SELECT SUBSTR(first_name, 1, 1) || SUBSTR(last_name, 1, 1) AS initials FROM employees;' },
    { at: 2, level: 'easy', prompt: '<p>Show <code>first_name</code>, <code>salary</code>, and the salary after a 7.5% raise, rounded to 0 decimal places, named <code>new_salary</code>.</p>', hint: 'A 7.5% raise means multiplying by 1.075.', solution: 'SELECT first_name, salary, ROUND(salary * 1.075) AS new_salary FROM employees;' },
    { at: 3, level: 'medium', prompt: '<p>Show <code>first_name</code> and <code>hire_date</code> of everyone hired in the month of <b>March</b> (any year).</p>', hint: "<code>strftime('%m', hire_date)</code> gives you the month as text, like <code>'03'</code>.", solution: "SELECT first_name, hire_date FROM employees WHERE strftime('%m', hire_date) = '03';" },
    { at: 'practice', level: 'medium', prompt: '<p>Show each employee\'s <code>email</code> with the <code>@company.example</code> part replaced by <code>@newco.example</code>, named <code>new_email</code>.</p>', solution: "SELECT REPLACE(email, '@company.example', '@newco.example') AS new_email FROM employees;" },
    { at: 'practice', level: 'hard', prompt: '<p>Show <code>first_name</code>, <code>last_name</code> and the year they were hired, named <code>hire_year</code> (as text, e.g. <i>2016</i>), for everyone hired <b>before</b> 2015.</p>', solution: "SELECT first_name, last_name, strftime('%Y', hire_date) AS hire_year FROM employees WHERE hire_date < '2015-01-01';" }
  ]
},

/* ───────────────────────────── 5 ───────────────────────────── */
{
  id: 'conditional', num: 5, minutes: 45,
  title: 'NULL handling, CASE and type conversion',
  summary: 'Replace NULLs with sensible values, write if-then logic inside a query, and convert between types.',
  body: `
<h2>COALESCE: a default for NULL</h2>
<p><code>COALESCE(a, b, c, …)</code> gives you the first argument that isn't NULL. Its most common use is replacing NULL with a default value:</p>
<pre class="run">SELECT first_name,
       commission_pct,
       COALESCE(commission_pct, 0) AS commission
FROM   employees;</pre>
<p>Now we can fix the "salary plus commission" calculation from chapter 2:</p>
<pre class="run">SELECT first_name, salary,
       salary + salary * COALESCE(commission_pct, 0) AS total_pay
FROM   employees;</pre>
<pre class="run">SELECT first_name, COALESCE(phone_number, 'no phone on file') AS phone
FROM   employees;</pre>
<div class="note dialect"><b class="t">Other databases</b><code>COALESCE</code> works everywhere. You'll also see single-purpose versions: <code>IFNULL(a, b)</code> in SQLite and MySQL, <code>ISNULL(a, b)</code> in SQL Server, and <code>NVL(a, b)</code> in Oracle.</div>

<h2>NULLIF</h2>
<p><code>NULLIF(a, b)</code> gives NULL when <code>a = b</code>, and <code>a</code> otherwise. It's mostly used to avoid dividing by zero, because <code>x / NULLIF(y, 0)</code> gives NULL instead of an error.</p>

<h2>CASE: if-then-else inside a query</h2>
<p><code>CASE</code> lets a query make decisions, row by row. The <b>searched</b> form checks conditions from top to bottom and uses the first one that's true:</p>
<pre class="run">SELECT first_name, salary,
       CASE
         WHEN salary >= 15000 THEN 'High'
         WHEN salary >= 7000  THEN 'Medium'
         ELSE 'Entry'
       END AS pay_band
FROM   employees;</pre>
<p>If no <code>WHEN</code> matches and there's no <code>ELSE</code>, the result is NULL.</p>
<p>The <b>simple</b> form compares one value against a list of options:</p>
<pre class="run">SELECT department_name,
       CASE department_id
         WHEN 10 THEN 'Leadership'
         WHEN 40 THEN 'Revenue'
         WHEN 50 THEN 'Revenue'
         ELSE 'Support function'
       END AS category
FROM   departments;</pre>
<p><code>CASE</code> works anywhere a value can go, including <code>ORDER BY</code>. This query puts developers first, then sorts everyone else by name:</p>
<pre class="run">SELECT first_name, job_id
FROM   employees
ORDER  BY CASE WHEN job_id = 'DEV' THEN 0 ELSE 1 END, first_name;</pre>
<div class="note dialect"><b class="t">Other databases</b>You may see Oracle's <code>DECODE(col, val1, result1, val2, result2, default)</code> and SQL Server or MySQL's <code>IIF</code>/<code>IF</code>. <code>CASE</code> is standard SQL and works everywhere, so learn that one.</div>

<h2>Data types and CAST</h2>
<p>Every value has a type. <code>CAST(value AS type)</code> converts a value from one type to another:</p>
<pre class="run">SELECT CAST('42' AS INTEGER) + 1     AS from_text,
       CAST(9.99 AS INTEGER)         AS chopped,
       CAST(2024 AS TEXT) || '-01-01' AS as_text,
       typeof(salary)                AS salary_type
FROM   employees
LIMIT  1;</pre>
<p>Sometimes databases convert types automatically. That's called <b>implicit conversion</b>. It's convenient, but it can surprise you, so when it matters, convert on purpose with <code>CAST</code>.</p>
<div class="note dialect"><b class="t">Common type names</b>
<table class="doc" style="box-shadow:none;margin:6px 0 0">
<tr><th>Kind</th><th>Standard / PostgreSQL</th><th>MySQL</th><th>SQL Server</th><th>Oracle</th></tr>
<tr><td>Text</td><td><code>VARCHAR(n)</code>, <code>TEXT</code></td><td><code>VARCHAR(n)</code></td><td><code>VARCHAR(n)</code>, <code>NVARCHAR(n)</code></td><td><code>VARCHAR2(n)</code></td></tr>
<tr><td>Whole number</td><td><code>INTEGER</code>, <code>BIGINT</code></td><td><code>INT</code></td><td><code>INT</code></td><td><code>NUMBER(10)</code></td></tr>
<tr><td>Exact decimal (money)</td><td><code>NUMERIC(10,2)</code></td><td><code>DECIMAL(10,2)</code></td><td><code>DECIMAL(10,2)</code></td><td><code>NUMBER(10,2)</code></td></tr>
<tr><td>Date / date-time</td><td><code>DATE</code>, <code>TIMESTAMP</code></td><td><code>DATE</code>, <code>DATETIME</code></td><td><code>DATE</code>, <code>DATETIME2</code></td><td><code>DATE</code>, <code>TIMESTAMP</code></td></tr>
</table>SQLite is relaxed about types: it really only has INTEGER, REAL, TEXT, BLOB and NULL.</div>
`,
  exercises: [
    { at: 0, level: 'easy', prompt: '<p>Show <code>first_name</code> and <code>commission_pct</code> for every employee, but show <b>0</b> instead of NULL. Name the column <code>commission</code>.</p>', solution: 'SELECT first_name, COALESCE(commission_pct, 0) AS commission FROM employees;' },
    { at: 'practice', level: 'easy', prompt: '<p>Show <code>first_name</code>, <code>last_name</code> and <code>phone_number</code> for everyone, showing the text <code>Unknown</code> where the phone number is missing. Name the column <code>phone</code>.</p>', solution: "SELECT first_name, last_name, COALESCE(phone_number, 'Unknown') AS phone FROM employees;" },
    { at: 2, level: 'medium', prompt: '<p>Show <code>first_name</code>, <code>salary</code> and a column <code>size</code> that says <code>Big</code> when salary is 12,000 or more, <code>Mid</code> when it\'s 6,000 or more, and <code>Small</code> otherwise.</p>', solution: "SELECT first_name, salary, CASE WHEN salary >= 12000 THEN 'Big' WHEN salary >= 6000 THEN 'Mid' ELSE 'Small' END AS size FROM employees;" },
    { at: 'practice', level: 'medium', prompt: '<p>Show <code>first_name</code> and a column <code>sales_staff</code> that says <code>Yes</code> if the employee earns a commission and <code>No</code> if not.</p>', hint: '<code>CASE WHEN commission_pct IS NOT NULL THEN …</code>', solution: "SELECT first_name, CASE WHEN commission_pct IS NOT NULL THEN 'Yes' ELSE 'No' END AS sales_staff FROM employees;" },
    { at: 'practice', level: 'medium', prompt: '<p>Show every employee\'s <code>first_name</code>, <code>salary</code> and <code>total_pay</code>: salary plus salary × commission, treating a missing commission as zero, rounded to 0 decimal places.</p>', solution: 'SELECT first_name, salary, ROUND(salary + salary * COALESCE(commission_pct, 0)) AS total_pay FROM employees;' },
    { at: 'practice', level: 'hard', prompt: '<p>Show <code>department_name</code> and a column <code>office</code> that says <code>HQ</code> for departments at location 1100, <code>Nairobi hub</code> for location 1500, and <code>Regional</code> for everywhere else.</p>', solution: "SELECT department_name, CASE location_id WHEN 1100 THEN 'HQ' WHEN 1500 THEN 'Nairobi hub' ELSE 'Regional' END AS office FROM departments;" }
  ]
},

/* ───────────────────────────── 6 ───────────────────────────── */
{
  id: 'aggregate', num: 6, minutes: 60,
  title: 'Summarising data: GROUP BY and HAVING',
  summary: 'Count, total and average rows — across the whole table, or group by group.',
  body: `
<h2>Aggregate functions</h2>
<p>The functions in chapter 4 give one answer <i>per row</i>. <b>Aggregate functions</b> squash many rows into <i>one</i> answer:</p>
<table class="doc">
  <tr><th>Function</th><th>Gives you</th></tr>
  <tr><td><code>COUNT(*)</code></td><td>the number of rows</td></tr>
  <tr><td><code>COUNT(col)</code></td><td>the number of rows where <i>col</i> is not NULL</td></tr>
  <tr><td><code>COUNT(DISTINCT col)</code></td><td>the number of different values</td></tr>
  <tr><td><code>SUM(col)</code>, <code>AVG(col)</code></td><td>the total and the average</td></tr>
  <tr><td><code>MIN(col)</code>, <code>MAX(col)</code></td><td>the smallest and largest value (these work on text and dates too)</td></tr>
</table>
<pre class="run">SELECT COUNT(*)              AS employees,
       SUM(salary)           AS monthly_payroll,
       ROUND(AVG(salary), 2) AS average_salary,
       MIN(salary)           AS lowest,
       MAX(salary)           AS highest,
       MIN(hire_date)        AS first_hire
FROM   employees;</pre>

<h2>Aggregates ignore NULL</h2>
<p>This is easy to miss. <code>COUNT(commission_pct)</code> only counts the rows that <i>have</i> a commission, and <code>AVG(commission_pct)</code> only averages those rows:</p>
<pre class="run">SELECT COUNT(*)                         AS all_rows,
       COUNT(commission_pct)            AS with_commission,
       AVG(commission_pct)              AS avg_of_earners,
       AVG(COALESCE(commission_pct, 0)) AS avg_of_everyone,
       COUNT(DISTINCT department_id)    AS departments_used
FROM   employees;</pre>
<p>Notice the two averages are different. Which one is "right" depends on the question you're asking.</p>

<h2>GROUP BY: one answer per group</h2>
<p><code>GROUP BY</code> splits the rows into groups that share a value, and runs the aggregate once for each group:</p>
<pre class="run">SELECT department_id,
       COUNT(*)              AS headcount,
       ROUND(AVG(salary), 0) AS avg_salary
FROM   employees
GROUP  BY department_id;</pre>
<p>Picture it in three steps: (1) sort the employees into piles by department, (2) work out the count and average for each pile, (3) return one row per pile. Tom Harris has no department, so the NULLs form their own group.</p>
<p>You can group by more than one column:</p>
<pre class="run">SELECT department_id, job_id, COUNT(*) AS people
FROM   employees
GROUP  BY department_id, job_id
ORDER  BY department_id;</pre>
<div class="note warn"><b class="t">The golden rule of GROUP BY</b>Every column in your <code>SELECT</code> must either be in the <code>GROUP BY</code>, or be inside an aggregate function. <code>SELECT department_id, first_name, COUNT(*) … GROUP BY department_id</code> makes no sense: which first name should a whole department show? Most databases reject it with an error. SQLite quietly picks one, which is worse — so follow the rule anyway.</div>

<h2>HAVING: filtering groups</h2>
<p><code>WHERE</code> filters <b>rows</b> before they're grouped. <code>HAVING</code> filters <b>groups</b> after the aggregates are worked out. That's why <code>HAVING</code> is the only place you can filter on an aggregate:</p>
<pre class="run">-- departments with more than 3 people
SELECT department_id, COUNT(*) AS headcount
FROM   employees
GROUP  BY department_id
HAVING COUNT(*) > 3;</pre>
<p>You can use both in one query:</p>
<pre class="run">-- among employees hired since 2018, which departments average over 6,000?
SELECT department_id, ROUND(AVG(salary)) AS avg_salary, COUNT(*) AS people
FROM   employees
WHERE  hire_date >= '2018-01-01'
GROUP  BY department_id
HAVING AVG(salary) > 6000
ORDER  BY avg_salary DESC;</pre>

<h2>The full order of a SELECT</h2>
<p>You <b>write</b> the clauses in this order:</p>
<pre class="code">SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT …</pre>
<p>The database <b>works through them</b> in a different order:</p>
<pre class="code">1 FROM  →  2 WHERE  →  3 GROUP BY  →  4 HAVING  →  5 SELECT  →  6 ORDER BY  →  7 LIMIT</pre>
<p>This explains a lot of errors. For example, you can't use a <code>SELECT</code> alias in <code>WHERE</code> in most databases, because <code>WHERE</code> runs before <code>SELECT</code> has created the alias. But you can use the alias in <code>ORDER BY</code>, which runs after.</p>
`,
  exercises: [
    { at: 0, level: 'easy', prompt: '<p>How many employees are there? Return one column named <code>total</code>.</p>', solution: 'SELECT COUNT(*) AS total FROM employees;' },
    { at: 1, level: 'easy', prompt: '<p>Show the highest, lowest and average salary of software developers (<code>DEV</code>) as <code>highest</code>, <code>lowest</code> and <code>average</code>. Round the average to 0 decimal places.</p>', solution: "SELECT MAX(salary) AS highest, MIN(salary) AS lowest, ROUND(AVG(salary)) AS average FROM employees WHERE job_id = 'DEV';" },
    { at: 2, level: 'easy', prompt: '<p>For each <code>job_id</code>, show how many employees have that job, as <code>people</code>.</p>', solution: 'SELECT job_id, COUNT(*) AS people FROM employees GROUP BY job_id;' },
    { at: 'practice', level: 'medium', prompt: '<p>For each <code>department_id</code> (leave out employees without a department), show the total monthly salary as <code>payroll</code>.</p>', solution: 'SELECT department_id, SUM(salary) AS payroll FROM employees WHERE department_id IS NOT NULL GROUP BY department_id;' },
    { at: 3, level: 'medium', prompt: '<p>Show the <code>job_id</code> of jobs that more than 3 employees hold, together with the count as <code>people</code>.</p>', solution: 'SELECT job_id, COUNT(*) AS people FROM employees GROUP BY job_id HAVING COUNT(*) > 3;' },
    { at: 'practice', level: 'medium', prompt: '<p>How many employees were hired each year? Show <code>hire_year</code> (e.g. <i>2016</i>) and <code>hires</code>, earliest year first.</p>', ordered: true, hint: "Group by <code>strftime('%Y', hire_date)</code>.", solution: "SELECT strftime('%Y', hire_date) AS hire_year, COUNT(*) AS hires FROM employees GROUP BY strftime('%Y', hire_date) ORDER BY hire_year;" },
    { at: 'practice', level: 'hard', prompt: '<p>For every <code>manager_id</code> (ignore the NULL one), show how many people report directly to them (<code>reports</code>) and their reports\' average salary rounded to 0 decimals (<code>avg_salary</code>) — but only for managers with at least 3 reports. Sort by <code>reports</code>, most first; when two managers have the same count, sort by <code>manager_id</code>.</p>', ordered: true, solution: 'SELECT manager_id, COUNT(*) AS reports, ROUND(AVG(salary)) AS avg_salary FROM employees WHERE manager_id IS NOT NULL GROUP BY manager_id HAVING COUNT(*) >= 3 ORDER BY reports DESC, manager_id;' }
  ]
},

/* ───────────────────────────── 7 ───────────────────────────── */
{
  id: 'joins', num: 7, minutes: 75,
  title: 'Joining tables',
  summary: 'Combine rows from two or more tables — the most important skill in SQL.',
  body: `
<h2>Why join?</h2>
<p>The <code>employees</code> table stores <code>department_id = 60</code>, not the word "IT". This is on purpose. If the department's name were stored on every employee's row, renaming the department would mean changing dozens of rows, and one would always get missed. So the name lives in exactly one place, in <code>departments</code>, and we <b>join</b> the tables together whenever we need both pieces of information.</p>

<h2>INNER JOIN</h2>
<pre class="run">SELECT e.first_name, e.last_name, d.department_name
FROM   employees e
JOIN   departments d ON e.department_id = d.department_id;</pre>
<ul>
  <li><code>employees e</code> gives the table a short <b>alias</b>, <code>e</code>, so you can write <code>e.first_name</code> instead of <code>employees.first_name</code>.</li>
  <li><code>ON …</code> is the <b>join condition</b>: it says which rows belong together, usually where a foreign key equals a primary key.</li>
  <li><code>JOIN</code> and <code>INNER JOIN</code> mean exactly the same thing.</li>
</ul>
<p>An inner join only keeps rows that have a match <b>on both sides</b>. Count the rows: there are 34, not 35. Tom Harris has no department, so he has no match and disappears. The Legal department has no employees, so it disappears too.</p>
<div class="note warn"><b class="t">Ambiguous columns</b>Both tables have a column called <code>department_id</code>. If you write just <code>department_id</code>, the database doesn't know which one you mean and gives an error. Prefix it: <code>e.department_id</code>.</div>

<h2>Joining three or more tables</h2>
<p>Add one <code>JOIN</code> per extra table. Here's each employee, their department, and the city where it's based:</p>
<pre class="run">SELECT e.first_name, d.department_name, l.city, c.country_name
FROM   employees e
JOIN   departments d ON e.department_id = d.department_id
JOIN   locations   l ON d.location_id   = l.location_id
JOIN   countries   c ON l.country_id    = c.country_id
ORDER  BY c.country_name, l.city;</pre>
<p>Joins combine freely with everything you already know: <code>WHERE</code>, <code>GROUP BY</code>, <code>ORDER BY</code>.</p>
<pre class="run">-- headcount per city
SELECT l.city, COUNT(*) AS headcount
FROM   employees e
JOIN   departments d ON e.department_id = d.department_id
JOIN   locations   l ON d.location_id   = l.location_id
GROUP  BY l.city
ORDER  BY headcount DESC;</pre>

<h2>LEFT JOIN: keep everything from one side</h2>
<p>A <code>LEFT JOIN</code> keeps <b>every row from the left table</b> (the one written first), even when it has no match. Where there's no match, the right table's columns come back as NULL:</p>
<pre class="run">SELECT e.first_name, e.last_name, d.department_name
FROM   employees e
LEFT   JOIN departments d ON e.department_id = d.department_id;</pre>
<p>Now Tom Harris is back, with a NULL department name. Swap the tables round to find departments that have no employees. This "LEFT JOIN … WHERE … IS NULL" pattern is <i>very</i> common:</p>
<pre class="run">SELECT d.department_name
FROM   departments d
LEFT   JOIN employees e ON e.department_id = d.department_id
WHERE  e.employee_id IS NULL;</pre>
<p>Counting with a LEFT JOIN, so that empty groups show 0 instead of disappearing:</p>
<pre class="run">SELECT d.department_name, COUNT(e.employee_id) AS headcount
FROM   departments d
LEFT   JOIN employees e ON e.department_id = d.department_id
GROUP  BY d.department_name
ORDER  BY headcount;</pre>
<p>Notice it uses <code>COUNT(e.employee_id)</code> rather than <code>COUNT(*)</code>. Legal's single row has a NULL employee_id, which <code>COUNT</code> doesn't count, so it correctly gets 0.</p>

<h2>RIGHT and FULL OUTER JOIN</h2>
<p><code>RIGHT JOIN</code> is the mirror image: it keeps every row from the <i>right</i> table. Most people just swap the table order and use <code>LEFT JOIN</code>. <code>FULL OUTER JOIN</code> keeps unmatched rows from <b>both</b> sides:</p>
<pre class="run">SELECT e.last_name, d.department_name
FROM   employees e
FULL   OUTER JOIN departments d ON e.department_id = d.department_id
WHERE  e.employee_id IS NULL OR d.department_id IS NULL;</pre>
<div class="note dialect"><b class="t">Other databases</b>MySQL has no <code>FULL OUTER JOIN</code>. People combine a LEFT and a RIGHT join with <code>UNION</code> instead (see chapter 9). Old Oracle code writes outer joins with <code>(+)</code>, like <code>WHERE e.department_id = d.department_id(+)</code>. You'll recognise it, but use the <code>JOIN</code> keywords yourself.</div>

<h2>Self join: a table joined to itself</h2>
<p>An employee's <code>manager_id</code> points at another row in the <i>same</i> table. To show each person next to their manager's name, use the table twice, with two different aliases:</p>
<pre class="run">SELECT e.first_name || ' ' || e.last_name AS employee,
       m.first_name || ' ' || m.last_name AS manager
FROM   employees e
LEFT   JOIN employees m ON e.manager_id = m.employee_id
ORDER  BY manager;</pre>
<p>It's a <code>LEFT JOIN</code> so that the CEO, who has no manager, still appears.</p>

<h2>Joining on other conditions</h2>
<p>A join condition doesn't have to be "equals". This query checks whether each salary falls inside its job's range. It joins on the job, then compares numbers:</p>
<pre class="run">SELECT e.first_name, e.salary, j.job_title, j.min_salary, j.max_salary,
       CASE WHEN e.salary BETWEEN j.min_salary AND j.max_salary THEN 'in range' ELSE 'OUT OF RANGE' END AS check_result
FROM   employees e
JOIN   jobs j ON e.job_id = j.job_id;</pre>

<h2>CROSS JOIN, and the forgotten ON</h2>
<p>A <code>CROSS JOIN</code> pairs every row with every row: 4 regions × 15 jobs = 60 rows. It's occasionally useful, for example to build every combination of two lists.</p>
<pre class="run">SELECT r.region_name, j.job_title FROM regions r CROSS JOIN jobs j;</pre>
<p>Forgetting the join condition (writing <code>FROM employees, departments</code> with no <code>WHERE</code>) does the same thing by accident, and gives you 350 rows of nonsense. If a join returns far more rows than you expected, check your <code>ON</code>.</p>
`,
  exercises: [
    { at: 1, level: 'easy', prompt: '<p>Show every employee\'s <code>first_name</code>, <code>last_name</code> and their <code>job_title</code>.</p>', solution: 'SELECT e.first_name, e.last_name, j.job_title FROM employees e JOIN jobs j ON e.job_id = j.job_id;' },
    { at: 'practice', level: 'easy', prompt: '<p>Show <code>department_name</code> and <code>city</code> for every department.</p>', solution: 'SELECT d.department_name, l.city FROM departments d JOIN locations l ON d.location_id = l.location_id;' },
    { at: 2, level: 'medium', prompt: '<p>Show <code>first_name</code>, <code>last_name</code> and <code>department_name</code> of every employee who works in <b>London</b>.</p>', hint: 'Employees → departments → locations, then <code>WHERE l.city = \'London\'</code>.', solution: "SELECT e.first_name, e.last_name, d.department_name FROM employees e JOIN departments d ON e.department_id = d.department_id JOIN locations l ON d.location_id = l.location_id WHERE l.city = 'London';" },
    { at: 3, level: 'medium', prompt: '<p>List the <code>country_name</code> of every country that has <b>no</b> office location.</p>', hint: 'LEFT JOIN countries to locations and keep the rows where the location side is NULL.', solution: 'SELECT c.country_name FROM countries c LEFT JOIN locations l ON l.country_id = c.country_id WHERE l.location_id IS NULL;' },
    { at: 5, level: 'medium', prompt: '<p>Show each employee\'s <code>first_name</code> and the <code>first_name</code> of their manager (name it <code>manager_name</code>). Include the CEO, who has no manager.</p>', solution: 'SELECT e.first_name, m.first_name AS manager_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.employee_id;' },
    { at: 'practice', level: 'medium', prompt: '<p>For every region, show <code>region_name</code> and how many countries it has, as <code>countries</code>.</p>', solution: 'SELECT r.region_name, COUNT(c.country_id) AS countries FROM regions r LEFT JOIN countries c ON c.region_id = r.region_id GROUP BY r.region_name;' },
    { at: 'practice', level: 'hard', prompt: '<p>Show the <code>first_name</code> and <code>last_name</code> of every employee together with <code>dependents</code> — how many dependents they have. Employees with none should show <b>0</b>.</p>', hint: 'LEFT JOIN, then <code>COUNT(dp.dependent_id)</code>, not <code>COUNT(*)</code>. Group by the employee.', solution: 'SELECT e.first_name, e.last_name, COUNT(dp.dependent_id) AS dependents FROM employees e LEFT JOIN dependents dp ON dp.employee_id = e.employee_id GROUP BY e.employee_id, e.first_name, e.last_name;' },
    { at: 'practice', level: 'hard', prompt: '<p>Find employees who earn <b>more than their own manager</b>. Show the employee\'s <code>first_name</code> and <code>salary</code>, and the manager\'s <code>first_name</code> as <code>manager</code> and <code>salary</code> as <code>manager_salary</code>.</p>', solution: 'SELECT e.first_name, e.salary, m.first_name AS manager, m.salary AS manager_salary FROM employees e JOIN employees m ON e.manager_id = m.employee_id WHERE e.salary > m.salary;' },
    { at: 'practice', level: 'hard', prompt: '<p>Show <code>region_name</code> and the total monthly salary of employees working there, as <code>payroll</code>, biggest first.</p>', ordered: true, hint: 'Join all the way: employees → departments → locations → countries → regions.', solution: 'SELECT r.region_name, SUM(e.salary) AS payroll FROM employees e JOIN departments d ON e.department_id = d.department_id JOIN locations l ON d.location_id = l.location_id JOIN countries c ON l.country_id = c.country_id JOIN regions r ON c.region_id = r.region_id GROUP BY r.region_name ORDER BY payroll DESC;' }
  ]
},

/* ───────────────────────────── 8 ───────────────────────────── */
{
  id: 'subqueries', num: 8, minutes: 60,
  title: 'Subqueries and CTEs',
  summary: 'Use the answer to one query inside another — and give queries names with WITH.',
  body: `
<h2>A query inside a query</h2>
<p>Who earns more than the average salary? You could find the average first and then type the number into a second query. A <b>subquery</b> does both steps at once:</p>
<pre class="run">SELECT first_name, salary
FROM   employees
WHERE  salary > (SELECT AVG(salary) FROM employees);</pre>
<p>The part in brackets runs first and produces a single value (about 9,960). The outer query then uses that value. Because this subquery returns exactly one value, it's called a <b>scalar subquery</b>.</p>

<h2>Subqueries that return a list: IN</h2>
<pre class="run">-- everyone who works in a department based in Nairobi
SELECT first_name, last_name
FROM   employees
WHERE  department_id IN (SELECT d.department_id
                         FROM   departments d
                         JOIN   locations l ON d.location_id = l.location_id
                         WHERE  l.city = 'Nairobi');</pre>
<div class="note warn"><b class="t">NOT IN and NULL</b><code>NOT IN</code> with a list that contains a NULL returns <b>no rows at all</b>. That's because "is 5 different from NULL?" is <i>unknown</i>, not true. The <code>department_id</code> column has a NULL (Tom), so this query finds nothing:<br><code>SELECT department_name FROM departments WHERE department_id NOT IN (SELECT department_id FROM employees);</code><br>Run it in the box below. Then add <code>WHERE department_id IS NOT NULL</code> inside the brackets, or use <code>NOT EXISTS</code> instead.</div>
<pre class="run">SELECT department_name FROM departments
WHERE  department_id NOT IN (SELECT department_id FROM employees);</pre>

<h2>Correlated subqueries and EXISTS</h2>
<p>A <b>correlated</b> subquery refers to the outer query, so it runs once for every outer row. Who earns more than the average <i>of their own department</i>?</p>
<pre class="run">SELECT e.first_name, e.department_id, e.salary
FROM   employees e
WHERE  e.salary > (SELECT AVG(x.salary)
                   FROM   employees x
                   WHERE  x.department_id = e.department_id);</pre>
<p><code>EXISTS (subquery)</code> is true if the subquery returns at least one row. It's the clearest way to ask "is there any…?"</p>
<pre class="run">-- employees who have at least one dependent
SELECT e.first_name, e.last_name
FROM   employees e
WHERE  EXISTS (SELECT 1 FROM dependents d WHERE d.employee_id = e.employee_id);</pre>
<pre class="run">-- departments with nobody in them (safe with NULLs)
SELECT d.department_name
FROM   departments d
WHERE  NOT EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id);</pre>

<h2>Subqueries in SELECT and FROM</h2>
<p>A scalar subquery can also be a column in your result:</p>
<pre class="run">SELECT first_name, salary,
       salary - (SELECT AVG(salary) FROM employees) AS vs_average
FROM   employees;</pre>
<p>A subquery in <code>FROM</code> acts like a temporary table. It needs an alias:</p>
<pre class="run">SELECT dept.department_id, dept.avg_salary
FROM   (SELECT department_id, AVG(salary) AS avg_salary
        FROM   employees
        GROUP  BY department_id) AS dept
WHERE  dept.avg_salary > 10000;</pre>

<h2>WITH: common table expressions (CTEs)</h2>
<p>Subqueries nested inside subqueries get hard to read fast. A <b>CTE</b> lets you name a query up front with <code>WITH</code>, then use it as if it were a table. It's the same idea, just tidier:</p>
<pre class="run">WITH dept_stats AS (
  SELECT department_id, COUNT(*) AS headcount, AVG(salary) AS avg_salary
  FROM   employees
  WHERE  department_id IS NOT NULL
  GROUP  BY department_id
)
SELECT d.department_name, s.headcount, ROUND(s.avg_salary) AS avg_salary
FROM   dept_stats s
JOIN   departments d ON d.department_id = s.department_id
ORDER  BY s.avg_salary DESC;</pre>
<p>You can define several CTEs, separated by commas: <code>WITH a AS (…), b AS (…) SELECT …</code>. Later CTEs can use earlier ones. Many developers write every non-trivial query this way, because you can read it from top to bottom like a recipe.</p>
<div class="note tip"><b class="t">Join or subquery?</b>Often both work. A good default: use a <b>join</b> when you need columns from the other table, and <b>EXISTS / IN</b> when you only need to check whether a match exists.</div>
`,
  exercises: [
    { at: 0, level: 'easy', prompt: '<p>Show <code>first_name</code> and <code>salary</code> of everyone who earns <b>less</b> than the average salary.</p>', solution: 'SELECT first_name, salary FROM employees WHERE salary < (SELECT AVG(salary) FROM employees);' },
    { at: 'practice', level: 'medium', prompt: '<p>Show <code>first_name</code>, <code>last_name</code> and <code>hire_date</code> of the employee(s) hired most recently.</p>', hint: '<code>WHERE hire_date = (SELECT MAX(hire_date) …)</code>', solution: 'SELECT first_name, last_name, hire_date FROM employees WHERE hire_date = (SELECT MAX(hire_date) FROM employees);' },
    { at: 1, level: 'medium', prompt: '<p>Using a subquery with <code>IN</code> (no join in the outer query), show the <code>first_name</code> and <code>last_name</code> of everyone working in the <b>Sales</b> or <b>Marketing</b> departments.</p>', solution: "SELECT first_name, last_name FROM employees WHERE department_id IN (SELECT department_id FROM departments WHERE department_name IN ('Sales', 'Marketing'));" },
    { at: 2, level: 'medium', prompt: '<p>Show <code>first_name</code> and <code>last_name</code> of employees who have <b>no</b> dependents.</p>', solution: 'SELECT e.first_name, e.last_name FROM employees e WHERE NOT EXISTS (SELECT 1 FROM dependents d WHERE d.employee_id = e.employee_id);' },
    { at: 'practice', level: 'hard', prompt: '<p>Show <code>first_name</code>, <code>job_id</code> and <code>salary</code> of each employee who earns the <b>highest</b> salary within their job.</p>', hint: 'A correlated subquery: <code>salary = (SELECT MAX(x.salary) FROM employees x WHERE x.job_id = e.job_id)</code>.', solution: 'SELECT e.first_name, e.job_id, e.salary FROM employees e WHERE e.salary = (SELECT MAX(x.salary) FROM employees x WHERE x.job_id = e.job_id);' },
    { at: 4, level: 'hard', prompt: '<p>Using a CTE, show <code>department_name</code> and <code>payroll</code> (total monthly salary) for departments whose payroll is <b>more than 40,000</b>.</p>', solution: 'WITH p AS (SELECT department_id, SUM(salary) AS payroll FROM employees GROUP BY department_id) SELECT d.department_name, p.payroll FROM p JOIN departments d ON d.department_id = p.department_id WHERE p.payroll > 40000;' }
  ]
},

/* ───────────────────────────── 9 ───────────────────────────── */
{
  id: 'sets', num: 9, minutes: 30,
  title: 'Set operators: UNION, INTERSECT, EXCEPT',
  summary: 'Stack the results of two queries on top of each other, or find what they have in common.',
  body: `
<h2>Combining whole result sets</h2>
<p>Joins put tables <i>side by side</i>. Set operators stack two query results <i>on top of each other</i>. Both queries must return the <b>same number of columns</b>, with matching types, in the same order.</p>
<table class="doc">
  <tr><th>Operator</th><th>Returns</th></tr>
  <tr><td><code>UNION</code></td><td>the rows from either query, with duplicates removed</td></tr>
  <tr><td><code>UNION ALL</code></td><td>the rows from either query, keeping duplicates (faster)</td></tr>
  <tr><td><code>INTERSECT</code></td><td>only the rows that appear in both</td></tr>
  <tr><td><code>EXCEPT</code></td><td>the rows in the first query that aren't in the second</td></tr>
</table>
<pre class="run">-- one list of every person: employees and their dependents
SELECT first_name, last_name, 'Employee' AS type FROM employees
UNION ALL
SELECT first_name, last_name, 'Dependent'        FROM dependents
ORDER  BY last_name, first_name;</pre>
<p>The column names come from the first query. <code>ORDER BY</code> goes once, at the very end, and sorts the combined result.</p>

<h2>INTERSECT and EXCEPT</h2>
<pre class="run">-- departments that have at least one employee
SELECT department_id FROM departments
INTERSECT
SELECT department_id FROM employees;</pre>
<pre class="run">-- departments that have no employees
SELECT department_id FROM departments
EXCEPT
SELECT department_id FROM employees;</pre>
<div class="note dialect"><b class="t">Other databases</b>Oracle calls <code>EXCEPT</code> <code>MINUS</code>. MySQL only added <code>INTERSECT</code> and <code>EXCEPT</code> in version 8.0.31.</div>
<div class="note tip"><b class="t">UNION vs UNION ALL</b>Use <code>UNION ALL</code> unless you specifically need duplicates removed. Removing duplicates means the database has to compare every row against every other row, which is slow on big tables.</div>
`,
  exercises: [
    { at: 0, level: 'easy', prompt: '<p>Show one column <code>name</code> listing the first names of all employees <b>and</b> all dependents, with duplicates removed.</p>', solution: 'SELECT first_name AS name FROM employees UNION SELECT first_name FROM dependents;' },
    { at: 1, level: 'medium', prompt: '<p>Show the <code>country_id</code> values that appear in <code>countries</code> but <b>not</b> in <code>locations</code>.</p>', solution: 'SELECT country_id FROM countries EXCEPT SELECT country_id FROM locations;' },
    { at: 'practice', level: 'medium', prompt: '<p>Show the <code>job_id</code> values held by someone hired <b>before 2016</b> and <b>also</b> by someone hired in <b>2020 or later</b>.</p>', solution: "SELECT job_id FROM employees WHERE hire_date < '2016-01-01' INTERSECT SELECT job_id FROM employees WHERE hire_date >= '2020-01-01';" },
    { at: 'practice', level: 'hard', prompt: '<p>Make a two-column list (<code>last_name</code>, <code>reason</code>): employees earning over 15,000 with reason <code>high earner</code>, plus employees hired in 2023 or later with reason <code>new joiner</code>. Keep duplicates.</p>', solution: "SELECT last_name, 'high earner' AS reason FROM employees WHERE salary > 15000 UNION ALL SELECT last_name, 'new joiner' FROM employees WHERE hire_date >= '2023-01-01';" }
  ]
},

/* ───────────────────────────── 10 ───────────────────────────── */
{
  id: 'dml', num: 10, minutes: 60,
  title: 'Changing data: INSERT, UPDATE, DELETE',
  summary: 'Add new rows, change existing ones, remove them — and undo mistakes with transactions.',
  body: `
<div class="note tip"><b class="t">This chapter changes the database</b>The examples here really modify the practice data. You can't break anything for good: click <b>Reset data</b> on any example to get the original data back. Exercises always start from a fresh copy.</div>

<h2>INSERT: adding rows</h2>
<p>Name the columns you're filling, then give their values in the same order:</p>
<pre class="run">INSERT INTO departments (department_id, department_name, location_id)
VALUES (110, 'Data Science', 1500);

SELECT * FROM departments;</pre>
<p>You can add several rows in one statement:</p>
<pre class="run">INSERT INTO regions (region_id, region_name)
VALUES (5, 'Oceania'), (6, 'Antarctica');

SELECT * FROM regions;</pre>
<p>Any column you leave out gets its default value, or NULL. The database checks every rule on the table: insert a duplicate <code>region_id</code>, or leave out a <code>NOT NULL</code> column, and you'll get an error. That's the database protecting your data.</p>
<pre class="run" data-expect="error">-- this fails: region 1 already exists
INSERT INTO regions (region_id, region_name) VALUES (1, 'Duplicate');</pre>
<p>You can also insert rows that come from a query (<code>INSERT INTO … SELECT …</code>). This is handy for copying data from one table to another.</p>

<h2>UPDATE: changing rows</h2>
<pre class="run">UPDATE employees
SET    salary = salary * 1.10
WHERE  job_id = 'SUP_AGT';

SELECT first_name, salary FROM employees WHERE job_id = 'SUP_AGT';</pre>
<p>You can change several columns at once: <code>SET salary = 5000, commission_pct = 0.05</code>.</p>
<div class="note warn"><b class="t">Always write the WHERE first</b>An <code>UPDATE</code> or <code>DELETE</code> without <code>WHERE</code> changes <b>every row in the table</b>. A good habit: first write the matching <code>SELECT … WHERE …</code>, check it returns exactly the rows you mean, then change <code>SELECT</code> into <code>UPDATE</code>.</div>

<h2>DELETE: removing rows</h2>
<pre class="run">DELETE FROM dependents
WHERE  relationship = 'Spouse';

SELECT * FROM dependents;</pre>
<p>Foreign keys protect related data. Try deleting an employee who manages other people, or who has dependents. The database refuses, because those other rows would point at someone who no longer exists:</p>
<pre class="run" data-expect="error">DELETE FROM employees WHERE employee_id = 100;</pre>

<h2>Transactions: all or nothing</h2>
<p>A <b>transaction</b> groups several changes into one unit: either all of them happen, or none of them do. Think of a bank transfer. Taking money out of one account and adding it to another must both succeed, or both be cancelled.</p>
<pre class="code">BEGIN;                                   -- start a transaction
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;                                  -- make it permanent
-- or ROLLBACK; to cancel everything since BEGIN</pre>
<p>Try it: every dependent is deleted inside the transaction, and then <code>ROLLBACK</code> brings them all back:</p>
<pre class="run">BEGIN;
DELETE FROM dependents;
SELECT COUNT(*) AS during_transaction FROM dependents;
ROLLBACK;
SELECT COUNT(*) AS after_rollback FROM dependents;</pre>
<p>Only the last result is shown, and it's 15 — nothing was lost.</p>
<div class="note dialect"><b class="t">Other databases</b>Some tools, like Oracle's SQL Developer, don't save your changes until you type <code>COMMIT</code>. Others, like most PostgreSQL and MySQL clients, save each statement straight away ("auto-commit") unless you start with <code>BEGIN</code>. Find out which one your tool does before you change anything important.</div>
`,
  exercises: [
    { at: 0, level: 'easy', prompt: '<p>Add a new job: ID <code>DATA_ENG</code>, title <code>Data Engineer</code>, minimum salary 7000, maximum 15000.</p>', check: "SELECT * FROM jobs WHERE job_id = 'DATA_ENG';", solution: "INSERT INTO jobs (job_id, job_title, min_salary, max_salary) VALUES ('DATA_ENG', 'Data Engineer', 7000, 15000);" },
    { at: 1, level: 'easy', prompt: '<p>Put Tom Harris (employee 134) in the IT department (60).</p>', check: 'SELECT employee_id, department_id FROM employees WHERE employee_id = 134;', solution: 'UPDATE employees SET department_id = 60 WHERE employee_id = 134;' },
    { at: 'practice', level: 'medium', prompt: '<p>Give everyone in department 80 (Operations) a raise of <b>250</b>.</p>', check: 'SELECT employee_id, salary FROM employees ORDER BY employee_id;', solution: 'UPDATE employees SET salary = salary + 250 WHERE department_id = 80;' },
    { at: 2, level: 'medium', prompt: '<p>Delete every dependent whose relationship is <code>Child</code> and who belongs to employee 100.</p>', check: 'SELECT * FROM dependents ORDER BY dependent_id;', solution: "DELETE FROM dependents WHERE relationship = 'Child' AND employee_id = 100;" },
    { at: 'practice', level: 'hard', prompt: '<p>Give every sales representative (<code>SA_REP</code>) whose commission is below 0.15 a new commission of exactly <code>0.15</code>.</p>', check: 'SELECT employee_id, commission_pct FROM employees ORDER BY employee_id;', solution: "UPDATE employees SET commission_pct = 0.15 WHERE job_id = 'SA_REP' AND commission_pct < 0.15;" },
    { at: 'practice', level: 'hard', prompt: '<p>Add a new country <code>NG</code>, <code>Nigeria</code>, in the region whose name is <code>Middle East and Africa</code>. Look up the region ID with a subquery instead of typing the number.</p>', hint: '<code>INSERT … VALUES (\'NG\', \'Nigeria\', (SELECT region_id FROM regions WHERE …));</code>', check: "SELECT * FROM countries WHERE country_id = 'NG';", solution: "INSERT INTO countries (country_id, country_name, region_id) VALUES ('NG', 'Nigeria', (SELECT region_id FROM regions WHERE region_name = 'Middle East and Africa'));" }
  ]
},

/* ───────────────────────────── 11 ───────────────────────────── */
{
  id: 'ddl', num: 11, minutes: 45,
  title: 'Creating tables and constraints',
  summary: 'Design your own tables with CREATE TABLE, protect data with constraints, and change tables with ALTER.',
  body: `
<h2>CREATE TABLE</h2>
<p>A table definition lists each column, its type, and any rules (called <b>constraints</b>) that the data must follow:</p>
<pre class="run">CREATE TABLE projects (
  project_id     INTEGER PRIMARY KEY,
  project_name   TEXT    NOT NULL UNIQUE,
  budget         REAL    CHECK (budget >= 0),
  status         TEXT    NOT NULL DEFAULT 'planned',
  start_date     TEXT,
  department_id  INTEGER REFERENCES departments(department_id)
);

INSERT INTO projects (project_id, project_name, budget, department_id)
VALUES (1, 'Website relaunch', 25000, 50);

SELECT * FROM projects;</pre>
<p>Notice that <code>status</code> was filled in automatically from its <code>DEFAULT</code>.</p>

<h2>Constraints</h2>
<table class="doc">
  <tr><th>Constraint</th><th>Guarantees</th></tr>
  <tr><td><code>PRIMARY KEY</code></td><td>every row has a unique value that isn't NULL, and identifies the row</td></tr>
  <tr><td><code>NOT NULL</code></td><td>the column can't be left empty</td></tr>
  <tr><td><code>UNIQUE</code></td><td>no two rows can share a value</td></tr>
  <tr><td><code>CHECK (…)</code></td><td>every value passes a condition</td></tr>
  <tr><td><code>REFERENCES t(col)</code> (foreign key)</td><td>the value must exist in another table</td></tr>
  <tr><td><code>DEFAULT v</code></td><td>the value to use when none is given (strictly a default, not a constraint)</td></tr>
</table>
<p>Constraints are your safety net. Try breaking each rule and watch the database refuse:</p>
<pre class="run" data-expect="error">CREATE TABLE IF NOT EXISTS projects (
  project_id INTEGER PRIMARY KEY, project_name TEXT NOT NULL UNIQUE,
  budget REAL CHECK (budget >= 0), status TEXT NOT NULL DEFAULT 'planned',
  start_date TEXT, department_id INTEGER REFERENCES departments(department_id));

-- try each line on its own:
INSERT INTO projects (project_id, project_name, budget) VALUES (2, 'Bad budget', -5);
-- INSERT INTO projects (project_id, project_name) VALUES (3, NULL);
-- INSERT INTO projects (project_id, project_name, department_id) VALUES (4, 'Ghost dept', 999);</pre>

<h2>ALTER TABLE and DROP TABLE</h2>
<pre class="run">CREATE TABLE IF NOT EXISTS projects (project_id INTEGER PRIMARY KEY, project_name TEXT NOT NULL);

ALTER TABLE projects ADD COLUMN owner_id INTEGER;
ALTER TABLE projects RENAME COLUMN project_name TO title;

SELECT name, type FROM pragma_table_info('projects');</pre>
<pre class="run">DROP TABLE IF EXISTS projects;   -- the table and all its rows are gone</pre>
<div class="note warn"><b class="t">DROP is permanent</b>In a real database, <code>DROP TABLE</code> throws away the table and every row in it. Many databases also have <code>TRUNCATE TABLE t</code>, which removes all the rows but keeps the empty table. Double-check which database you're connected to before running either.</div>

<h2>Designing tables: a few guidelines</h2>
<ul>
  <li><b>One table per kind of thing.</b> Employees, departments and projects each get their own table.</li>
  <li><b>Store each fact once.</b> Store the department name in <code>departments</code>, and only its ID on employees. Spreading tables out like this is called <b>normalisation</b>.</li>
  <li><b>Give every table a primary key.</b> A simple whole-number ID is the usual choice.</li>
  <li><b>Use the right types.</b> Store dates as dates and money as exact decimals, not as text.</li>
  <li><b>Choose clear names.</b> Use lower_case_with_underscores, consistently, and avoid spaces.</li>
</ul>
<div class="note dialect"><b class="t">Auto-numbered IDs</b>SQLite numbers an <code>INTEGER PRIMARY KEY</code> automatically if you leave it out. Elsewhere: PostgreSQL uses <code>GENERATED ALWAYS AS IDENTITY</code> (or the older <code>SERIAL</code>), MySQL uses <code>AUTO_INCREMENT</code>, SQL Server uses <code>IDENTITY(1,1)</code>, and Oracle 12c+ uses <code>GENERATED AS IDENTITY</code> (or a <code>SEQUENCE</code>).</div>
`,
  exercises: [
    { at: 0, level: 'medium', prompt: '<p>Create a table <code>trainings</code> with three columns: <code>training_id</code> <code>INTEGER</code> primary key, <code>title</code> <code>TEXT</code> that can\'t be NULL, and <code>hours</code> <code>INTEGER</code>.</p>', check: "SELECT name, type, \"notnull\", pk FROM pragma_table_info('trainings') ORDER BY cid;", solution: 'CREATE TABLE trainings (training_id INTEGER PRIMARY KEY, title TEXT NOT NULL, hours INTEGER);' },
    { at: 2, level: 'medium', prompt: '<p>The table <code>trainings</code> already exists (with <code>training_id</code>, <code>title</code>, <code>hours</code>). Add a column <code>level</code> of type <code>TEXT</code>, then insert a training with ID 1, title <code>SQL Basics</code>, 6 hours, level <code>beginner</code>.</p>', setup: 'CREATE TABLE trainings (training_id INTEGER PRIMARY KEY, title TEXT NOT NULL, hours INTEGER);', check: 'SELECT * FROM trainings;', solution: "ALTER TABLE trainings ADD COLUMN level TEXT; INSERT INTO trainings (training_id, title, hours, level) VALUES (1, 'SQL Basics', 6, 'beginner');" },
    { at: 'practice', level: 'hard', prompt: '<p>Create a table <code>enrolments</code> with <code>employee_id</code> <code>INTEGER</code> referencing <code>employees</code>, <code>course</code> <code>TEXT</code> NOT NULL, and <code>score</code> <code>INTEGER</code> with a CHECK that it\'s between 0 and 100. Then insert employee 119 on course <code>SQL</code> with score 92.</p>', check: 'SELECT employee_id, course, score FROM enrolments;', solution: "CREATE TABLE enrolments (employee_id INTEGER REFERENCES employees(employee_id), course TEXT NOT NULL, score INTEGER CHECK (score BETWEEN 0 AND 100)); INSERT INTO enrolments VALUES (119, 'SQL', 92);" }
  ]
},

/* ───────────────────────────── 12 ───────────────────────────── */
{
  id: 'beyond', num: 12, minutes: 60,
  title: 'Views, indexes and window functions',
  summary: 'Save queries as views, make queries faster with indexes, and calculate rankings and running totals.',
  body: `
<h2>Views: saved queries</h2>
<p>A <b>view</b> is a named <code>SELECT</code> that you can query as if it were a table. It doesn't store any data itself. It runs its query every time you use it. Views hide complicated joins, and give everyone the same definition of things like "headcount".</p>
<pre class="run">CREATE VIEW IF NOT EXISTS employee_directory AS
SELECT e.employee_id,
       e.first_name || ' ' || e.last_name AS full_name,
       j.job_title, d.department_name, l.city
FROM   employees e
JOIN   jobs j             ON j.job_id = e.job_id
LEFT   JOIN departments d ON d.department_id = e.department_id
LEFT   JOIN locations l   ON l.location_id = d.location_id;

SELECT * FROM employee_directory WHERE city = 'Nairobi';</pre>
<p>Remove a view with <code>DROP VIEW employee_directory;</code>.</p>

<h2>Indexes: making searches fast</h2>
<p>Without an index, finding rows means reading the whole table, like looking for one name in a book with no index. An <b>index</b> is a sorted lookup structure that lets the database jump straight to the matching rows.</p>
<pre class="run">CREATE INDEX IF NOT EXISTS idx_employees_last_name ON employees(last_name);

EXPLAIN QUERY PLAN
SELECT * FROM employees WHERE last_name = 'Kariuki';</pre>
<p>The plan says it's <code>USING INDEX idx_employees_last_name</code>. With 35 rows you won't notice any difference. With 35 million rows, it's the difference between milliseconds and minutes.</p>
<ul>
  <li>Primary keys and <code>UNIQUE</code> columns get an index automatically.</li>
  <li>It's worth indexing columns you often use in <code>WHERE</code>, <code>JOIN … ON</code> and <code>ORDER BY</code>, especially foreign keys.</li>
  <li>Indexes have a cost: they take up space, and they slow down every <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code> a little. Don't index everything.</li>
</ul>

<h2>Window functions</h2>
<p>Aggregates with <code>GROUP BY</code> squash each group into a single row. <b>Window functions</b> calculate across a group of rows <i>but keep every row</i>. You can spot them by the <code>OVER (…)</code> after the function:</p>
<pre class="run">SELECT first_name, department_id, salary,
       AVG(salary) OVER (PARTITION BY department_id) AS dept_avg,
       salary - AVG(salary) OVER (PARTITION BY department_id) AS diff
FROM   employees
WHERE  department_id IS NOT NULL
ORDER  BY department_id, salary DESC;</pre>
<p><code>PARTITION BY</code> works like <code>GROUP BY</code>, but without merging the rows together.</p>
<h3>Ranking</h3>
<pre class="run">SELECT first_name, department_id, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC)                            AS row_num,
       RANK()       OVER (ORDER BY salary DESC)                            AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC)                            AS dense_rnk,
       RANK()       OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank_in_dept
FROM   employees
ORDER  BY salary DESC;</pre>
<p>Look at Lucy and Priya, who both earn 9,800. <code>ROW_NUMBER</code> always counts 1, 2, 3, … and splits ties arbitrarily. <code>RANK</code> gives tied rows the same number and then skips ahead. <code>DENSE_RANK</code> gives ties the same number without skipping.</p>
<h3>Top N per group</h3>
<p>A classic interview question: what are the top two salaries in each department? Rank the rows inside a CTE, then filter on the rank:</p>
<pre class="run">WITH ranked AS (
  SELECT first_name, department_id, salary,
         ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn
  FROM   employees
  WHERE  department_id IS NOT NULL
)
SELECT * FROM ranked WHERE rn &lt;= 2;</pre>
<h3>Running totals and previous rows</h3>
<pre class="run">SELECT first_name, hire_date, salary,
       SUM(salary) OVER (ORDER BY hire_date)       AS running_payroll,
       LAG(first_name) OVER (ORDER BY hire_date)   AS hired_before_them
FROM   employees
ORDER  BY hire_date;</pre>
<p>You can't put a window function directly in <code>WHERE</code>, because <code>WHERE</code> runs before the windows are calculated. That's why the "top N" example wraps the ranking in a CTE first.</p>

<h2>Where to go from here</h2>
<p>You now know the core of SQL. Good next steps:</p>
<ul>
  <li>Install a real database on your PC (see <a href="#/setup">Set up SQL on Windows</a>) and recreate this company database there.</li>
  <li>Practise every day for a couple of weeks on the sites listed under <a href="#/resources">More resources</a>.</li>
  <li>Download a public dataset you care about (football, weather, movies) and ask it your own questions.</li>
  <li>Learn how databases are designed: normalisation, entity-relationship diagrams, and how to choose keys.</li>
</ul>
`,
  exercises: [
    { at: 0, level: 'medium', prompt: '<p>Create a view called <code>high_earners</code> showing <code>first_name</code>, <code>last_name</code> and <code>salary</code> of employees who earn over 12,000.</p>', check: 'SELECT * FROM high_earners ORDER BY salary;', solution: 'CREATE VIEW high_earners AS SELECT first_name, last_name, salary FROM employees WHERE salary > 12000;' },
    { at: 2, level: 'medium', prompt: '<p>Show every employee\'s <code>first_name</code>, <code>salary</code> and <code>salary_rank</code>: their position when salaries are sorted highest first, using <code>DENSE_RANK</code>.</p>', solution: 'SELECT first_name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS salary_rank FROM employees;' },
    { at: 2, level: 'hard', prompt: '<p>For each department (ignore NULL), show the <b>single</b> highest-paid employee: <code>department_id</code>, <code>first_name</code> and <code>salary</code>.</p>', hint: 'Use <code>ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC)</code> in a CTE, then keep the rows where it\'s 1.', solution: 'WITH r AS (SELECT department_id, first_name, salary, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn FROM employees WHERE department_id IS NOT NULL) SELECT department_id, first_name, salary FROM r WHERE rn = 1;' },
    { at: 2, level: 'hard', prompt: '<p>Show each employee\'s <code>first_name</code>, <code>department_id</code>, <code>salary</code> and <code>dept_total</code>: the total salary of their whole department, shown on every row. Ignore employees without a department.</p>', solution: 'SELECT first_name, department_id, salary, SUM(salary) OVER (PARTITION BY department_id) AS dept_total FROM employees WHERE department_id IS NOT NULL;' }
  ]
},

/* ───────────────────────────── 13 ───────────────────────────── */
{
  id: 'challenges', num: 13, minutes: 90,
  title: 'Challenge round',
  summary: 'Mixed, interview-style problems that need several chapters at once. No new material — just practice.',
  body: `
<p>These problems are like the ones you'll meet in job interviews and in real work. Each one needs more than one technique. Before you type anything, talk it through: <i>which tables do I need? What is one row of my answer? Do I need to group?</i></p>
<div class="note tip"><b class="t">A method that works for any query</b>
<ol style="margin:4px 0 0">
  <li>Write <code>FROM</code> and your <code>JOIN</code>s first, with <code>SELECT *</code>, and look at the rows you get.</li>
  <li>Add <code>WHERE</code> and check the rows again.</li>
  <li>Add <code>GROUP BY</code> and the aggregates if the question asks for "per" or "each".</li>
  <li>Choose the final columns, then sort.</li>
</ol>
Build the query one small step at a time, running it after each step.</div>
<pre class="run">-- a scratch pad: explore freely
SELECT * FROM employees LIMIT 5;</pre>
`,
  exercises: [
    { at: 'practice', level: 'medium', prompt: '<p><b>Second-highest salary.</b> Return one column, <code>second_highest</code>: the second-highest <i>distinct</i> salary in the company.</p>', hint: '<code>SELECT DISTINCT salary … ORDER BY salary DESC LIMIT 1 OFFSET 1</code>, or <code>MAX(salary)</code> where salary &lt; the overall MAX.', solution: 'SELECT MAX(salary) AS second_highest FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);' },
    { at: 'practice', level: 'medium', prompt: '<p><b>Duplicate salaries.</b> Find salary values that more than one employee earns. Show <code>salary</code> and <code>how_many</code>.</p>', solution: 'SELECT salary, COUNT(*) AS how_many FROM employees GROUP BY salary HAVING COUNT(*) > 1;' },
    { at: 'practice', level: 'medium', prompt: '<p><b>Out of range.</b> Find employees whose salary is outside the min/max range of their job. Show <code>first_name</code>, <code>salary</code>, <code>min_salary</code>, <code>max_salary</code>.</p>', solution: 'SELECT e.first_name, e.salary, j.min_salary, j.max_salary FROM employees e JOIN jobs j ON j.job_id = e.job_id WHERE e.salary NOT BETWEEN j.min_salary AND j.max_salary;' },
    { at: 'practice', level: 'hard', prompt: '<p><b>Biggest department per region.</b> For each region, show <code>region_name</code>, the <code>department_name</code> with the most employees there, and its <code>headcount</code>. (Only regions that have employees will appear.)</p>', hint: 'CTE 1: headcount per department along with its region. CTE 2: rank inside each region. Then keep rank 1.', solution: 'WITH hc AS (SELECT r.region_name, d.department_name, COUNT(*) AS headcount FROM employees e JOIN departments d ON d.department_id = e.department_id JOIN locations l ON l.location_id = d.location_id JOIN countries c ON c.country_id = l.country_id JOIN regions r ON r.region_id = c.region_id GROUP BY r.region_name, d.department_name), rk AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY region_name ORDER BY headcount DESC, department_name) AS rn FROM hc) SELECT region_name, department_name, headcount FROM rk WHERE rn = 1;' },
    { at: 'practice', level: 'hard', prompt: '<p><b>Managers and their teams.</b> For every employee who manages at least one person, show the manager\'s full name as <code>manager</code> (first name, space, last name), <code>team_size</code> and <code>team_payroll</code> (the total salary of their direct reports). Sort by <code>team_payroll</code>, biggest first.</p>', ordered: true, solution: "SELECT m.first_name || ' ' || m.last_name AS manager, COUNT(*) AS team_size, SUM(e.salary) AS team_payroll FROM employees e JOIN employees m ON e.manager_id = m.employee_id GROUP BY m.employee_id, m.first_name, m.last_name ORDER BY team_payroll DESC;" },
    { at: 'practice', level: 'hard', prompt: '<p><b>Above their department average.</b> Show <code>first_name</code>, <code>department_name</code>, <code>salary</code> and <code>dept_avg</code> (rounded to 0 decimals) for everyone who earns more than the average of their own department.</p>', solution: 'WITH a AS (SELECT department_id, AVG(salary) AS dept_avg FROM employees GROUP BY department_id) SELECT e.first_name, d.department_name, e.salary, ROUND(a.dept_avg) AS dept_avg FROM employees e JOIN a ON a.department_id = e.department_id JOIN departments d ON d.department_id = e.department_id WHERE e.salary > a.dept_avg;' },
    { at: 'practice', level: 'hard', prompt: '<p><b>Hiring by year, with a running total.</b> Show <code>hire_year</code>, <code>hires</code> in that year, and <code>total_so_far</code> (all hires up to and including that year), ordered by year.</p>', ordered: true, solution: "SELECT strftime('%Y', hire_date) AS hire_year, COUNT(*) AS hires, SUM(COUNT(*)) OVER (ORDER BY strftime('%Y', hire_date)) AS total_so_far FROM employees GROUP BY strftime('%Y', hire_date) ORDER BY hire_year;" }
  ]
}

]};
