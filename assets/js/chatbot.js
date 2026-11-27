'use strict';
/*
  Siyanda's portfolio assistant.
  Runs fully in the browser (no API keys, no server). It reads window.SITE (assets/js/data.js),
  so answers always match what is on the website. To teach it something new, edit data.js
  or add an intent to the INTENTS list below.
*/
(function () {
  const S = window.SITE;
  const esc = (t) => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" stroke-width="2.6"/></svg>';
  const ICON_SPARK = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15z"/></svg>';
  const ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>';

  /* ---------- text helpers ---------- */
  const norm = (t) => t.toLowerCase().replace(/c#/g, 'csharp').replace(/\.net/g, 'dotnet').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  function lev(a, b) {
    const m = a.length, n = b.length; if (Math.abs(m - n) > 2) return 9;
    const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  const near = (a, b) => a === b || (b.length >= 5 && lev(a, b) <= (b.length >= 9 ? 2 : 1));
  const has = (text, tokens, kw) => kw.includes(' ') ? text.includes(kw) : tokens.some(t => near(t, kw));

  /* ---------- lookups from data.js ---------- */
  const allModules = Object.entries(S.modules).flatMap(([group, list]) => list.map(m => ({ ...m, group })));
  const STOP = new Set(['did', 'you', 'do', 'he', 'siyanda', 'the', 'a', 'an', 'in', 'of', 'and', 'have', 'has', 'study', 'studied', 'module', 'modules', 'subject', 'subjects', 'course', 'about', 'what', 'is', 'was', 'take', 'took', 'learn', 'learned', 'know', 'with', 'for', 'ii', 'i', 'iii', 'iv', 'a', 'b', 'ia', 'ib', 'iia', 'iib', 'iiia', 'iiib']);
  function findModules(tokens) {
    const q = tokens.filter(t => !STOP.has(t) && t.length > 2);
    if (!q.length) return [];
    const scored = allModules.map(m => {
      const words = norm(m.n).split(' ');
      const hit = q.filter(t => words.some(w => near(t, w))).length;
      return { m, hit };
    }).filter(x => x.hit > 0);
    if (!scored.length) return [];
    const best = Math.max(...scored.map(x => x.hit));
    if (best < Math.min(2, q.length)) return [];
    return scored.filter(x => x.hit === best).map(x => x.m);
  }
  const ALIAS = {
    'X - Report': ['xreport', 'x report', 'report app', 'fixforward', 'community'], 'EduBudget AI': ['edubudget', 'budget', 'budgeting', 'edubudte'],
    'UbuntuGRID': ['ubuntugrid', 'ubuntu', 'grid', 'civic'], 'E-Commerce Website': ['ecommerce', 'e commerce', 'online store', 'mr x', 'shop'],
    'Pizza App': ['pizza', 'pizzeria'], 'Gen-V App': ['gen v', 'genv'], 'Tracker App': ['tracker'], 'ChessBoard Game': ['chess', 'game'],
    'TechBase App': ['techbase'], 'Mechanics Shop App': ['mechanic', 'mechanics'], 'Gym Company Website': ['gym'], 'Earlier Portfolio': ['other portfolio', 'earlier portfolio']
  };
  const TECH = { csharp: 'C#', java: 'Java', javascript: 'JavaScript', js: 'JavaScript', react: 'React', node: 'Node.js', nodejs: 'Node.js', express: 'Express', sql: 'SQL', postgresql: 'PostgreSQL', postgres: 'PostgreSQL', firebase: 'Firebase', supabase: 'Supabase', maui: '.NET MAUI', android: 'Android Studio', html: 'HTML', css: 'CSS', groq: 'Groq', leaflet: 'Leaflet', netlify: 'Netlify', azure: 'Azure' };
  const findProject = (text, tokens) => S.projects.find(p => {
    const names = [norm(p.name), ...(ALIAS[p.name] || [])];
    return names.some(n => text.includes(n)) || tokens.some(t => t.length > 5 && (norm(p.name).split(' ').some(w => near(t, w))));
  });

  /* ---------- renderers ---------- */
  const link = (u, t) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`;
  const tags = (arr) => arr.map(t => `<span class="tag">${esc(t)}</span>`).join('');
  const projCard = (p) => `<b>${esc(p.name)}</b> (${esc(p.status)})<br>${esc(p.desc)}<br>${tags(p.tech)}<br>${link(p.link, p.cta + ' →')}`;
  const modList = (title, mods) => `<b>${esc(title)}</b><ul>${mods.map(m => `<li>${esc(m.n)}${m.d ? ' ⭐' : ''}</li>`).join('')}</ul>`;

  const CHIPS = {
    home: ['Education', 'Modules', 'Projects', 'Skills', 'Download CV', 'Contact'],
    edu: ['Advanced Diploma', 'Diploma in ICT', 'Machine Learning?', 'All modules'],
    proj: ['X - Report', 'EduBudget AI', 'UbuntuGRID', 'Java projects']
  };
  let lastTopic = null;

  /* ---------- intents ---------- */
  const INTENTS = [
    { id: 'greet', kw: ['hi', 'hello', 'hey', 'howzit', 'sawubona', 'good morning', 'good afternoon', 'good evening', 'yo'], weight: 1,
      reply: () => ({ html: `Hi! 👋 I'm Siyanda's assistant. I can tell you about his <b>qualifications and modules</b>, <b>projects</b>, <b>skills</b>, <b>experience</b> and how to <b>contact him</b>. What would you like to know?`, chips: CHIPS.home }) },
    { id: 'thanks', kw: ['thanks', 'thank you', 'thx', 'appreciate', 'cheers'], weight: 2,
      reply: () => ({ html: `You're welcome! Anything else you'd like to know about Siyanda?`, chips: CHIPS.home }) },
    { id: 'bye', kw: ['bye', 'goodbye', 'see you', 'cya'], weight: 2, reply: () => ({ html: `Thanks for stopping by! If you'd like to talk to Siyanda, use the Contact page or email ${link('mailto:' + S.email, S.email)}.` }) },
    { id: 'about', kw: ['who is siyanda', 'who are you', 'about siyanda', 'tell me about', 'introduce', 'yourself', 'about him', 'summary', 'overview', 'who is he'], weight: 3,
      reply: () => ({ html: `<b>Siyanda Xaba</b> is a software developer from Durban who has completed an <b>Advanced Diploma in ICT (NQF 7)</b> at Durban University of Technology (2026). He builds full-stack web and Android apps with C#, Java, JavaScript, React and Node.js, deploys on Azure and Netlify, and has experience in IT support. He's currently working as an invigilator at Rosebank College and is open to junior developer and IT support roles.`, chips: CHIPS.home }) },
    { id: 'status', kw: ['student', 'still studying', 'graduate', 'graduated', 'completed', 'finished', 'qualified', 'status', 'final year', 'currently studying', 'in school'], weight: 2,
      reply: () => ({ html: `Siyanda is no longer a student. He completed his <b>Advanced Diploma in ICT (NQF 7)</b> at DUT in 2026 (February to November), after finishing his <b>Diploma in ICT in Application Development (NQF 6)</b> in 2025.`, chips: CHIPS.edu }) },
    { id: 'adict', kw: ['advanced diploma', 'adict', 'nqf 7', 'nqf7', 'postgraduate', 'honours', 'honors', 'level 7', 'advanced'], weight: 3,
      reply: () => ({ html: `<b>Advanced Diploma in Information and Communications Technology (ADICT1)</b>, ${S.qualifications[0].institution}, ${S.qualifications[0].period}.<br><br>It is a one-year, 120-credit qualification at <b>NQF level 7</b> that follows a Diploma in ICT (NQF 6) and goes deeper into computing theory and practice. It also opens the door to postgraduate study such as the Bachelor of ICT Honours.<br><br><b>Siyanda's modules:</b> Semester 1: Applied Mathematics for Computing A, Data Structures, Platform Based Development, Research Skills. Semester 2: Machine Learning, Applied Mathematics for Computing B, Software Development and Management, Business Intelligence.`, chips: ['Machine Learning?', 'Diploma in ICT', 'Projects'] }) },
    { id: 'diploma', kw: ['diploma in ict', 'application development', 'applications development', 'diiad', 'nqf 6', 'nqf6', 'first qualification', 'diploma'], weight: 2,
      reply: () => ({ html: `<b>Diploma in ICT in Application Development (DIIAD1)</b>, ${S.qualifications[1].institution}, 2023 to 2025 (graduated 19 May 2026).<br><br>It is a three-year, 360-credit qualification at <b>NQF level 6</b> focused on building software: Applications Development I to III, Mobile Computing, Information Systems and Management, Communication Networks, Computer Security, Human Computer Interaction, IT Project Management and a final-year development project. Siyanda earned distinctions in Applications Development, Communication Networks, ICT Literacy and Entrepreneurial Spirit.`, chips: ['Advanced Diploma', 'All modules', 'Projects'] }) },
    { id: 'education', kw: ['education', 'qualification', 'qualifications', 'studied', 'university', 'dut', 'degree', 'school', 'studies', 'academic', 'matric', 'durban university'], weight: 2,
      reply: () => ({ html: `Siyanda studied at <b>Durban University of Technology</b>:<ul><li><b>Advanced Diploma in ICT</b> (NQF 7), Feb to Nov 2026, completed</li><li><b>Diploma in ICT in Application Development</b> (NQF 6), 2023 to 2025, completed</li><li>National Senior Certificate, Sidelile High School, 2018 to 2022</li></ul>Ask me about either qualification or any module.`, chips: CHIPS.edu }) },
    { id: 'modules', kw: ['all modules', 'list modules', 'which modules', 'what modules', 'modules', 'subjects', 'transcript', 'curriculum', 'courses'], weight: 2,
      reply: () => ({ html: `He has completed ${allModules.length} modules across both qualifications. The full list is on the <b>Resume</b> page under "Modules completed". Pick a year:`, chips: ['Modules 2026', 'Modules 2025', 'Modules 2024', 'Modules 2023'] }) },
    { id: 'experience', kw: ['experience', 'work', 'job', 'employment', 'worked', 'career', 'invigilator', 'rosebank', 'chatsworth', 'sidelile', 'employer', 'working'], weight: 2,
      reply: () => ({ html: `<b>Experience</b><ul>${S.experience.map(e => `<li><b>${esc(e.role)}</b>, ${esc(e.org)} (${esc(e.when)}): ${esc(e.what)}</li>`).join('')}</ul>` }) },
    { id: 'skills', kw: ['skill', 'skills', 'technologies', 'tech stack', 'stack', 'languages', 'programming', 'tools', 'good at', 'proficient', 'expertise'], weight: 2,
      reply: () => ({ html: `<b>Skills</b><br>${S.skillGroups.map(g => `<b>${esc(g.title)}:</b> ${esc(g.items.join(', '))}`).join('<br>')}`, chips: ['Projects', 'Download CV'] }) },
    { id: 'projects', kw: ['project', 'projects', 'portfolio', 'apps', 'built', 'made', 'work samples', 'examples', 'showcase', 'all projects'], weight: 2,
      reply: () => ({ html: `Siyanda has built <b>${S.projects.length} projects</b>. Highlights:<ul>${S.projects.slice(0, 5).map(p => `<li><b>${esc(p.name)}</b>: ${esc(p.desc)}</li>`).join('')}</ul>See them all on the <b>Projects</b> page, or ask about one by name.`, chips: CHIPS.proj }) },
    { id: 'cv', kw: ['cv', 'resume', 'download cv', 'curriculum vitae', 'download resume'], weight: 3,
      reply: () => ({ html: `You can download his CV here: ${link(S.cv, 'Siyanda-Xaba-CV.pdf')}. It's also on the Resume page.` }) },
    { id: 'contact', kw: ['contact', 'email', 'phone', 'number', 'reach', 'call', 'get in touch', 'whatsapp', 'message him', 'address', 'location', 'where is he', 'where does'], weight: 2,
      reply: () => ({ html: `<b>Contact Siyanda</b><br>📧 ${link('mailto:' + S.email, S.email)}<br>📱 ${link('tel:+27664428931', S.phone)}<br>📍 ${esc(S.location)}<br>💻 ${link(S.github, 'GitHub')} · ${link(S.linkedin, 'LinkedIn')}` }) },
    { id: 'hire', kw: ['hire', 'hiring', 'available', 'availability', 'open to work', 'vacancy', 'opportunity', 'why should', 'recruit', 'junior', 'internship', 'learnership', 'graduate programme', 'strengths', 'why siyanda'], weight: 2,
      reply: () => ({ html: `Yes, Siyanda is <b>open to work</b> as a junior software developer or in IT support. Why he's a strong hire:<ul><li>Advanced Diploma in ICT (NQF 7) plus a Diploma in Application Development</li><li>Ships real projects: a live community-reporting platform, an AI budgeting app built in a team, Android and e-commerce apps</li><li>Full-stack range: C#, Java, JavaScript, React, Node.js, SQL, Azure</li><li>Practical IT support and teamwork experience, and a fast learner</li></ul>Email ${link('mailto:' + S.email, S.email)} or download his ${link(S.cv, 'CV')}.`, chips: ['Download CV', 'Contact', 'Projects'] }) },
    { id: 'certs', kw: ['certificate', 'certificates', 'certification', 'certifications', 'cisco', 'certified', 'packet tracer'], weight: 2,
      reply: () => ({ html: `<b>Certificates</b><ul>${S.certificates.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` }) },
    { id: 'ml', kw: ['machine learning', 'ai', 'artificial intelligence', 'data science', 'business intelligence', 'bi', 'analytics', 'data'], weight: 1,
      reply: () => ({ html: `In his Advanced Diploma, Siyanda studied <b>Machine Learning</b> and <b>Business Intelligence</b> (semester 2, 2026), plus <b>Data Structures</b> and <b>Applied Mathematics for Computing</b>. On the practical side, EduBudget AI uses the Groq API to power an AI shopping assistant.`, chips: ['EduBudget AI', 'All modules'] }) },
    { id: 'help', kw: ['help', 'what can you do', 'options', 'menu', 'commands'], weight: 2, reply: () => ({ html: `Try asking:<ul><li>"What did he study in 2026?"</li><li>"Did he do Machine Learning?"</li><li>"What is an Advanced Diploma?"</li><li>"Tell me about X - Report"</li><li>"Which projects use React?"</li><li>"Is he available for work?"</li></ul>`, chips: CHIPS.home }) }
  ];

  /* ---------- the brain ---------- */
  function answer(raw) {
    const text = norm(raw), tokens = text.split(' ').filter(Boolean);
    if (!tokens.length) return { html: 'Type a question and I will do my best!' };

    // follow-ups
    if (/^(more|tell me more|go on|yes|yeah|sure|ok|okay)$/.test(text) && lastTopic === 'projects')
      return { html: S.projects.slice(5).map(projCard).join('<br><br>'), chips: CHIPS.home };

    // modules by year
    const yr = text.match(/\b(2023|2024|2025|2026)\b/);
    if (yr && /(module|subject|stud|did|course|took|learn)/.test(text)) {
      const key = Object.keys(S.modules).find(k => k.includes(yr[1]));
      if (key) return { html: modList(key, S.modules[key]) + '<br>⭐ = passed with distinction', chips: CHIPS.edu };
    }

    // specific project
    const proj = findProject(text, tokens);
    if (proj) { lastTopic = 'project'; return { html: projCard(proj), chips: CHIPS.proj }; }

    // project by technology
    const techKeys = [...new Set(tokens.map(t => (t === 'js' ? 'javascript' : t)).filter(t => TECH[t]))];
    if (techKeys.length && /(project|app|build|built|made|use|using|experience|know|work)/.test(text)) {
      const wanted = TECH[techKeys[0]];
      const hits = S.projects.filter(p => p.tech.some(t => norm(t).split(' ').includes(norm(wanted))) || p.tech.some(t => t.toLowerCase().includes(wanted.toLowerCase().split(' ')[0])));
      if (hits.length) return { html: `Projects using <b>${esc(wanted)}</b>:<ul>${hits.map(p => `<li><b>${esc(p.name)}</b>: ${esc(p.desc)} ${link(p.link, 'Open →')}</li>`).join('')}</ul>`, chips: CHIPS.proj };
    }

    // specific module(s)
    const looksLikeModuleQ = /(did|do|have|take|took|study|studied|learn|module|subject|know|experience|covered)/.test(text);
    if (looksLikeModuleQ && !/(project|app)/.test(text)) {
      const mods = findModules(tokens);
      if (mods.length && mods.length <= 6) {
        lastTopic = 'module';
        return { html: mods.map(m => `Yes. Siyanda completed <b>${esc(m.n)}</b> (${esc(m.group)}, ${esc(m.s)})${m.d ? ' and passed with <b>distinction</b>' : ''}.`).join('<br>'), chips: CHIPS.edu };
      }
    }

    // score intents
    let best = null, bestScore = 0;
    for (const it of INTENTS) {
      let score = 0;
      for (const k of it.kw) if (has(text, tokens, k)) score += (k.includes(' ') ? 2 : 1) * it.weight;
      if (score > bestScore) { best = it; bestScore = score; }
    }
    if (best) { lastTopic = best.id; return best.reply(text); }

    // module query without a recognisable verb
    const mods = findModules(tokens);
    if (mods.length && mods.length <= 6) return { html: mods.map(m => `<b>${esc(m.n)}</b>: ${esc(m.group)}, ${esc(m.s)}${m.d ? ' (distinction)' : ''}`).join('<br>'), chips: CHIPS.edu };

    return { html: `I'm not sure I understood that, but I can help with Siyanda's <b>education and modules</b>, <b>projects</b>, <b>skills</b>, <b>experience</b> and <b>contact details</b>. For anything else, email ${link('mailto:' + S.email, S.email)}.`, chips: CHIPS.home };
  }

  /* ---------- UI ---------- */
  const root = document.createElement('div');
  root.innerHTML = `
    <button class="sb-launcher" aria-label="Open chat with Siyanda's assistant" aria-expanded="false">${ICON_CHAT}</button>
    <div class="sb-nudge" hidden>Hi! Ask me about Siyanda's qualifications, modules and projects 👋</div>
    <section class="sb-window" role="dialog" aria-label="Chat with Siyanda's assistant" hidden>
      <header class="sb-head">
        <div class="sb-avatar">${ICON_SPARK}<i></i></div>
        <div class="sb-title"><strong>Siyanda's Assistant</strong><span>Ask about studies, projects and skills</span></div>
        <button class="sb-close" aria-label="Close chat">×</button>
      </header>
      <div class="sb-body" aria-live="polite"></div>
      <div class="sb-chips"></div>
      <form class="sb-form"><input class="sb-input" type="text" placeholder="Ask me anything about Siyanda…" autocomplete="off" aria-label="Your message"><button class="sb-send" aria-label="Send">${ICON_SEND}</button></form>
      <div class="sb-foot">Automated assistant. Answers come from this website.</div>
    </section>`;
  document.body.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const launcher = $('.sb-launcher'), win = $('.sb-window'), body = $('.sb-body'), chipsEl = $('.sb-chips'), input = $('.sb-input'), nudge = $('.sb-nudge');

  function add(who, html, isText) {
    const d = document.createElement('div');
    d.className = 'sb-msg ' + who;
    if (isText) d.textContent = html; else d.innerHTML = html;
    body.appendChild(d); body.scrollTop = body.scrollHeight; return d;
  }
  function setChips(list) {
    chipsEl.innerHTML = '';
    (list || CHIPS.home).forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.className = 'sb-chip'; b.textContent = c; b.onclick = () => ask(c); chipsEl.appendChild(b); });
  }
  const CHIP_MAP = { 'Download CV': 'download cv', 'Machine Learning?': 'did you do machine learning', 'All modules': 'all modules', 'Advanced Diploma': 'advanced diploma', 'Diploma in ICT': 'diploma in ict',
    'Modules 2026': 'modules 2026', 'Modules 2025': 'modules 2025', 'Modules 2024': 'modules 2024', 'Modules 2023': 'modules 2023', 'Java projects': 'java projects', 'X - Report': 'x report' };
  function ask(q) {
    add('user', q, true); input.value = ''; chipsEl.innerHTML = '';
    const t = document.createElement('div'); t.className = 'sb-msg bot sb-typing'; t.innerHTML = '<span></span><span></span><span></span>'; body.appendChild(t); body.scrollTop = body.scrollHeight;
    setTimeout(() => {
      t.remove();
      const r = answer(CHIP_MAP[q] || q);
      add('bot', r.html); setChips(r.chips);
    }, 450 + Math.random() * 350);
  }
  function open() {
    win.hidden = false; launcher.classList.add('open'); launcher.setAttribute('aria-expanded', 'true'); nudge.hidden = true;
    if (!body.children.length) { const r = INTENTS[0].reply(); add('bot', r.html); setChips(r.chips); }
    setTimeout(() => input.focus(), 50);
  }
  function close() { win.hidden = true; launcher.classList.remove('open'); launcher.setAttribute('aria-expanded', 'false'); }
  launcher.onclick = () => (win.hidden ? open() : close());
  $('.sb-close').onclick = close;
  $('.sb-form').onsubmit = (e) => { e.preventDefault(); const v = input.value.trim(); if (v) ask(v.slice(0, 300)); };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !win.hidden) close(); });
  setTimeout(() => { if (win.hidden) { nudge.hidden = false; setTimeout(() => (nudge.hidden = true), 7000); } }, 4000);

  window.SiyandaBot = { open, close, answer };
})();
