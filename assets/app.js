/* ============================================================
   SQL, step by step — app
   Hash routing, step-by-step lessons, an in-browser SQLite
   database (sql.js), auto-checked "Your turn" tasks, progress.
   ============================================================ */
(function () {
  'use strict';

  const G = window.GUIDE;
  const PAGES = window.GUIDE_PAGES;
  const root = document.getElementById('app');
  let SQL = null;        // sql.js module
  let sandbox = null;    // shared database for examples + playground

  const PARTS = [
    { name: 'Asking questions', ids: ['intro', 'select', 'where'] },
    { name: 'Working with values', ids: ['functions', 'conditional', 'aggregate'] },
    { name: 'Combining tables', ids: ['joins', 'subqueries', 'sets'] },
    { name: 'Building and changing data', ids: ['dml', 'ddl', 'beyond', 'challenges'] }
  ];
  const NAV = [['schema', 'The database'], ['playground', 'Playground'], ['cheatsheet', 'Cheat sheet'], ['setup', 'Set up on Windows'], ['resources', 'Resources']];

  // ---------- progress (localStorage, always guarded) ----------
  const KEY = 'sqlguide.progress.v2';
  let progress;
  try { progress = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { progress = {}; }
  ['solved', 'drafts', 'seen', 'done'].forEach(k => { progress[k] = progress[k] || {}; });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch (e) {} };

  // ---------- helpers ----------
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const exId = (ch, i) => ch.id + '-' + (i + 1);
  const chapterById = id => G.chapters.find(c => c.id === id);
  const allExercises = () => G.chapters.flatMap(ch => ch.exercises.map((ex, i) => ({ ch, ex, id: exId(ch, i) })));

  function freshDb(setup) {
    const db = new SQL.Database();
    db.exec(window.COMPANY_SQL);
    if (setup) db.exec(setup);
    return db;
  }
  function runSql(db, sql) {
    try {
      const res = db.exec(sql);
      return { result: res.length ? res[res.length - 1] : null, changed: db.getRowsModified(), error: null };
    } catch (e) {
      return { result: null, changed: 0, error: friendlyError(e.message) };
    }
  }
  function friendlyError(msg) {
    let tip = '';
    if (/no such column/i.test(msg)) tip = 'Check the column name is spelt right and belongs to a table in your FROM. Text values need single quotes, like \'Sales\'.';
    else if (/no such table/i.test(msg)) tip = 'Check the table name. The tables are regions, countries, locations, departments, jobs, employees and dependents.';
    else if (/syntax error/i.test(msg)) tip = 'Look just before the word mentioned. The usual suspects are a missing comma, an extra comma, or a misspelt keyword.';
    else if (/ambiguous column/i.test(msg)) tip = 'Two tables have a column with this name. Put the table name or alias in front, like e.department_id.';
    else if (/misuse of aggregate/i.test(msg)) tip = 'Aggregates like SUM and COUNT can\'t go in WHERE. Use HAVING to filter groups.';
    else if (/incomplete input/i.test(msg)) tip = 'The statement stops too early. Look for a missing closing bracket or quote.';
    else if (/FOREIGN KEY/i.test(msg)) tip = 'Another row depends on this one, or the value you gave doesn\'t exist in the linked table.';
    else if (/UNIQUE|PRIMARY KEY/i.test(msg)) tip = 'That value already exists, and this column doesn\'t allow duplicates.';
    return { msg, tip };
  }

  // ---------- SQL highlighting ----------
  const KW = new Set(('SELECT FROM WHERE AND OR NOT IN IS NULL AS ON JOIN INNER LEFT RIGHT FULL OUTER CROSS GROUP BY ORDER HAVING LIMIT OFFSET DISTINCT ' +
    'INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE VIEW INDEX DROP ALTER ADD COLUMN RENAME TO PRIMARY KEY REFERENCES UNIQUE CHECK DEFAULT ' +
    'BEGIN COMMIT ROLLBACK UNION ALL INTERSECT EXCEPT CASE WHEN THEN ELSE END EXISTS BETWEEN LIKE ASC DESC WITH OVER PARTITION IF EXPLAIN QUERY PLAN').split(' '));
  function highlight(code) {
    return code.replace(/(--[^\n]*)|('(?:[^']|'')*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z_0-9]*)|([\s\S])/g, (m, com, str, num, word) => {
      if (com) return '<span class="tk-com">' + esc(com) + '</span>';
      if (str) return '<span class="tk-str">' + esc(str) + '</span>';
      if (num) return '<span class="tk-num">' + num + '</span>';
      if (word) return KW.has(word.toUpperCase()) ? '<span class="tk-kw">' + word + '</span>' : esc(word);
      return esc(m);
    });
  }

  // ---------- result rendering ----------
  function fmt(v) {
    if (v === null || v === undefined) return '<span class="null">NULL</span>';
    if (typeof v === 'number' && !Number.isInteger(v)) return esc(+v.toFixed(4));
    if (v instanceof Uint8Array) return '<span class="null">[blob]</span>';
    return esc(v);
  }
  function resultTable(res, max = 200) {
    const wrap = el('div');
    const n = res.values.length;
    wrap.innerHTML = '<table class="result"><thead><tr>' + res.columns.map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' +
      res.values.slice(0, max).map(r => '<tr>' + r.map(v => '<td' + (typeof v === 'number' ? ' class="num"' : '') + '>' + fmt(v) + '</td>').join('') + '</tr>').join('') +
      '</tbody></table><p class="rows">' + n + ' row' + (n === 1 ? '' : 's') + (n > max ? ' (showing the first ' + max + ')' : '') + '</p>';
    return wrap;
  }
  function renderResult(out, r) {
    out.innerHTML = '';
    if (r.error) {
      out.append(el('p', 'fb err', '<span class="err-msg">' + esc(r.error.msg) + '</span>' + (r.error.tip ? esc(r.error.tip) : '')));
    } else if (!r.result) {
      out.append(el('p', 'fb info', 'Done. ' + (r.changed ? r.changed + ' row' + (r.changed === 1 ? '' : 's') + ' changed.' : 'The statement ran without returning rows.')));
    } else {
      out.append(resultTable(r.result));
    }
  }

  // ---------- editor with highlighting ----------
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  function makeEditor(initial, opts) {
    const box = el('div', 'editor');
    const head = el('div', 'ed-head', '<span>' + esc(opts.label) + '</span><span class="grow"></span>');
    const wrap = el('div', 'code-wrap');
    const pre = el('pre', 'hl');
    const ta = document.createElement('textarea');
    ta.spellcheck = false; ta.value = initial; ta.setAttribute('aria-label', opts.label + ' (SQL)');
    ta.autocapitalize = 'off'; ta.setAttribute('autocorrect', 'off');
    if (opts.placeholder) ta.placeholder = opts.placeholder;
    wrap.append(pre, ta);
    const paint = () => { pre.innerHTML = highlight(ta.value) + (ta.value.endsWith('\n') ? ' ' : ''); };
    const fit = () => { ta.style.height = 'auto'; ta.style.height = Math.max(64, ta.scrollHeight) + 'px'; };
    const refresh = () => { paint(); fit(); };
    ta.addEventListener('input', () => { refresh(); opts.onInput && opts.onInput(ta.value); });
    ta.addEventListener('scroll', () => { pre.scrollLeft = ta.scrollLeft; });
    ta.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); opts.onRun(); }
      if (e.key === 'Tab' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 2; refresh();
      }
    });
    const actions = el('div', 'ed-actions');
    const out = el('div', 'output');
    box.append(head, wrap, actions, out);
    paint(); requestAnimationFrame(fit);
    return { box, head, ta, actions, out, set(v) { ta.value = v; refresh(); } };
  }
  function button(label, cls, onClick) {
    const b = el('button', 'btn ' + (cls || ''), label);
    b.type = 'button'; b.addEventListener('click', onClick);
    return b;
  }
  function linkButton(label, onClick, title) {
    const b = el('button', 'link-btn', label);
    b.type = 'button'; if (title) b.title = title; b.addEventListener('click', onClick);
    return b;
  }
  const kbd = () => el('span', 'kbd', isMac ? '⌘ + Enter' : 'Ctrl + Enter');

  function resetSandbox() { if (sandbox) sandbox.close(); sandbox = freshDb(); }

  // turn <pre class="run"> into live editors bound to the sandbox
  function upgradeExamples(scope) {
    scope.querySelectorAll('pre.run').forEach(p => {
      const sql = p.textContent.replace(/^\n+|\s+$/g, '');
      let undo;
      const ed = makeEditor(sql, { label: p.dataset.label || 'Example', onRun: () => run(), onInput: v => { undo.hidden = v === sql; } });
      const run = () => renderResult(ed.out, runSql(sandbox, ed.ta.value));
      ed.actions.append(button('Run', '', run), kbd());
      undo = linkButton('Undo my edits', () => { ed.set(sql); undo.hidden = true; ed.out.innerHTML = ''; });
      undo.hidden = true;
      ed.head.append(undo);
      // only offer "Reset data" where the example actually changes the database
      if (/\b(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(sql)) {
        ed.head.append(linkButton('Reset data', () => { resetSandbox(); ed.out.innerHTML = '<p class="fb info">The practice data is back to how it started.</p>'; }, 'Undo any INSERT, UPDATE, DELETE or CREATE you ran'));
      }
      p.replaceWith(ed.box);
    });
  }

  // turn .note blocks into margin notes (or a closed "Good to know" when they hold a table)
  function upgradeNotes(scope) {
    scope.querySelectorAll('.note').forEach(n => {
      const t = n.querySelector('b.t');
      const title = t ? t.textContent : 'Good to know';
      if (t) t.remove();
      if (n.querySelector('table')) {
        const d = el('details', 'aside', '<summary>' + esc(title) + '</summary>' + n.innerHTML);
        n.replaceWith(d);
      } else {
        const a = el('aside', 'mnote' + (n.classList.contains('warn') ? ' warn' : ''), '<b class="t">' + esc(title) + '</b>' + n.innerHTML);
        n.replaceWith(a);
      }
    });
  }

  // ---------- checking answers ----------
  function normRows(res) {
    return res.values.map(row => row.map(v => {
      if (typeof v === 'number') return Math.round(v * 100) / 100;
      if (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v.trim())) return Math.round(parseFloat(v) * 100) / 100;
      return v;
    }));
  }
  function evaluate(ex, sql) {
    const run = code => {
      const db = freshDb(ex.setup);
      let r = runSql(db, code);
      if (!r.error && ex.check) r = runSql(db, ex.check);
      db.close();
      return r;
    };
    return { mine: run(sql), want: run(ex.solution) };
  }
  function compare(ex, mine, want) {
    if (mine.error) return { ok: false, err: true };
    if (want.error) return { ok: false, msg: 'The model answer failed to run, which is a bug in the guide: ' + want.error.msg };
    if (!mine.result) return { ok: false, msg: ex.check ? 'The check after your SQL returned nothing.' : 'Your SQL ran, but it didn\'t return any rows to compare. Did you finish with a SELECT?' };
    const a = normRows(mine.result), b = normRows(want.result);
    const ca = mine.result.columns.length, cb = want.result.columns.length;
    if (ca !== cb) return { ok: false, msg: 'Close. You returned ' + ca + ' column' + (ca === 1 ? '' : 's') + ', but the answer has ' + cb + '. Re-read which columns the question asks for.' };
    if (a.length !== b.length) return { ok: false, msg: 'You returned ' + a.length + ' row' + (a.length === 1 ? '' : 's') + ', but the answer has ' + b.length + '. Check your filter.' };
    const key = JSON.stringify;
    if (a.every((r, i) => key(r) === key(b[i]))) return { ok: true };
    const sa = a.map(key).sort(), sb = b.map(key).sort();
    const sameSet = sa.every((r, i) => r === sb[i]);
    if (sameSet && !ex.ordered) return { ok: true };
    if (sameSet) return { ok: false, msg: 'Right rows, wrong order. Check your ORDER BY.' };
    return { ok: false, msg: 'The shape is right, but some values differ. Check calculations, column order, and which rows you picked.' };
  }

  // ---------- chapters → steps ----------
  const stepCache = {};
  function stepsOf(ch) {
    if (stepCache[ch.id]) return stepCache[ch.id];
    const tmp = el('div', null, ch.body);
    const steps = [];
    let pre = '';
    let cur = null;
    [...tmp.childNodes].forEach(node => {
      if (node.nodeName === 'H2') { cur = { title: node.textContent.trim(), html: '' }; steps.push(cur); return; }
      const html = node.nodeType === 1 ? node.outerHTML : (node.textContent.trim() ? node.textContent : '');
      if (cur) cur.html += html; else pre += html;
    });
    if (!steps.length) steps.push({ title: ch.introTitle || 'Before you start', html: '' });
    steps[0].html = pre + steps[0].html;
    steps.forEach((s, i) => { s.tasks = ch.exercises.map((ex, j) => ({ ex, j })).filter(t => t.ex.at === i); });
    const practice = ch.exercises.map((ex, j) => ({ ex, j })).filter(t => t.ex.at === 'practice');
    if (practice.length) steps.push({ title: 'Practice', practice: true, html: '', tasks: practice });
    stepCache[ch.id] = steps;
    return steps;
  }
  const seenKey = (ch, i) => ch.id + ':' + i;
  const stepSolved = (ch, s) => s.tasks.every(t => progress.solved[exId(ch, t.j)]);

  function currentPosition() {
    if (progress.pos && chapterById(progress.pos.ch)) {
      const ch = chapterById(progress.pos.ch);
      return { ch, step: Math.min(progress.pos.step, stepsOf(ch).length - 1) };
    }
    const ch = G.chapters.find(c => !progress.done[c.id]) || G.chapters[0];
    return { ch, step: 0 };
  }

  // ---------- site chrome ----------
  function siteHeader(active) {
    return '<header class="site"><a class="logo" href="#/"><span class="logo-mark">§</span>SQL, step by step</a>' +
      '<button class="menu-btn" type="button" data-menu>Menu</button>' +
      '<nav class="site-nav">' + NAV.map(([k, label]) => '<a href="#/' + k + '"' + (active === k ? ' class="on"' : '') + '>' + label + '</a>').join('') +
      '<button class="theme-btn" type="button" data-theme-toggle>' + (isDark() ? 'Light' : 'Dark') + '</button></nav></header>';
  }
  function isDark() { return getComputedStyle(document.documentElement).colorScheme === 'dark'; }
  function wireChrome() {
    const t = root.querySelector('[data-theme-toggle]');
    if (t) t.onclick = () => {
      const next = isDark() ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('sqlguide.theme', next); } catch (e) {}
      t.textContent = next === 'dark' ? 'Light' : 'Dark';
    };
    const m = root.querySelector('[data-menu]');
    if (m) m.onclick = () => document.body.classList.toggle('nav-open');
  }

  // ---------- home ----------
  function renderHome() {
    const { ch: cur, step } = currentPosition();
    const steps = stepsOf(cur);
    const started = Object.keys(progress.seen).length > 0;
    const doneCount = G.chapters.filter(c => progress.done[c.id]).length;
    const solved = allExercises().filter(x => progress.solved[x.id]).length;
    const total = allExercises().length;
    const pct = Math.round(step / steps.length * 100);

    let html = siteHeader('') + '<main class="home">';
    if (started) {
      html += '<p class="hello">Welcome back</p><h1 class="home-title">Pick up where you left off.</h1>';
    } else {
      html += '<p class="hello">Welcome</p><h1 class="home-title">Learn SQL one small step at a time.</h1>' +
        '<p class="home-intro">Each lesson is a handful of short steps: one idea, one example you can run, then a small task to try yourself. Everything runs here in the browser, so there\'s nothing to install.</p>';
    }
    html += '<a class="continue" href="#/ch/' + cur.id + '/' + (step + 1) + '">' +
      '<span class="c-meta">Chapter ' + cur.num + ' · Step ' + (step + 1) + ' of ' + steps.length + '</span>' +
      '<span class="c-title">' + esc(cur.title) + '</span>' +
      '<span class="c-sub">' + (started ? 'Next up: ' + esc(steps[step].title.toLowerCase()) + '.' : esc(cur.summary)) + '</span>' +
      '<span class="c-bar"><i style="width:' + pct + '%"></i></span>' +
      '<span class="c-go">' + (started ? 'Continue' : 'Start') + ' →</span></a>';
    if (started) html += '<p class="tally"><b>' + doneCount + '</b> of ' + G.chapters.length + ' chapters done · <b>' + solved + '</b> of ' + total + ' exercises solved</p>';

    html += '<h2 class="path-title">Your path</h2><div class="path">';
    PARTS.forEach((part, pi) => {
      const chs = part.ids.map(chapterById);
      const open = chs.includes(cur);
      const done = chs.filter(c => progress.done[c.id]).length;
      html += '<details class="part"' + (open ? ' open' : '') + '><summary><span class="pn">Part ' + (pi + 1) + '</span><span class="pt">' + esc(part.name) + '</span><span class="pc">' + done + ' of ' + chs.length + '</span></summary><ol class="chs">';
      chs.forEach(c => {
        const isCur = c === cur && started;
        const st = progress.done[c.id] ? 'Done' : isCur ? 'Step ' + (step + 1) + ' of ' + steps.length : '';
        html += '<li class="ch' + (progress.done[c.id] ? ' done' : '') + (isCur ? ' current' : '') + '"><a href="#/ch/' + c.id + '">' +
          '<span class="chn">' + c.num + '</span><span class="cht"><b>' + esc(c.title) + '</b><small>' + esc(c.summary) + '</small></span><span class="st">' + st + '</span></a></li>';
      });
      html += '</ol></details>';
    });
    html += '</div><p class="home-foot">Your progress is saved in this browser. Stuck on a table name? Keep <a href="#/schema">The database</a> open in another tab.</p></main>';
    root.innerHTML = html;
    wireChrome();
  }

  // ---------- lesson step ----------
  function renderStep(ch, i) {
    const steps = stepsOf(ch);
    i = Math.max(0, Math.min(i, steps.length - 1));
    const step = steps[i];
    progress.pos = { ch: ch.id, step: i };
    progress.seen[seenKey(ch, i)] = 1;
    save();

    const top = el('header', 'lesson-top');
    top.innerHTML = '<a class="back" href="#/">← Your path</a><span class="crumb">Chapter ' + ch.num + ' · ' + esc(ch.title) + '</span>' +
      '<ol class="dots">' + steps.map((_, k) => '<li class="' + (k === i ? 'cur' : progress.seen[seenKey(ch, k)] ? 'done' : '') + '"></li>').join('') + '</ol>' +
      '<span class="count">' + (i + 1) + ' / ' + steps.length + '</span>';

    const main = el('main', 'lesson');
    const side = el('nav', 'steps-side', '<p class="ss-ch">Chapter ' + ch.num + '</p><p class="ss-title">' + esc(ch.title) + '</p><ol>' +
      steps.map((s, k) => '<li class="' + (k === i ? 'cur' : progress.seen[seenKey(ch, k)] ? 'seen' : '') + '"><a href="#/ch/' + ch.id + '/' + (k + 1) + '"><span>' + (k + 1) + '</span>' + esc(s.title) + '</a></li>').join('') + '</ol>');
    side.setAttribute('aria-label', 'Steps in this chapter');

    const body = el('div', 'lesson-body');
    body.innerHTML = '<p class="step-label">Step ' + (i + 1) + ' of ' + steps.length + '</p><h1 class="lesson-title">' + esc(step.title) + '</h1>' +
      (i === 0 ? '<p class="page-lead">' + esc(ch.summary) + '</p>' : '') +
      (step.practice ? '<p class="practice-intro">A few more exercises to lock in this chapter. Each one starts from a fresh copy of the data, so you can\'t break anything. Column order matters; row order only matters when the question asks for sorting.</p>' : '') +
      step.html;
    upgradeNotes(body);
    upgradeExamples(body);
    main.append(side, body);

    const nav = el('footer', 'lesson-nav');
    const prevHref = i > 0 ? '#/ch/' + ch.id + '/' + i : '#/';
    const next = i < steps.length - 1 ? { href: '#/ch/' + ch.id + '/' + (i + 2), label: 'Continue →' }
      : nextChapter(ch) ? { href: '#/ch/' + nextChapter(ch).id + '/1', label: 'Next chapter →' } : { href: '#/', label: 'Finish →' };
    nav.innerHTML = '<a class="btn quiet" href="' + prevHref + '">← Back</a><span class="nav-mid"></span>';
    const nextBtn = button(next.label, 'next', () => { leaveStep(ch, i); location.hash = next.href; });
    nav.append(nextBtn);
    const mid = nav.querySelector('.nav-mid');
    const updateGate = () => {
      const solved = stepSolved(ch, step);
      nextBtn.disabled = !solved;
      if (!step.tasks.length) mid.textContent = i < steps.length - 1 ? 'Next: ' + steps[i + 1].title : (nextChapter(ch) ? 'Next chapter: ' + nextChapter(ch).title : 'Last step of the guide');
      else if (solved) mid.textContent = step.practice ? 'Chapter complete. Well done.' : 'Nicely done.';
      else {
        mid.innerHTML = 'Solve “Your turn” to continue, or <a href="' + next.href + '">skip for now</a>';
        mid.querySelector('a').addEventListener('click', () => leaveStep(ch, i));
      }
    };

    step.tasks.forEach(t => body.append(renderTask(ch, t.ex, t.j, step.tasks.length > 1, updateGate)));
    updateGate();

    root.innerHTML = '';
    root.append(top, main, nav);
    document.title = step.title + ' · ' + ch.title + ' · SQL, step by step';
  }
  function nextChapter(ch) { return G.chapters[G.chapters.indexOf(ch) + 1]; }
  function leaveStep(ch, i) {
    if (i === stepsOf(ch).length - 1) { progress.done[ch.id] = 1; const n = nextChapter(ch); if (n) progress.pos = { ch: n.id, step: 0 }; }
    save();
  }

  function renderTask(ch, ex, j, numbered, onSolved) {
    const id = exId(ch, j);
    const box = el('section', 'task' + (progress.solved[id] ? ' solved' : ''));
    const label = el('p', 'task-label', 'Your turn' + (numbered ? ' · ' + ch.num + '.' + (j + 1) : '') + (ex.level ? ' <span class="lvl">' + ex.level + '</span>' : '') + (progress.solved[id] ? ' <span class="done-mark">Solved</span>' : ''));
    const q = el('div', 'task-q', ex.prompt);
    const ed = makeEditor(progress.drafts[id] != null ? progress.drafts[id] : (ex.starter || ''), {
      label: 'Your answer', placeholder: '-- Write your SQL here', onRun: () => runIt(),
      onInput: v => { progress.drafts[id] = v; save(); }
    });
    const runIt = () => { const db = freshDb(ex.setup); renderResult(ed.out, runSql(db, ed.ta.value)); db.close(); };
    const checkIt = () => {
      if (!ed.ta.value.trim()) { ed.out.innerHTML = '<p class="fb info">Write a query first.</p>'; return; }
      const { mine, want } = evaluate(ex, ed.ta.value);
      const v = compare(ex, mine, want);
      renderResult(ed.out, mine);
      if (v.ok) ed.out.prepend(el('p', 'fb ok', 'Correct.'));
      else if (!v.err) ed.out.prepend(el('p', 'fb no', esc(v.msg)));
      if (v.ok && !progress.solved[id]) {
        progress.solved[id] = Date.now(); save();
        box.classList.add('solved');
        label.insertAdjacentHTML('beforeend', ' <span class="done-mark">Solved</span>');
        onSolved();
      }
    };
    let hintEl = null, revealArmed = false;
    ed.actions.append(button('Check answer', '', checkIt), button('Run', 'quiet', runIt), kbd());
    if (ex.hint) ed.head.append(linkButton('Hint', () => {
      if (hintEl) { hintEl.remove(); hintEl = null; return; }
      hintEl = el('p', 'hint', ex.hint); q.after(hintEl);
    }));
    ed.head.append(linkButton('Expected result', () => {
      const db = freshDb(ex.setup);
      let r = runSql(db, ex.solution);
      if (!r.error && ex.check) r = runSql(db, ex.check);
      db.close();
      ed.out.innerHTML = '<p class="fb info">A correct answer returns this' + (ex.check ? ' (checked afterwards with <code>' + esc(ex.check) + '</code>)' : '') + ':</p>';
      if (r.result) ed.out.append(resultTable(r.result));
    }));
    const reveal = linkButton('Solution', () => {
      if (!revealArmed) { revealArmed = true; reveal.textContent = 'Have a real go first. Show it anyway?'; return; }
      ed.set(ex.solution); progress.drafts[id] = ex.solution; save();
      reveal.textContent = 'Solution';
      revealArmed = false;
      ed.out.innerHTML = '<p class="fb info">Here\'s one correct answer. Read it line by line, then press Check answer.</p>';
    });
    ed.head.append(reveal);
    box.append(label, q, ed.box);
    return box;
  }

  // ---------- reference pages ----------
  function renderPage(key) {
    const page = PAGES[key];
    root.innerHTML = siteHeader(key) + '<main class="page"><p class="page-kicker">' + esc(page.eyebrow || 'Reference') + '</p><h1 class="page-title">' + esc(page.title) + '</h1>' +
      (page.lead ? '<p class="page-lead">' + page.lead + '</p>' : '') + '<div class="page-body">' + page.body + '</div></main>';
    const main = root.querySelector('.page');
    if (page.after) page.after(main, { sandbox, runSql });
    upgradeNotes(main);
    upgradeExamples(main);
    wireChrome();
    document.title = page.title + ' · SQL, step by step';
  }

  function renderSelfTest() {
    const rows = [];
    G.chapters.forEach(ch => {
      const db = freshDb();
      el('div', null, ch.body).querySelectorAll('pre.run').forEach((p, i) => {
        const r = runSql(db, p.textContent);
        const expectErr = p.dataset.expect === 'error';
        rows.push([ch.num + ' example ' + (i + 1), expectErr ? (r.error ? '✓' : '✗ expected an error') : (r.error ? '✗ ' + r.error.msg : '✓'), p.textContent.trim().slice(0, 70)]);
      });
      db.close();
      ch.exercises.forEach((ex, i) => {
        const { want } = evaluate(ex, ex.solution);
        const n = want.result ? want.result.values.length : 0;
        const placed = ex.at === 'practice' || (Number.isInteger(ex.at) && ex.at < stepsOf(ch).length);
        rows.push([ch.num + '.' + (i + 1), want.error ? '✗ ' + want.error.msg : !n ? '✗ empty' : !placed ? '✗ no step' : '✓', ex.solution.trim().slice(0, 70)]);
      });
    });
    const bad = rows.filter(r => r[1] !== '✓');
    root.innerHTML = siteHeader('') + '<main class="page"><h1 class="page-title">Self-test</h1><p><b>' + rows.length + '</b> checks, <b>' + bad.length + '</b> problems.</p><table class="doc"><tr><th>Item</th><th>Status</th><th>SQL</th></tr>' +
      rows.map(r => '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td><code>' + esc(r[2]) + '</code></td></tr>').join('') + '</table></main>';
    window.__selftest = { total: rows.length, bad: bad.length, problems: bad };
  }

  // ---------- router ----------
  function route() {
    document.body.classList.remove('nav-open');
    const path = (location.hash.replace(/^#/, '') || '/').split('?')[0];
    const m = path.match(/^\/ch\/([\w-]+)(?:\/(\d+))?/);
    if (m && chapterById(m[1])) {
      const ch = chapterById(m[1]);
      let i = m[2] ? parseInt(m[2], 10) - 1 : (progress.pos && progress.pos.ch === ch.id ? progress.pos.step : 0);
      renderStep(ch, i);
    } else if (path === '/selftest') {
      renderSelfTest();
    } else if (PAGES[path.slice(1)]) {
      renderPage(path.slice(1));
    } else {
      renderHome();
      document.title = 'SQL, step by step';
    }
    window.scrollTo(0, 0);
  }

  initSqlJs({ locateFile: f => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/' + f })
    .then(mod => { SQL = mod; sandbox = freshDb(); window.addEventListener('hashchange', route); route(); })
    .catch(err => {
      root.innerHTML = '<main class="page"><h1 class="page-title">Couldn\'t load the database engine</h1><p>The guide needs an internet connection the first time it opens, to download the SQL engine. Check your connection and reload.</p><p class="sans" style="color:var(--muted)">' + esc(err && err.message || err) + '</p></main>';
    });
})();
