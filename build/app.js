/* Hora Patana webapp — vanilla JS. Data lives in data.js (window.HP_DATA). */
(function () {
  var D = window.HP_DATA;
  var CONTACT = D.CONTACT, STATS = D.STATS, TESTIMONIALS = D.TESTIMONIALS,
      HONOURS = D.HONOURS, TEACHER = D.TEACHER, SUCCESSOR = D.SUCCESSOR, MEDIA = D.MEDIA;
  var MONTHS = D.MONTHS, DAY_COLOR = D.DAY_COLOR, PROVINCES = D.PROVINCES,
      ZODIAC = D.ZODIAC, ART = D.ZODIAC_ART || {};
  var RASI = D.RASI, PLACE = D.PLACE, LESSONS = D.LESSONS, PLANETS = D.PLANETS,
      COURSES = D.COURSES, ARTICLES = D.ARTICLES, VIDEOS = D.VIDEOS,
      SERVICES = D.SERVICES, SLOTS = D.SLOTS, GOOD = D.GOOD_DAYS, AVOID = D.AVOID_DAYS;

  var CHART_ROWS = [
    { p: '๑ อาทิตย์', rasi: 'กรกฎ', house: 'ตนุ', std: 'ปกติ', cls: 'tag-neutral' },
    { p: '๒ จันทร์', rasi: 'กันย์', house: 'สหัชชะ', std: 'เกษตร', cls: 'tag-accent' },
    { p: '๓ อังคาร', rasi: 'เมษ', house: 'ทสมะ', std: 'เกษตร', cls: 'tag-accent' },
    { p: '๔ พุธ', rasi: 'เมถุน', house: 'ปุตตะ', std: 'เกษตร', cls: 'tag-accent' },
    { p: '๕ พฤหัสบดี', rasi: 'ธนู', house: 'ศุภะ', std: 'เกษตร', cls: 'tag-accent' },
    { p: '๖ ศุกร์', rasi: 'เมถุน', house: 'ปุตตะ', std: 'ปกติ', cls: 'tag-neutral' },
    { p: '๗ เสาร์', rasi: 'พิจิก', house: 'ปัญจมะ', std: 'นิจจ์', cls: 'tag-outline' },
    { p: '๘ ราหู', rasi: 'กุมภ์', house: 'อัฏฐมะ', std: 'ปกติ', cls: 'tag-neutral' }
  ];
  var RUEK = [
    { day: '20', t: 'ฤกษ์เปิดกิจการ', d: 'อาทิตย์เข้าเกณฑ์ราชาโชค', time: '09:09' },
    { day: '22', t: 'ฤกษ์แต่งงาน', d: 'ศุกร์ได้ตำแหน่งดี ปัตนิสะอาด', time: '10:19' },
    { day: '28', t: 'ฤกษ์ขึ้นบ้านใหม่', d: 'พฤหัสเสวยฤกษ์ พันธุภพแข็ง', time: '07:39' }
  ];
  var MILESTONES = [
    { y: '๒๕๒๖', t: 'เริ่มรับพยากรณ์และวางฤกษ์ให้ครอบครัวและผู้สนใจ' },
    { y: '๒๕๓๕', t: 'เปิดชั้นเรียนโหราศาสตร์ไทยรุ่นแรก' },
    { y: '๒๕๔๘', t: 'เรียบเรียงตำราราศีเกณฑ์สำหรับผู้เรียนรุ่นใหม่' },
    { y: '๒๕๖๕', t: 'ถ่ายทอดคำสอนผ่านช่อง YouTube ให้ศิษย์ทั่วประเทศ' }
  ];
  var TODAY = {
    label: 'พ. 19 สิงหาคม 2569', rasi: 'จันทร์ราศีพิจิก', ruek: 'ฤกษ์กลาง เหมาะเจรจา',
    note: 'ช่วง 09:09–10:39 ดาวศุภะเข้าเกณฑ์ เหมาะแก่การพูดคุยตกลงและเริ่มเรียนวิชาใหม่'
  };
  var HEADS = {
    home: ['โหรพัฒนา', 'Hora Patana'], lessons: ['บทเรียน', 'โหราศาสตร์ไทย ๙ บท'],
    chart: ['ผูกดวง', 'แผนภูมิดวงชะตา'], calendar: ['ฤกษ์', 'ปฏิทินฤกษ์'],
    courses: ['เรียนกับเรา', 'คอร์สเรียน'], booking: ['บริการ', 'จองปรึกษา'],
    articles: ['คลังความรู้', 'บทความ'], videos: ['คลังความรู้', 'วิดีโอ'],
    teacher: ['ประวัติ', 'อาจารย์พัฒนา'], me: ['ของฉัน', 'ความคืบหน้า'], search: ['ค้นหา', 'ค้นทั้งแอป']
  };
  var TABS = [['home', 'หน้าแรก', 'home'], ['lessons', 'บทเรียน', 'lessons'],
              ['chart', 'ผูกดวง', 'chart'], ['ruek', 'ฤกษ์', 'calendar'], ['me', 'ฉัน', 'me']];
  var ICON = {
    back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>',
    search: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    play: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l14 8-14 8V4z"/></svg>',
    chev: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"><path d="M9 6l6 6-6 6"/></svg>'
  };

  var HOME = (new URLSearchParams(location.search).get('home')) || 'index';
  var SAVED = {};
  try { SAVED = JSON.parse(localStorage.getItem('hp.state') || '{}') || {}; } catch (e) { SAVED = {}; }

  /* Birth details are picked from lists, so they are stored as numbers rather
     than as the display string the old free-text fields saved. */
  var BIRTH_DEFAULT = { d: 14, m: 6, y: 2533, hh: 8, mm: 20, place: 'กรุงเทพมหานคร' };
  function migrateBirth(b) {
    if (!b) return Object.assign({}, BIRTH_DEFAULT);
    if (typeof b.y === 'number') return b;
    var out = Object.assign({}, BIRTH_DEFAULT);
    if (typeof b.date === 'string') {
      var p = b.date.trim().split(/\s+/), mi = MONTHS.indexOf(p[1]);
      if (p.length === 3 && mi >= 0 && +p[0] && +p[2]) { out.d = +p[0]; out.m = mi; out.y = +p[2]; }
    }
    if (typeof b.time === 'string') {
      var t = b.time.split(':');
      if (t.length === 2 && t[0] !== '' && t[1] !== '') { out.hh = +t[0]; out.mm = +t[1]; }
    }
    if (b.place && PROVINCES.indexOf(b.place) >= 0) out.place = b.place;
    return out;
  }

  var S = Object.assign({
    tab: 'home', screen: 'home', stack: [], lesson: 1, done: [0], chartDone: true, chartStyle: 'thai',
    birth: Object.assign({}, BIRTH_DEFAULT),
    calDay: 20, q: '', booking: { svc: 'ดูดวงพื้นชะตา', slot: null, name: '', note: '', done: false }
  }, SAVED);
  S.birth = migrateBirth(S.birth);

  function save() {
    try { localStorage.setItem('hp.state', JSON.stringify(S)); } catch (e) {}
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function tabOf(screen) {
    if (screen === 'home') return 'home';
    if (screen === 'lessons' || screen === 'reader') return 'lessons';
    if (screen === 'chart') return 'chart';
    if (screen === 'calendar' || screen === 'booking') return 'ruek';
    return 'me';
  }
  /* Which way the next view should enter from. */
  var navDir = 'tab';

  function go(screen) {
    if (S.screen !== screen) S.stack.push(S.screen);
    navDir = 'fwd'; S.screen = screen; S.tab = tabOf(screen); render();
  }
  function back() {
    navDir = 'back'; S.screen = S.stack.pop() || 'home'; S.tab = tabOf(S.screen); render();
  }
  function pickTab(tab, screen) { navDir = 'tab'; S.tab = tab; S.screen = screen; S.stack = []; render(); }
  function openLesson(i) { navDir = 'fwd'; S.lesson = i; S.stack.push(S.screen); S.screen = 'reader'; S.tab = 'lessons'; render(); }

  function progress() {
    return { count: S.done.length, pct: Math.round(S.done.length / LESSONS.length * 100) + '%' };
  }
  function nextUnread() { return Math.min(Math.max.apply(null, S.done.concat([-1])) + 1, LESSONS.length - 1); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function birthDate() { var b = S.birth; return b.d + ' ' + MONTHS[b.m] + ' ' + b.y; }
  function birthTime() { var b = S.birth; return pad2(b.hh) + ':' + pad2(b.mm); }
  /* Skip an empty place rather than trailing a dangling separator. */
  function birthLine() { return [birthDate(), birthTime(), S.birth.place].filter(Boolean).join(' · '); }
  /* Feb and the 30-day months must not offer a day they do not have. BE year
     minus 543 gives the Gregorian year the leap rule applies to. */
  function daysInMonth(m, yBE) { return new Date(yBE - 543, m + 1, 0).getDate(); }

  /* ── marquee + Thai chart craft ─────────────────── */
  function artSrc(slug) {
    var f = ART[slug];
    if (!f) return '';
    return /^(data:|https?:|\/)/.test(f) ? f : 'assets/zodiac/' + f;
  }
  function zodiacItem(z, dup) {
    return '<figure class="mq-item' + (dup ? ' mq-dup' : '') + '"' + (dup ? ' aria-hidden="true"' : '') +
      ' data-act="lesson" data-i="0" title="ราศี' + esc(z.name) + ' · ธาตุ' + esc(z.el) + '">' +
      '<span class="mq-thumb"><img class="mq-img" src="' + esc(artSrc(z.slug)) +
      '" alt="ภาพราศี' + esc(z.name) + '"' + (dup ? ' aria-hidden="true"' : '') + '></span></figure>';
  }
  /* The strip holds the signs twice so the loop can translate by exactly one
     copy and restart with no visible seam. Only signs with a drawing appear. */
  function marquee() {
    var signs = ZODIAC.filter(function (z) { return artSrc(z.slug); });
    if (!signs.length) return '';
    var a1 = signs.map(function (z) { return zodiacItem(z, false); }).join('');
    var a2 = signs.map(function (z) { return zodiacItem(z, true); }).join('');
    return '<section class="marquee" aria-label="จักรราศี"><div class="mq-track">' + a1 + a2 + '</div></section>';
  }
  function wireMarquee(root) {
    var mq = root.querySelector('.marquee');
    if (!mq) return;
    mq.querySelectorAll('.mq-img').forEach(function (img) {
      var show = function () { if (img.naturalWidth > 0) img.classList.add('is-loaded'); };
      if (img.complete) show(); else img.addEventListener('load', show, { once: true });
    });
    mq.addEventListener('pointerdown', function () { mq.classList.add('is-paused'); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      mq.addEventListener(ev, function () { mq.classList.remove('is-paused'); });
    });
  }

  var THAI_DIGITS = '๐๑๒๓๔๕๖๗๘๙';
  function planetNo(ch) { return THAI_DIGITS.indexOf(ch); }
  /* Grahas are written as Thai numerals; tint each with its day colour so the
     chart can be scanned the way a โหร reads it — by colour, then by number. */
  function tintNums(s) {
    return String(s == null ? '' : s).split('').map(function (ch) {
      var n = planetNo(ch);
      return n > 0 && DAY_COLOR[n]
        ? '<b class="graha" style="color:' + DAY_COLOR[n] + '">' + ch + '</b>' : esc(ch);
    }).join('');
  }
  /* จตุโกณ — the Thai square horoscope: twelve fixed houses around a 4x4 grid,
     rasi running clockwise from เมษ, centre reserved for the native. */
  var TK_CELL = [[1,2],[1,3],[1,4],[2,4],[3,4],[4,4],[4,3],[4,2],[4,1],[3,1],[2,1],[1,1]];
  function squareChart() {
    var cells = RASI.map(function (name, i) {
      var c = TK_CELL[i], lagna = i === 3;
      return '<div class="tk-cell' + (lagna ? ' is-lagna' : '') +
        '" style="grid-row:' + c[0] + ';grid-column:' + c[1] + '">' +
        '<span class="tk-rasi">' + esc(name) + '</span>' +
        (PLACE[i] ? '<span class="tk-graha">' + tintNums(PLACE[i]) + '</span>' : '') +
        (lagna ? '<span class="tk-lag">ลัคนา</span>' : '') + '</div>';
    }).join('');
    return '<div class="tk" role="img" aria-label="ดวงชะตาแบบจตุโกณ">' + cells +
      '<div class="tk-center"><div class="tk-c-kicker">ดวงชะตา</div>' +
      '<div class="tk-c-line">' + esc(birthDate()) + '</div>' +
      '<div class="tk-c-line">' + esc(birthTime()) + ' น.</div>' +
      '<div class="tk-c-place">' + esc(S.birth.place) + '</div></div></div>';
  }

  function opts(list, sel, valueOf, labelOf) {
    return list.map(function (item, i) {
      var v = valueOf ? valueOf(item, i) : item;
      return '<option value="' + esc(v) + '"' + (String(v) === String(sel) ? ' selected' : '') + '>' +
        esc(labelOf ? labelOf(item, i) : item) + '</option>';
    }).join('');
  }
  function range(from, to, step) {
    var out = [];
    for (var i = from; step > 0 ? i <= to : i >= to; i += step) out.push(i);
    return out;
  }
  function select(bind, options, aria) {
    return '<select class="input" data-bind="' + bind + '" data-num="1" data-live="1" aria-label="' +
      esc(aria) + '">' + options + '</select>';
  }

  function houses() {
    var cx = 170, cy = 170, R = 150, Rin = 112, Rlab = 131, Rp = 80;
    return RASI.map(function (name, i) {
      var a0 = (i * 30 - 90) * Math.PI / 180, am = ((i + 0.5) * 30 - 90) * Math.PI / 180;
      var pct = function (v) { return (100 * v / 340).toFixed(2) + '%'; };
      return {
        name: name, planets: PLACE[i] || '', lagna: i === 3,
        x1: (cx + Rin * Math.cos(a0)).toFixed(1), y1: (cy + Rin * Math.sin(a0)).toFixed(1),
        x2: (cx + R * Math.cos(a0)).toFixed(1), y2: (cy + R * Math.sin(a0)).toFixed(1),
        lx: pct(cx + Rlab * Math.cos(am)), ly: pct(cy + Rlab * Math.sin(am)),
        px: pct(cx + Rp * Math.cos(am)), py: pct(cy + Rp * Math.sin(am))
      };
    });
  }
  function wheelSvg(hs, strokeWide) {
    return '<svg viewBox="0 0 340 340" aria-hidden="true">' +
      '<circle cx="170" cy="170" r="150" fill="none" stroke="currentColor" stroke-width="' + (strokeWide ? 3 : 1.5) + '"/>' +
      '<circle cx="170" cy="170" r="112" fill="none" stroke="currentColor" stroke-width="' + (strokeWide ? 1.5 : 1) + '"/>' +
      (strokeWide ? '' : '<circle cx="170" cy="170" r="46" fill="none" stroke="currentColor" stroke-width="1"/>' +
        '<circle cx="170" cy="170" r="143" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"/>') +
      hs.map(function (h) {
        return '<line x1="' + h.x1 + '" y1="' + h.y1 + '" x2="' + h.x2 + '" y2="' + h.y2 + '" stroke="currentColor" stroke-width="' + (strokeWide ? 1.5 : 1) + '"/>';
      }).join('') + '</svg>';
  }
  function wheel() {
    var hs = houses();
    return '<div class="wheel">' + wheelSvg(hs, false) +
      hs.map(function (h) {
        return '<div class="wheel-label" style="left:' + h.lx + ';top:' + h.ly + '">' + esc(h.name) + '</div>' +
          (h.planets ? '<div class="wheel-planet' + (h.lagna ? ' lagna' : '') + '" style="left:' + h.px + ';top:' + h.py + '">' + esc(h.planets) + '</div>' : '');
      }).join('') +
      '<div class="wheel-center">ลัคนา</div></div>';
  }

  /* One large portrait beats two small ornaments: a visitor must see who
     teaches before they see what is taught. Falls back to a marked slot until
     the real photograph is supplied. */
  function heroPortrait() {
    return '<figure class="hero-portrait"><img src="' + esc(TEACHER.photo) +
      '" alt="อาจารย์' + esc(TEACHER.name) + '" width="760" height="1047">' +
      '<figcaption>' + esc(TEACHER.name) + '<span>' + esc(TEACHER.born) + ' – ' + esc(TEACHER.died) + '</span></figcaption>' +
      '</figure>';
  }

  /* Third-party recognition carries the trust that a round number cannot. */
  function honours() {
    if (!HONOURS || !HONOURS.length) return '';
    return '<div class="sec-title">ได้รับการยอมรับ</div>' +
      '<ul class="honours">' + HONOURS.map(function (h) {
        return '<li><span class="hon-t">' + esc(h.t) + '</span>' +
               '<span class="hon-by">' + esc(h.by) + '</span></li>';
      }).join('') + '</ul>';
  }

  /* Credibility before persuasion — unverified figures are omitted rather than
     guessed, so the strip only ever shows what can be stood behind. */
  function statStrip() {
    /* Every entry is now sourced, so the only guard left is against a blank. */
    var shown = STATS.filter(function (x) { return x.n && x.n !== '—'; });
    if (!shown.length) return '';
    return '<section class="stats" aria-label="ประสบการณ์">' +
      shown.map(function (x) {
        return '<div class="stat"><div class="stat-n">' + esc(x.n) + '</div>' +
               '<div class="stat-k">' + esc(x.k) + '</div></div>';
      }).join('') + '</section>';
  }

  function testimonials() {
    if (!TESTIMONIALS.length) return '';
    return '<div class="sec-title">เสียงจากลูกศิษย์</div>' +
      '<div class="quotes">' + TESTIMONIALS.map(function (t) {
        return '<figure class="quote"><blockquote>' + esc(t.text) + '</blockquote>' +
          '<figcaption>' + esc(t.name) + (t.meta ? ' · <span class="muted">' + esc(t.meta) + '</span>' : '') +
          '</figcaption></figure>';
      }).join('') + '</div>';
  }

  /* LINE is the channel this audience actually uses, so it stays reachable from
     every screen instead of being buried in the footer. */
  function lineFab() {
    return '<a class="fab-line" href="https://line.me/R/ti/p/~' + esc(CONTACT.lineId) + '"' +
      ' target="_blank" rel="noopener" aria-label="ติดต่อทางไลน์ ' + esc(CONTACT.lineId) + '">' +
      '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
      '<path fill="currentColor" d="M12 3C6.9 3 3 6.3 3 10.3c0 3.6 3.1 6.6 7.3 7.2.3.1.7.2.8.5.1.3.1.6 0 .9l-.1.8c0 .2-.2.9.8.5s5.3-3.1 7.2-5.3c1.3-1.4 1.9-2.9 1.9-4.6C21 6.3 17.1 3 12 3z"/>' +
      '</svg><span>ทักไลน์</span></a>';
  }

  /* Site footer — the same shortcuts and contact details the website carries,
     so the app ends the way the site does rather than trailing off. */
  var FOOT_MENU = [
    ['home','home','หน้าแรก'], ['lessons','lessons','บทเรียนโหราศาสตร์ไทย'],
    ['chart','chart','ผูกดวงชะตา'], ['ruek','calendar','ปฏิทินฤกษ์'],
    ['me','courses','คอร์สเรียน'], ['me','teacher','ประวัติอาจารย์พัฒนา'],
    ['me','videos','วิดีโอ'], ['me','articles','บทความ']
  ];
  function siteFooter() {
    var dot = '<i class="sf-dot" aria-hidden="true"></i>';
    return '<footer class="site-foot">' +
      '<div class="sf-top"><img src="logo.png" width="34" height="34" alt="">' +
      '<span class="sf-name">เรียนดวง กับ บรมครูโหร <em>พัฒนา พัฒนศิริ</em></span></div>' +

      '<nav class="sf-nav" aria-label="เมนูทางลัด">' +
      FOOT_MENU.map(function (mn, i) {
        return (i ? dot : '') + '<button class="sf-link" data-act="tab" data-tab="' + mn[0] +
          '" data-screen="' + mn[1] + '">' + esc(mn[2]) + '</button>';
      }).join('') + '</nav>' +

      '<div class="sf-nav sf-contact">' +
      '<a class="sf-link" href="tel:' + esc(CONTACT.tel.replace(/\s/g, '')) + '">โทร ' + esc(CONTACT.tel) + '</a>' + dot +
      '<a class="sf-link" href="https://line.me/R/ti/p/~' + esc(CONTACT.lineId) + '" target="_blank" rel="noopener">ไลน์ ' + esc(CONTACT.lineId) + '</a>' + dot +
      '<a class="sf-link" href="' + esc(CONTACT.youtube) + '" target="_blank" rel="noopener">YouTube</a>' +
      '</div>' +

      '<div class="sf-copy">© 2026 Miracle Life Coach Co., Ltd.</div>' +
      '</footer>';
  }

  function lessonRows(showTags) {
    var maxDone = Math.max.apply(null, S.done.concat([-1]));
    return LESSONS.map(function (l, i) {
      var done = S.done.indexOf(i) >= 0, now = !done && i === maxDone + 1;
      return '<div class="row' + (now ? ' is-now' : '') + '" data-act="lesson" data-i="' + i + '">' +
        '<div class="row-num">' + esc(l.n) + '</div><div class="row-main">' +
        '<div class="row-title">' + esc(l.t) + '</div><div class="row-sub">' + esc(l.d) + '</div>' +
        (showTags ? '<div class="chips"><span class="tag tag-neutral">' + esc(l.mins) + '</span><span class="tag tag-outline">' + l.secs.length + ' หัวข้อ</span></div>' : '') +
        '</div><div class="row-state ' + (done ? 'done' : 'now') + '">' + (done ? 'เรียนแล้ว' : (now ? 'เรียนต่อ' : '')) + '</div></div>';
    }).join('');
  }
  /* Wrapped so wide viewports can lay the ladder out in columns. */
  function lessonList(showTags) { return '<div class="lesson-grid">' + lessonRows(showTags) + '</div>'; }

  /* ── screens ─────────────────────────────────────── */
  var V = {};

  V.home = function () {
    if (HOME === 'chart') return V.homeChart();
    if (HOME === 'course') return V.homeCourse();
    return V.homeIndex();
  };

  V.homeIndex = function () {
    return '<div class="today-strip"><b>' + esc(TODAY.label) + '</b><span class="muted" style="font-size:12px">' + esc(TODAY.rasi) + '</span>' +
      '<span class="tag tag-accent" data-act="tab" data-tab="ruek" data-screen="calendar">' + esc(TODAY.ruek) + '</span></div>' +
      '<section class="hero">' +
      '<h2 class="lead"><span class="lead-pre">เรียนดวง กับ บรมครูโหร</span><em>พัฒนา พัฒนศิริ</em></h2>' +
      '<div class="orn"><i></i></div>' +
      '<p class="muted">โหราศาสตร์ไทย เพื่อความเข้าใจชีวิต<br>และพัฒนาตนเองอย่างมีสติ</p>' +
      heroPortrait() +
      /* One action leads; the rest are quieter links so nothing competes. */
      '<div class="cta-lead"><button class="btn btn-primary btn-block btn-lg" data-act="tab" data-tab="chart" data-screen="chart">ผูกดวงชะตาของคุณ</button>' +
      '<div class="cta-sub"><button class="linkish" data-act="go" data-screen="courses">คอร์สเรียน</button>' +
      '<span class="cta-dot"></span>' +
      '<button class="linkish" data-act="go" data-screen="videos">ดูวิดีโอสอน</button></div></div></section>' +
      statStrip() +
      honours() +
      marquee() +
      '<div class="sec-title">บทเรียนทั้งเก้า</div>' + lessonList(false) +
      testimonials();
  };

  V.homeChart = function () {
    var hs = houses();
    return '<section class="poster"><div class="kicker">ฤกษ์วันนี้ · ' + esc(TODAY.label) + '</div>' +
      '<h2>' + esc(TODAY.ruek) + '</h2><p>' + esc(TODAY.note) + '</p>' +
      '<div class="actions"><button class="btn btn-invert" data-act="tab" data-tab="ruek" data-screen="calendar">ปฏิทินฤกษ์</button>' +
      '<button class="btn btn-outline-light" data-act="go" data-screen="booking">จองปรึกษา</button></div></section>' +
      '<div class="mini-chart" data-act="tab" data-tab="chart" data-screen="chart">' + wheelSvg(hs, true) +
      '<div class="row-main"><div class="card-title">พื้นดวงของคุณ</div>' +
      '<div class="row-sub">' + esc(birthLine()) + '</div>' +
      '<div style="font-size:12px;margin-top:6px">ลัคนาราศีกรกฎ · เจ้าเรือน จันทร์ (๒)</div></div></div>' +
      '<div class="grid-2">' +
      card('บทเรียน', 'เก้าบท ตามลำดับ', 'จักรราศี → พยากรณ์', 'เรียนแล้ว ' + progress().count + ' / ' + LESSONS.length + ' บท', 'tab', 'lessons', 'lessons') +
      card('วิดีโอ', 'เรียนดวงกับบรมครู', 'คลิปสอนจากช่อง YouTube', '42 คลิป', 'go', 'videos') +
      card('บทความ', 'ความรู้เรื่องฤกษ์', 'อ่านสั้น ๆ วันละเรื่อง', '18 เรื่อง', 'go', 'articles') +
      card('ครูผู้สอน', 'พัฒนา พัฒนศิริ', 'ประสบการณ์กว่า ๔๐ ปี', 'ประวัติอาจารย์', 'go', 'teacher') +
      '</div>';
  };

  function card(kicker, title, body, meta, act, a, b) {
    return '<div class="card" data-act="' + act + '" data-screen="' + (act === 'tab' ? b : a) + '"' + (act === 'tab' ? ' data-tab="' + a + '"' : '') + '>' +
      '<div class="card-kicker">' + esc(kicker) + '</div><div class="card-title">' + esc(title) + '</div>' +
      '<p class="card-body">' + esc(body) + '</p><div class="card-meta">' + esc(meta) + '</div></div>';
  }

  V.homeCourse = function () {
    var i = nextUnread(), l = LESSONS[i], p = progress();
    return '<div class="hero-photo"><div class="ph">ภาพอาจารย์พัฒนา · รอไฟล์จริง</div>' +
      '<h2>เรียนดวงกับ<br>บรมครูโหรพัฒนา</h2></div>' +
      '<div class="block" data-act="lesson" data-i="' + i + '" style="cursor:pointer">' +
      '<div class="kicker">เรียนต่อ</div><h3 style="font-size:22px;margin-top:6px">' + esc(l.n) + ' · ' + esc(l.t) + '</h3>' +
      '<div class="row-sub">' + esc(l.d) + '</div>' +
      '<div class="progress" style="margin-top:12px"><span style="width:' + p.pct + '"></span></div>' +
      '<div class="muted" style="font-size:11px;margin-top:5px">เรียนแล้ว ' + p.count + ' / ' + LESSONS.length + ' บท</div></div>' +
      '<div class="sec-title">คอร์สที่เปิดรับ</div>' +
      COURSES.map(function (c) {
        return '<div class="row" data-act="go" data-screen="courses"><div class="row-main">' +
          '<div class="row-title">' + esc(c.t) + '</div><div class="row-sub">' + esc(c.meta) + '</div></div>' +
          '<div class="num" style="font-size:15px">' + esc(c.price) + '</div></div>';
      }).join('') +
      '<div class="stack"><button class="btn btn-primary btn-block" data-act="go" data-screen="booking">จองปรึกษาส่วนตัว</button>' +
      '<button class="btn btn-secondary btn-block" data-act="tab" data-tab="chart" data-screen="chart">ผูกดวงชะตาด้วยตัวเอง</button></div>';
  };

  V.lessons = function () {
    var p = progress();
    return '<div class="block" style="display:flex;align-items:center;gap:10px">' +
      '<div class="progress" style="flex:1"><span style="width:' + p.pct + '"></span></div>' +
      '<div class="num" style="font-size:11px">เรียนแล้ว ' + p.count + ' / ' + LESSONS.length + ' บท</div></div>' +
      lessonList(true) + '<div style="height:24px"></div>';
  };

  V.reader = function () {
    var l = LESSONS[S.lesson], done = S.done.indexOf(S.lesson) >= 0;
    var next = Math.min(S.lesson + 1, LESSONS.length - 1);
    return '<div class="reader-head"><div class="kicker">บทที่ ' + esc(l.n) + '</div><h2>' + esc(l.t) + '</h2>' +
      '<p class="muted" style="margin:8px 0 0;font-size:13px">' + esc(l.d) + '</p></div>' +
      l.secs.map(function (s, i) {
        return '<div class="reader-sec' + (i === 0 ? ' lead-sec' : '') + '"><h3>' + esc(s.h) + '</h3><p>' + esc(s.p) + '</p></div>';
      }).join('') +
      (l.hasTable ? '<div class="reader-sec"><h3>ดาวพระเคราะห์ทั้ง ๑๐ ดวง</h3><table class="table"><thead><tr><th>เลข</th><th>ดาว</th><th>เกษตร</th></tr></thead><tbody>' +
        PLANETS.map(function (p) {
          return '<tr><td class="num-accent">' + esc(p.n) + '</td><td>' + esc(p.name) + '</td><td class="muted">' + esc(p.home) + '</td></tr>';
        }).join('') + '</tbody></table></div>' : '') +
      '<div class="stack"><button class="btn btn-primary btn-block" data-act="done">' + (done ? 'เรียนบทนี้แล้ว ✓' : 'ทำเครื่องหมายว่าเรียนแล้ว') + '</button>' +
      '<button class="btn btn-secondary btn-block" data-act="lesson" data-i="' + next + '">บทต่อไป · ' + esc(LESSONS[next].t) + '</button></div>';
  };

  V.chart = function () {
    var b = S.birth;
    /* A day that no longer exists after changing month or year is pulled back to
       the last valid day instead of silently staying out of range. */
    var dim = daysInMonth(b.m, b.y);
    if (b.d > dim) b.d = dim;
    var thisYear = new Date().getFullYear() + 543;
    var out = '<div class="block">' +
      '<div class="field"><span>วันเกิด</span><div class="picker picker-date">' +
        select('birth.d', opts(range(1, dim, 1), b.d), 'วันที่') +
        select('birth.m', opts(MONTHS, b.m, function (n, i) { return i; }), 'เดือน') +
        select('birth.y', opts(range(thisYear, thisYear - 100, -1), b.y), 'ปี พ.ศ.') +
      '</div></div>' +
      '<div class="field" style="margin-top:16px"><span>เวลาเกิด</span><div class="picker picker-time">' +
        select('birth.hh', opts(range(0, 23, 1), b.hh, null, function (n) { return pad2(n) + ' น.'; }), 'ชั่วโมง') +
        select('birth.mm', opts(range(0, 59, 1), b.mm, null, function (n) { return pad2(n) + ' นาที'; }), 'นาที') +
      '</div></div>' +
      '<label class="field" style="margin-top:16px"><span>สถานที่เกิด</span>' +
        '<select class="input" data-bind="birth.place" data-live="1">' + opts(PROVINCES, b.place) + '</select>' +
      '</label>' +
      '<button class="btn btn-primary btn-block" style="margin-top:18px" data-act="cast">' +
      (S.chartDone ? 'คำนวณใหม่' : 'ผูกดวง') + '</button></div>';
    if (!S.chartDone) return out;
    var thai = S.chartStyle !== 'wheel';
    return out +
      '<div class="seg" role="group" aria-label="รูปแบบแผนภูมิ">' +
        '<button class="seg-btn' + (thai ? ' on' : '') + '" data-act="cstyle" data-t="thai">จตุโกณ · แบบไทย</button>' +
        '<button class="seg-btn' + (thai ? '' : ' on') + '" data-act="cstyle" data-t="wheel">จักรราศี · วงกลม</button>' +
      '</div>' +
      (thai ? '<div class="tk-wrap">' + squareChart() + '</div>'
            : '<div class="wheel-wrap">' + wheel() + '</div>') +
      '<div class="wheel-caption">' + esc(birthLine()) + '</div>' +
      '<div style="padding:0 16px 16px"><table class="table"><thead><tr><th>ดาว</th><th>ราศี</th><th>ภพ</th><th>มาตรฐาน</th></tr></thead><tbody>' +
      CHART_ROWS.map(function (r) {
        var gn = planetNo(String(r.p).charAt(0));
        return '<tr data-act="lesson" data-i="3"><td class="num">' +
          (DAY_COLOR[gn] ? '<i class="graha-dot" style="background:' + DAY_COLOR[gn] + '"></i>' : '') +
          esc(r.p) + '</td><td>' + esc(r.rasi) + '</td><td>' + esc(r.house) + '</td>' +
          '<td><span class="tag ' + r.cls + '">' + esc(r.std) + '</span></td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div style="padding:0 16px 24px"><h3 style="font-size:17px;margin-bottom:6px">อ่านพื้นดวงอย่างไร</h3>' +
      '<p style="font-size:13px;line-height:1.75">เริ่มจากลัคนา ดูเจ้าเรือนลัคนาสถิตราศีใด แล้วอ่านภพ ๑ ถึง ๑๒ ตามลำดับ ก่อนพิจารณามาตรฐานดาว—เกษตร อุจจ์ นิจจ์—เพื่อชั่งกำลังของแต่ละดวง</p>' +
      '<button class="btn btn-secondary btn-block" data-act="lesson" data-i="6">ไปบทเรียนพยากรณ์</button></div>';
  };

  V.calendar = function () {
    var cells = '';
    var offset = new Date(2026, 7, 1).getDay(); // 1 ส.ค. 2569 = เสาร์
    for (var i = 0; i < offset; i++) cells += '<div class="cal-day empty"></div>';
    for (var d = 1; d <= 31; d++) {
      var cls = 'cal-day' + (S.calDay === d ? ' sel' : (GOOD.indexOf(d) >= 0 ? ' good' : (AVOID.indexOf(d) >= 0 ? ' avoid' : '')));
      var mark = GOOD.indexOf(d) >= 0 ? '<i class="mk good"></i>' : (AVOID.indexOf(d) >= 0 ? '<i class="mk avoid"></i>' : '');
      var aria = GOOD.indexOf(d) >= 0 ? ' aria-label="' + d + ' ฤกษ์ดี"' : (AVOID.indexOf(d) >= 0 ? ' aria-label="' + d + ' ควรเลี่ยง"' : '');
      cells += '<div class="' + cls + '" data-act="calday" data-d="' + d + '"' + aria + '>' + d + '<span>' + mark + '</span></div>';
    }
    var total = offset + 31; while (total % 7 !== 0) { cells += '<div class="cal-day empty"></div>'; total++; }
    var dow = ['อา','จ','อ','พ','พฤ','ศ','ส'].map(function (d) { return '<div class="cal-dow">' + d + '</div>'; }).join('');
    return '<div class="cal-head"><h3>สิงหาคม 2569</h3><div class="cal-legend">' +
      '<span><i class="mk good"></i>ฤกษ์ดี</span><span><i class="mk avoid"></i>ควรเลี่ยง</span></div></div>' +
      '<div class="cal-dows">' + dow + '</div><div class="cal">' + cells + '</div>' +
      '<div class="sec-title">ฤกษ์เด่นเดือนนี้</div>' +
      RUEK.map(function (r) {
        return '<div class="row" data-act="go" data-screen="booking" style="border-top:1px solid var(--gold-hair);border-bottom:0">' +
          '<div class="row-num" style="font-size:20px;width:44px">' + esc(r.day) + '</div><div class="row-main">' +
          '<div class="row-title" style="font-size:15px">' + esc(r.t) + '</div><div class="row-sub">' + esc(r.d) + '</div></div>' +
          '<span class="tag tag-accent">' + esc(r.time) + '</span></div>';
      }).join('') +
      '<div class="stack"><button class="btn btn-primary btn-block" data-act="go" data-screen="booking">ขอฤกษ์เฉพาะของคุณ</button></div>';
  };

  V.courses = function () {
    return COURSES.map(function (c) {
      return '<div style="padding:18px 16px;border-bottom:1px solid var(--gold-hair)">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">' +
        '<h3 style="font-size:19px">' + esc(c.t) + '</h3><div class="num" style="font-size:17px">' + esc(c.price) + '</div></div>' +
        '<div class="row-sub">' + esc(c.meta) + '</div>' +
        '<p style="margin:10px 0 0;font-size:13px;line-height:1.7">' + esc(c.body) + '</p>' +
        '<div class="chips">' + c.tags.map(function (t) { return '<span class="tag tag-neutral">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<button class="btn btn-primary btn-block" style="margin-top:12px" data-act="go" data-screen="booking">สมัครเรียน</button></div>';
    }).join('');
  };

  V.booking = function () {
    var b = S.booking;
    if (b.done) {
      return '<div style="padding:22px 16px"><section class="poster" style="border-radius:var(--r-md)">' +
        '<div class="kicker">ยืนยันการจองแล้ว</div><h2 style="font-size:24px">' + esc(b.svc) + '</h2>' +
        '<p style="font-size:14px">' + esc(b.slot) + '</p></section>' +
        '<p class="muted" style="margin:14px 0 0;font-size:13px">ทีมงานจะติดต่อยืนยันทางไลน์ภายใน ๑ วันทำการ</p>' +
        '<button class="btn btn-secondary btn-block" style="margin-top:12px" data-act="rebook">จองรายการอื่น</button></div>';
    }
    return '<div class="block"><div class="block-title">เลือกบริการ</div><div class="pick-list">' +
      SERVICES.map(function (s) {
        return '<div class="pick" role="button" aria-pressed="' + (b.svc === s.t) + '" data-act="svc" data-t="' + esc(s.t) + '">' +
          '<div><div class="pick-title">' + esc(s.t) + '</div><div class="pick-sub">' + esc(s.d) + '</div></div>' +
          '<div class="num">' + esc(s.price) + '</div></div>';
      }).join('') + '</div></div>' +
      '<div class="block"><div class="block-title">เลือกเวลา (ฤกษ์ที่เหมาะ)</div><div class="slots">' +
      SLOTS.map(function (s) {
        return '<button class="slot" aria-pressed="' + (b.slot === s.label) + '" data-act="slot" data-t="' + esc(s.label) + '">' +
          '<span class="slot-label">' + esc(s.label) + '</span><span class="slot-note">' + esc(s.note) + '</span></button>';
      }).join('') + '</div></div>' +
      '<div style="padding:16px"><label class="field"><span>ชื่อ–นามสกุล</span><input class="input" data-bind="booking.name" value="' + esc(b.name) + '"></label>' +
      '<label class="field" style="margin-top:10px"><span>คำถามที่อยากปรึกษา</span><textarea class="input" data-bind="booking.note">' + esc(b.note) + '</textarea></label>' +
      '<button class="btn btn-primary btn-block" style="margin-top:12px" data-act="confirm"' + (b.slot ? '' : ' disabled') + '>' +
      (b.slot ? 'ยืนยันการจอง' : 'เลือกเวลาก่อน') + '</button>' +
      '<div class="muted" style="font-size:11px;margin-top:8px">ค่าบริการชำระหลังยืนยันฤกษ์ · ยกเลิกฟรีก่อน ๒๔ ชม.</div></div>';
  };

  V.articles = function () {
    /* The site's own บทความ page reads "เร็วๆ นี้" — say the same rather than
       render an empty screen or invent posts. */
    if (!ARTICLES.length) {
      return '<div class="empty-state"><div class="orn"><i></i></div>' +
        '<h3>เร็วๆ นี้</h3>' +
        '<p class="muted">บทความจากตำราของบรมครูโหรพัฒนากำลังจัดเตรียมอยู่<br>ระหว่างนี้เชิญอ่านบทเรียนทั้งเก้าได้เลย</p>' +
        '<button class="btn btn-secondary" data-act="tab" data-tab="lessons" data-screen="lessons">ไปที่บทเรียน</button>' +
        '</div>';
    }
    return ARTICLES.map(function (a) {
      return '<article class="article"><div class="card-kicker">' + esc(a.cat) + '</div><h3>' + esc(a.t) + '</h3>' +
        '<p class="muted" style="margin:6px 0 0;font-size:13px">' + esc(a.d) + '</p>' +
        '<div class="card-meta" style="margin-top:8px">' + esc(a.meta) + '</div></article>';
    }).join('') + '<div style="height:24px"></div>';
  };

  V.videos = function () {
    return VIDEOS.map(function (v) {
      return '<div class="video-row"><div class="video-thumb"><img src="' + esc(MEDIA.ytThumb) +
        '" alt="" loading="lazy">' + ICON.play + '</div><div class="row-main">' +
        '<div class="video-title">' + esc(v.t) + '</div><div class="row-sub">' + esc(v.meta) + '</div></div></div>';
    }).join('') +
    '<div class="stack"><a class="btn btn-secondary btn-block" href="https://www.youtube.com/" target="_blank" rel="noopener">ไปยังช่อง YouTube</a></div>';
  };

  V.teacher = function () {
    return '<div class="teacher-hero"><img src="' + esc(TEACHER.photo) +
      '" alt="อาจารย์' + esc(TEACHER.name) + '" width="760" height="1047"></div>' +
      '<div style="padding:18px 16px;border-bottom:1px solid var(--gold-hair)">' +
      '<img src="logo.png" width="66" height="66" alt="ตราบรมครูโหร" style="border-radius:50%;margin-bottom:12px;box-shadow:0 0 0 1px var(--gold),0 0 0 4px color-mix(in srgb,var(--gold) 20%,var(--white))">' +
      '<h2 style="font-size:27px">พัฒนา พัฒนศิริ</h2>' +
      '<div class="row-sub">โหราจารย์ · ดูดวง ดูฤกษ์ ฮวงจุ้ย และพิธีมงคล</div>' +
      '<p style="margin:12px 0 0;font-size:14px;line-height:1.75">ด้วยประสบการณ์กว่า ๔๐ ปี ท่านอุทิศตนถ่ายทอดวิชาผ่านการสอนและงานเขียน หล่อหลอมความรู้และประสบการณ์สู่ลูกศิษย์และผู้สนใจ ตลอดจนวาระสุดท้าย</p></div>' +
      TEACHER.timeline.map(function (m) {
        return '<div class="row"><div class="row-main"><div class="row-title" style="font-size:15px">' +
          esc(m.k) + '</div><div class="row-sub">' + esc(m.t) + '</div></div></div>';
      }).join('') +
      /* The daughter who carries the practice on — published on เกี่ยวกับเรา. */
      '<div class="sec-title">ผู้สืบทอด</div>' +
      '<div style="padding:0 var(--s-5) var(--s-4)"><div class="row-title">' + esc(SUCCESSOR.name) + '</div>' +
      '<div class="row-sub">' + esc(SUCCESSOR.role) + '</div>' +
      '<p class="muted" style="margin:10px 0 0">' + esc(SUCCESSOR.bio) + '</p></div>' +
      SUCCESSOR.points.map(function (m) {
        return '<div class="row"><div class="row-main"><div class="row-title" style="font-size:15px">' +
          esc(m.k) + '</div><div class="row-sub">' + esc(m.t) + '</div></div></div>';
      }).join('') +
      '<div class="stack"><button class="btn btn-secondary btn-block" data-act="go" data-screen="videos">ดูคำสอนในวิดีโอ</button>' +
      '<button class="btn btn-primary btn-block" data-act="go" data-screen="courses">คอร์สที่สืบทอดตำรา</button></div>';
  };

  V.me = function () {
    var p = progress(), b = S.booking;
    var rows = [
      ['ดวงที่บันทึกไว้', '3 ดวง · ตัวเอง ครอบครัว', 'tab', 'chart', 'chart'],
      ['ฤกษ์ที่ติดตาม', '2 รายการในเดือนนี้', 'tab', 'ruek', 'calendar'],
      ['คอร์สของฉัน', 'พื้นฐานโหราศาสตร์ไทย ๑', 'go', 'courses'],
      ['นัดปรึกษา', b.done ? b.svc + ' · ' + b.slot : 'ยังไม่มีนัด', 'go', 'booking'],
      ['ประวัติอาจารย์พัฒนา', 'ที่มาของตำราที่ใช้สอน', 'go', 'teacher'],
      ['ติดต่อเรา', 'โทร 084 943 1133 · ไลน์ 0849431133', 'go', 'teacher']
    ];
    return '<div class="me-head"><div class="avatar">ศน</div><div><h3 style="font-size:19px">ศิษย์ใหม่</h3>' +
      '<div class="row-sub">' + esc(birthLine()) + '</div></div></div>' +
      '<div class="block"><div style="display:flex;justify-content:space-between;align-items:baseline">' +
      '<div class="block-title" style="margin:0">ความคืบหน้าบทเรียน</div><div class="num">' + p.pct + '</div></div>' +
      '<div class="progress" style="margin-top:10px"><span style="width:' + p.pct + '"></span></div>' +
      '<div class="chips-progress">' + LESSONS.map(function (l, i) {
        return '<button class="' + (S.done.indexOf(i) >= 0 ? 'done' : '') + '" data-act="lesson" data-i="' + i + '">' + esc(l.n) + '</button>';
      }).join('') + '</div></div>' +
      rows.map(function (r) {
        var attrs = r[2] === 'tab' ? ' data-act="tab" data-tab="' + r[3] + '" data-screen="' + r[4] + '"' : ' data-act="go" data-screen="' + r[3] + '"';
        return '<div class="row"' + attrs + '><div class="row-main"><div class="row-title" style="font-size:15px">' + esc(r[0]) + '</div>' +
          '<div class="row-sub">' + esc(r[1]) + '</div></div>' + ICON.chev + '</div>';
      }).join('') +
      '';
  };

  V.search = function () {
    var q = S.q.trim();
    var pool = LESSONS.map(function (l, i) { return { kind: 'บทเรียน ' + l.n, t: l.t, d: l.d, act: 'lesson', i: i }; })
      .concat(ARTICLES.map(function (a) { return { kind: 'บทความ', t: a.t, d: a.d, act: 'go', screen: 'articles' }; }))
      .concat(PLANETS.slice(0, 7).map(function (p) { return { kind: 'ดาวพระเคราะห์', t: p.name + ' (' + p.n + ')', d: 'เกษตร: ' + p.home, act: 'lesson', i: 1 }; }));
    var res = q ? pool.filter(function (r) { return (r.t + r.d + r.kind).indexOf(q) >= 0; }).slice(0, 12) : pool.slice(0, 6);
    return '<div class="block"><input class="input" data-bind="q" data-live="1" placeholder="ค้นหาบทเรียน ดาว ราศี ฤกษ์" value="' + esc(S.q) + '">' +
      '<div class="chips">' + ['ลัคนา', 'เกษตร', 'ภูมิทักษา', 'ราหู', 'ฤกษ์แต่งงาน'].map(function (t) {
        return '<span class="tag tag-outline chip" data-act="suggest" data-t="' + esc(t) + '">' + esc(t) + '</span>';
      }).join('') + '</div></div>' +
      res.map(function (r) {
        var attrs = r.act === 'lesson' ? ' data-act="lesson" data-i="' + r.i + '"' : ' data-act="go" data-screen="' + r.screen + '"';
        return '<div class="article"' + attrs + '><div class="card-kicker">' + esc(r.kind) + '</div>' +
          '<div class="row-title" style="font-size:15px;margin-top:4px">' + esc(r.t) + '</div>' +
          '<div class="row-sub">' + esc(r.d) + '</div></div>';
      }).join('') +
      '<div class="foot">' + res.length + ' รายการ</div>';
  };

  /* ── shell render ────────────────────────────────── */
  /* ── motion ──────────────────────────────────────── */
  var lastView = null, lastPct = null, replayChart = false;

  function reduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* Stagger the direct children so a view assembles rather than blinks. */
  function stagger(main) {
    var kids = main.children, n = Math.min(kids.length, 14);
    for (var i = 0; i < n; i++) kids[i].style.setProperty('--i', String(i));
  }

  /* Grow the bar from where it stood, so finishing a lesson reads as progress. */
  function tweenProgress(main, from) {
    main.querySelectorAll('.progress > span').forEach(function (sp) {
      var to = sp.style.width;
      if (!to || to === from) return;
      sp.style.width = from || '0%';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { sp.style.width = to; });
      });
    });
  }

  /* The circular chart draws its geometry, then the labels that sit on it. */
  function drawWheel(main) {
    var w = main.querySelector('.wheel');
    if (!w || reduced()) return;
    var shapes = w.querySelectorAll('svg circle, svg line');
    if (!shapes.length || typeof shapes[0].getTotalLength !== 'function') return;
    w.classList.add('is-drawing');
    shapes.forEach(function (el, i) {
      var len;
      try { len = el.getTotalLength(); } catch (e) { return; }
      if (!len) return;
      el.style.strokeDasharray = len;
      el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration: 620, delay: 80 + i * 38, easing: 'cubic-bezier(.3,.8,.4,1)', fill: 'both' });
    });
    var last = null;
    w.querySelectorAll('.wheel-label, .wheel-planet, .wheel-center').forEach(function (el, i) {
      last = el.animate(
        [{ opacity: 0, transform: 'translate(-50%,-50%) scale(.88)' },
         { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }],
        { duration: 300, delay: 430 + i * 20, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' });
    });
    if (last) last.finished.then(function () { w.classList.remove('is-drawing'); }, function () {});
  }

  /* The square chart has no strokes to draw, so its houses light up in turn. */
  function revealSquare(main) {
    var tk = main.querySelector('.tk');
    if (!tk || reduced()) return;
    tk.querySelectorAll('.tk-cell, .tk-center').forEach(function (el, i) {
      el.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: 260, delay: 40 + i * 32, easing: 'ease-out', fill: 'both' });
    });
  }

  function render() {
    var head = HEADS[S.screen] || HEADS.home;
    if (S.screen === 'reader') head = ['บทที่ ' + LESSONS[S.lesson].n, LESSONS[S.lesson].t];
    var html = '<div class="app"><header class="app-header">' +
      (S.stack.length ? '<button class="icon-btn back" data-act="back" aria-label="ย้อนกลับ">' + ICON.back + '</button>' :
        '<img class="app-logo" src="logo.png" width="40" height="40" alt="ตราบรมครูโหร" data-act="tab" data-tab="home" data-screen="home">') +
      '<div class="head"><div class="kicker">' + esc(head[0]) + '</div><h1 class="app-title">' + esc(head[1]) + '</h1></div>' +
      '<button class="icon-btn" data-act="go" data-screen="search" aria-label="ค้นหา">' + ICON.search + '</button></header>' +
      '<main class="app-main">' + (V[S.screen] || V.home)() + siteFooter() + '</main>' +
      '<nav class="tabs">' + TABS.map(function (t) {
        return '<button class="tab" ' + (S.tab === t[0] ? 'aria-current="page" ' : '') +
          'data-act="tab" data-tab="' + t[0] + '" data-screen="' + t[2] + '"><span class="dot"></span>' + t[1] + '</button>';
      }).join('') + '</nav>' + lineFab() + '</div>';
    var root = document.getElementById('app');
    var scroll = root.querySelector('.app-main');
    var y = scroll ? scroll.scrollTop : 0;
    var keep = S.screen === 'search' && document.activeElement && document.activeElement.dataset.bind === 'q';
    /* Re-rendering the same view in place (ticking a lesson, picking a slot)
       keeps its scroll position; moving to a new view starts at the top. */
    var view = S.screen + (S.screen === 'reader' ? '/' + S.lesson : '');
    var sameView = view === lastView;
    var oldBar = root.querySelector('.progress > span');
    var fromPct = oldBar ? oldBar.style.width : lastPct;
    root.innerHTML = html;
    var m = root.querySelector('.app-main');
    if (m && sameView) m.scrollTop = y;
    if (keep) {
      var el = root.querySelector('[data-bind="q"]');
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    }
    /* Record the target before tweenProgress rewinds the bar to its start. */
    var bar = root.querySelector('.progress > span');
    if (bar) lastPct = bar.style.width;
    if (m) {
      if (!sameView) {
        m.classList.add('nav-' + navDir);
        stagger(m);
        var hd = root.querySelector('.app-header .head');
        if (hd) hd.classList.add('is-new');
      }
      tweenProgress(m, fromPct);
      if (!sameView || replayChart) { drawWheel(m); revealSquare(m); }
    }
    replayChart = false;
    navDir = 'tab';
    lastView = view;
    wireMarquee(root);
    save();
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.dataset.act;
    if (act === 'back') return back();
    if (act === 'go') return go(el.dataset.screen);
    if (act === 'tab') return pickTab(el.dataset.tab, el.dataset.screen);
    if (act === 'lesson') return openLesson(+el.dataset.i);
    if (act === 'done') {
      if (S.done.indexOf(S.lesson) < 0) S.done.push(S.lesson);
      return render();
    }
    /* Switching chart style re-renders the same view, so the draw has to be
       asked for explicitly or the new chart would just appear. */
    if (act === 'cstyle') { S.chartStyle = el.dataset.t; replayChart = true; return render(); }
    if (act === 'cast') { replayChart = true; S.chartDone = true; return render(); }
    if (act === 'calday') { S.calDay = +el.dataset.d; return render(); }
    if (act === 'svc') { S.booking.svc = el.dataset.t; return render(); }
    if (act === 'slot') { S.booking.slot = el.dataset.t; return render(); }
    if (act === 'confirm') { S.booking.done = true; return render(); }
    if (act === 'rebook') { S.booking.done = false; S.booking.slot = null; return render(); }
    if (act === 'suggest') { S.q = el.dataset.t; return render(); }
  });

  function bindValue(e) {
    var el = e.target.closest && e.target.closest('[data-bind]');
    if (!el) return;
    var path = el.dataset.bind.split('.');
    var v = el.dataset.num ? +el.value : el.value;
    if (path.length === 1) S[path[0]] = v; else S[path[0]][path[1]] = v;
    if (el.dataset.live) render(); else save();
  }
  document.addEventListener('input', bindValue);
  /* Selects report through `change` on some engines even when `input` is missed. */
  document.addEventListener('change', bindValue);

  render();
})();
