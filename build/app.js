/* Hora Patana webapp — vanilla JS. Data lives in data.js (window.HP_DATA). */
(function () {
  var D = window.HP_DATA;
  var CONTACT = D.CONTACT, STATS = D.STATS, TESTIMONIALS = D.TESTIMONIALS,
    HONOURS = D.HONOURS, TEACHER = D.TEACHER, SUCCESSOR = D.SUCCESSOR, MEDIA = D.MEDIA,
    INTRO = D.INTRO;
  var MONTHS = D.MONTHS, DAY_COLOR = D.DAY_COLOR, PROVINCES = D.PROVINCES,
    ZODIAC = D.ZODIAC, ART = D.ZODIAC_ART || {};
  var RASI = D.RASI, PLACE = D.PLACE, LESSONS = D.LESSONS, PLANETS = D.PLANETS,
    COURSES = D.COURSES, ARTICLES = D.ARTICLES, VIDEOS = D.VIDEOS,
    SERVICES = D.SERVICES;
  var RUEK_RULES = D.RUEK_RULES, SLOT_TIMES = D.SLOT_TIMES,
    DOW_NAMES = D.DOW_NAMES, DOW_SHORT = D.DOW_SHORT,
    MONTH_NAMES_FULL = D.MONTH_NAMES_FULL, SUN_RASI = D.SUN_RASI;

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

  var MILESTONES = [
    { y: '๒๕๒๖', t: 'เริ่มรับพยากรณ์และวางฤกษ์ให้ครอบครัวและผู้สนใจ' },
    { y: '๒๕๓๕', t: 'เปิดชั้นเรียนโหราศาสตร์ไทยรุ่นแรก' },
    { y: '๒๕๔๘', t: 'เรียบเรียงตำราราศีเกณฑ์สำหรับผู้เรียนรุ่นใหม่' },
    { y: '๒๕๖๕', t: 'ถ่ายทอดคำสอนผ่านช่อง YouTube ให้ศิษย์ทั่วประเทศ' }
  ];

  /* ── Dynamic date helpers ──────────────────────────── */
  /* Approximate sun rasi from date — not ephemeris-accurate but good for UI. */
  function getSunRasi(dt) {
    var m = dt.getMonth(), d = dt.getDate();
    var entry = SUN_RASI[m];
    if (d >= entry[0]) return RASI[entry[1]];
    var prev = m === 0 ? 11 : m - 1;
    return RASI[SUN_RASI[prev][1]];
  }

  /* Format date as Thai string: "จ. 25 ส.ค. 2569" */
  function thaiDateLabel(dt) {
    var dow = DOW_SHORT[dt.getDay()];
    var d = dt.getDate();
    var m = MONTHS[dt.getMonth()];
    var y = dt.getFullYear() + 543;
    return dow + ' ' + d + ' ' + m + ' ' + y;
  }

  /* Full month label for calendar header: "สิงหาคม 2569" */
  function thaiMonthYear(month, year) {
    return MONTH_NAMES_FULL[month] + ' ' + (year + 543);
  }

  /* Check if a day-of-week is good or to be avoided. */
  function isDowGood(dow) { return RUEK_RULES.goodDow.indexOf(dow) >= 0; }
  function isDowAvoid(dow) { return RUEK_RULES.avoidDow.indexOf(dow) >= 0; }

  /* Classify a date's fortune level. */
  function dayFortune(dt) {
    var dow = dt.getDay();
    if (isDowGood(dow)) return 'good';
    if (isDowAvoid(dow)) return 'avoid';
    return 'neutral';
  }

  /* Ruek level text based on day of week. */
  function ruekLabel(dt) {
    var dow = dt.getDay();
    if (isDowGood(dow)) return 'ฤกษ์ดี เหมาะเจรจา ทำบุญ';
    if (isDowAvoid(dow)) return 'ฤกษ์กลาง ควรระวัง';
    return 'ฤกษ์กลาง ทำกิจทั่วไปได้';
  }

  var DAY_FORTUNE_DATA = [
    { goodColor: 'สีแดง, สีเขียว', avoidColor: 'สีน้ำเงิน', energyPct: '๘๘%' }, // อาทิตย์
    { goodColor: 'สีเหลือง, สีม่วง', avoidColor: 'สีแดง', energyPct: '๙๒%' }, // จันทร์
    { goodColor: 'สีชมพู, สีส้ม', avoidColor: 'สีขาว', energyPct: '๘๕%' }, // อังคาร
    { goodColor: 'สีเขียว, สีทอง', avoidColor: 'สีชมพู', energyPct: '๙๕%' }, // พุธ
    { goodColor: 'สีส้ม, สีฟ้า', avoidColor: 'สีดำ', energyPct: '๙๔%' }, // พฤหัส
    { goodColor: 'สีฟ้า, สีขาว', avoidColor: 'สีเทา', energyPct: '๙๐%' }, // ศุกร์
    { goodColor: 'สีม่วง, สีดำ', avoidColor: 'สีเขียว', energyPct: '๘๖%' }  // เสาร์
  ];

  /* Build TODAY object dynamically from current date. */
  function buildToday() {
    var now = new Date();
    var rasi = getSunRasi(now);
    var dow = now.getDay();
    var dowName = DOW_NAMES[dow];
    var fd = DAY_FORTUNE_DATA[dow] || { goodColor: 'สีเหลืองทอง', avoidColor: 'สีกาลกิณี', energyPct: '๙๐%' };
    var isGood = isDowGood(dow);
    var isAvoid = isDowAvoid(dow);
    var score = isGood ? '๙๕%' : (isAvoid ? '๖๘%' : fd.energyPct);
    return {
      label: thaiDateLabel(now),
      dowName: dowName,
      rasi: rasi,
      rasiFull: dowName + 'ราศี' + rasi,
      ruek: ruekLabel(now),
      score: score,
      goodColor: fd.goodColor,
      avoidColor: fd.avoidColor,
      note: 'ราศี' + rasi + ' · ' + dowName + ' · ' + (isGood
        ? 'วันนี้เหมาะแก่การเจรจา ตกลง และเริ่มเรียนวิชาใหม่'
        : (isAvoid
          ? 'วันนี้ควรงดเจรจาสำคัญ เน้นทบทวนความรู้และพักผ่อน'
          : 'วันนี้เป็นฤกษ์กลาง ทำกิจทั่วไปได้ดี'))
    };
  }
  var TODAY = buildToday();

  /* Build GOOD_DAYS and AVOID_DAYS for a given month/year. */
  function buildMonthDays(month, year) {
    var dim = new Date(year, month + 1, 0).getDate();
    var good = [], avoid = [];
    for (var d = 1; d <= dim; d++) {
      var dt = new Date(year, month, d);
      if (isDowGood(dt.getDay())) good.push(d);
      if (isDowAvoid(dt.getDay())) avoid.push(d);
    }
    return { good: good, avoid: avoid };
  }

  /* Build featured RUEK for a given month/year. */
  function buildRuek(month, year) {
    var dim = new Date(year, month + 1, 0).getDate();
    var out = [];
    for (var d = 1; d <= dim && out.length < 4; d++) {
      var dt = new Date(year, month, d);
      var dow = dt.getDay();
      for (var ri = 0; ri < RUEK_RULES.ruekTypes.length; ri++) {
        if (RUEK_RULES.ruekTypes[ri].dow === dow) {
          out.push({ day: String(d), t: RUEK_RULES.ruekTypes[ri].t, d: RUEK_RULES.ruekTypes[ri].d, time: RUEK_RULES.ruekTypes[ri].time });
          break;
        }
      }
    }
    return out;
  }

  /* Build booking SLOTS from next 7 days. */
  function buildSlots() {
    var out = [], now = new Date();
    for (var i = 1; i <= 10 && out.length < 6; i++) {
      var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      var fortune = dayFortune(dt);
      var rasi = getSunRasi(dt);
      var tmpl = SLOT_TIMES[out.length % SLOT_TIMES.length];
      var label = DOW_SHORT[dt.getDay()] + ' ' + dt.getDate() + ' ' + MONTHS[dt.getMonth()] + ' ' + pad2(tmpl.hh) + ':' + pad2(tmpl.mm);
      var note = tmpl.note + (fortune === 'good' ? ' · ราศี' + rasi : '');
      out.push({ label: label, note: note });
    }
    return out;
  }
  var HEADS = {
    home: ['โหรพัฒนา', 'เรียนดวงกับบรมครูโหรพัฒนา พัฒนศิริ'],
    lessons: ['บทเรียน', 'ตำราโหราศาสตร์ไทย ๙ บท'],
    chart: ['ผูกดวง', 'คำนวณแผนภูมิดวงชะตา'],
    calendar: ['ฤกษ์มงคล', 'ปฏิทินฤกษ์ประจำวัน'],
    courses: ['หลักสูตร', 'คอร์สเรียนโหราศาสตร์ Onsite'],
    booking: ['บริการ', 'นัดหมายปรึกษาดวงชะตา'],
    articles: ['คลังความรู้', 'บทความและเกร็ดโหราศาสตร์'],
    videos: ['คำสอน', 'วิดีโอถ่ายทอดวิชา'],
    teacher: ['ประวัติครู', 'บรมครูโหรพัฒนา พัฒนศิริ'],
    me: ['ความคืบหน้า', 'บันทึกการเรียนและดวงชะตา'],
    search: ['ค้นหา', 'ค้นหาตำรา ดาว ราศี และบทความ'],
    artadmin: ['ระบบหลังบ้าน', 'จัดการบทความ']
  };
  var TABS_DEFAULT = [
    ['home', 'หน้าแรก', 'home'],
    ['lessons', 'บทเรียน ๙ บท', 'lessons'],
    ['articles', 'คลังบทความ', 'articles'],
    ['chart', 'ผูกดวงชะตา', 'chart'],
    ['ruek', 'ปฏิทินฤกษ์', 'calendar'],
    ['courses', 'คอร์สเรียน', 'courses'],
    ['teacher', 'ประวัติครู', 'teacher'],
    ['me', 'ความคืบหน้า', 'me']
  ];
  var ICON = {
    back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>',
    search: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    play: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l14 8-14 8V4z"/></svg>',
    playSolid: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8V4z"/></svg>',
    pause: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
    speaker: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    headphones: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
    chev: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"><path d="M9 6l6 6-6 6"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>',
    edit: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
    code: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>',
    gear: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
    lock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
    chart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
    calendar: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="12" cy="15" r="2"/></svg>',
    scripture: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><path d="M8 7h8M8 11h6"/></svg>',
    wisdom: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l2.4 5 5.6.8-4 4 1 5.5-5-2.8-5 2.8 1-5.5-4-4 5.6-.8z"/></svg>',
    sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
    candle: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21h6M10 21V10h4v11M12 3c-1.5 2-1.5 3.5 0 5 1.5-1.5 1.5-3 0-5z"/></svg>',
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/></svg>',
    planet: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="6"/><ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-25 12 12)"/></svg>',
    school: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    pin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    chat: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    phone: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    bookOpen: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    folder: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>'
  };

  var HOME = (new URLSearchParams(location.search).get('home')) || 'index';
  var IS_ADMIN_PARAM = (new URLSearchParams(location.search).get('admin')) === '1';
  var SAVED = {};
  try { SAVED = JSON.parse(localStorage.getItem('hp.state') || '{}') || {}; } catch (e) { SAVED = {}; }

  var ADMIN_PASS = '1234'; // รหัสผ่านตั้งต้นสำหรับเข้าหลังบ้าน
  var isAdminAuth = sessionStorage.getItem('hp.is_admin') === 'true' || IS_ADMIN_PARAM;

  /* Load customized articles from localStorage if stored, else use data.js defaults */
  var storedArticles = null;
  try { storedArticles = JSON.parse(localStorage.getItem('hp.articles')); } catch (e) { storedArticles = null; }
  var ALL_ARTICLES = Array.isArray(storedArticles) && storedArticles.length ? storedArticles : (ARTICLES || []);

  function updateJsonLd() {
    try {
      var el = document.getElementById('hp-jsonld');
      if (!el) {
        el = document.createElement('script');
        el.id = 'hp-jsonld';
        el.type = 'application/ld+json';
        document.head.appendChild(el);
      }
      var courseElements = (COURSES || []).map(function (c) {
        return {
          '@type': 'Course',
          'name': c.t,
          'description': c.body,
          'provider': { '@type': 'EducationalOrganization', 'name': 'สถาบันโหรพัฒนา' }
        };
      });
      var articleElements = (ALL_ARTICLES || []).slice(0, 10).map(function (a) {
        return {
          '@type': 'Article',
          'headline': a.t,
          'description': a.d,
          'author': { '@type': 'Person', 'name': a.author || 'บรมครูโหรพัฒนา พัฒนศิริ' }
        };
      });
      var data = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        'name': 'สถาบันโหรพัฒนา',
        'alternateName': 'Hora Patana',
        'url': 'https://horapatana.com',
        'logo': 'https://horapatana.com/logo.png',
        'description': (INTRO && INTRO.teacher) || 'สถาบันโหราศาสตร์ไทย โดยบรมครูโหรพัฒนา พัฒนศิริ เรียนรู้ศาสตร์การผูกดวงชะตา ดูฤกษ์ ฮวงจุ้ย พิธีมงคล',
        'founder': {
          '@type': 'Person',
          'name': (TEACHER && TEACHER.name) || 'พัฒนา พัฒนศิริ',
          'jobTitle': 'โหราจารย์ · บรมครูโหร'
        },
        'telephone': (CONTACT && CONTACT.tel) ? ('+66' + CONTACT.tel.replace(/^0/, '').replace(/\s+/g, '')) : '+66849431133',
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'TH'
        },
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'คอร์สเรียนโหราศาสตร์ไทย',
          'itemListElement': courseElements
        }
      };
      if (articleElements.length) {
        data['subjectOf'] = articleElements;
      }
      el.textContent = JSON.stringify(data, null, 2);
    } catch (e) { }
  }

  function saveArticles() {
    try { localStorage.setItem('hp.articles', JSON.stringify(ALL_ARTICLES)); } catch (e) { }
    updateJsonLd();
  }
  updateJsonLd();


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

  /* Calendar starts at the current month; calMonth/calYear track navigation. */
  var NOW_DATE = new Date();
  var S = Object.assign({
    tab: 'home', screen: 'home', stack: [], lesson: 1, done: [0], chartDone: true, chartStyle: 'thai',
    birth: Object.assign({}, BIRTH_DEFAULT),
    calDay: NOW_DATE.getDate(), calMonth: NOW_DATE.getMonth(), calYear: NOW_DATE.getFullYear(),
    q: '', booking: { svc: 'ดูดวงพื้นชะตา', slot: null, name: '', note: '', done: false },
    artCat: 'ทั้งหมด', activeArticleId: null,
    editingArticle: null, showExportCode: false, showAdminLogin: false,
    fontSize: 'normal', // 'normal', 'md', 'lg'
    theme: 'midnight' // 'midnight', 'candle', 'sand'
  }, SAVED);
  /* Ensure calMonth/calYear exist even if SAVED is from old version */
  if (typeof S.calMonth !== 'number') S.calMonth = NOW_DATE.getMonth();
  if (typeof S.calYear !== 'number') S.calYear = NOW_DATE.getFullYear();
  if (!S.theme) S.theme = S.candleMode ? 'candle' : 'midnight';
  S.birth = migrateBirth(S.birth);

  function applyFontSize() {
    var cl = document.documentElement.classList;
    cl.remove('font-md', 'font-lg');
    if (S.fontSize === 'md') cl.add('font-md');
    if (S.fontSize === 'lg') cl.add('font-lg');
  }
  function applyTheme() {
    var cl = document.documentElement.classList;
    cl.remove('mode-midnight', 'mode-candle', 'mode-sand');
    var t = S.theme || 'midnight';
    cl.add('mode-' + t);
  }
  applyFontSize();
  applyTheme();

  function save() {
    try { localStorage.setItem('hp.state', JSON.stringify(S)); } catch (e) { }
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function tabOf(screen) {
    if (screen === 'home') return 'home';
    if (screen === 'lessons' || screen === 'reader') return 'lessons';
    if (screen === 'articles') return 'articles';
    if (screen === 'artadmin') return isAdminAuth ? 'artadmin' : 'articles';
    if (screen === 'chart') return 'chart';
    if (screen === 'calendar' || screen === 'booking') return 'ruek';
    if (screen === 'courses') return 'courses';
    if (screen === 'teacher') return 'teacher';
    if (screen === 'me') return 'me';
    return 'home';
  }

  function detectScreen() {
    var dataPage = document.body && document.body.dataset && document.body.dataset.page;
    if (dataPage) return dataPage;
    var p = (location.pathname || '').toLowerCase();
    if (p.indexOf('lessons') >= 0) return 'lessons';
    if (p.indexOf('articles') >= 0) return 'articles';
    if (p.indexOf('chart') >= 0) return 'chart';
    if (p.indexOf('ruek') >= 0 || p.indexOf('calendar') >= 0) return 'calendar';
    if (p.indexOf('courses') >= 0) return 'courses';
    if (p.indexOf('teacher') >= 0) return 'teacher';
    if (p.indexOf('me') >= 0) return 'me';
    var qParam = (new URLSearchParams(location.search).get('screen')) || (new URLSearchParams(location.search).get('page'));
    if (qParam) return qParam;
    return 'home';
  }

  /* Detect screen from page attribute, pathname, or URL query param */
  var initialScreen = detectScreen();
  S.screen = initialScreen;
  S.tab = tabOf(initialScreen);
  S.stack = [];
  S.activeArticleId = null;
  S.showAdminLogin = false;
  S.editingArticle = null;
  var navDir = 'tab';
  var lastFocusedElement = null;

  function go(screen) {
    if (S.screen !== screen) S.stack.push(S.screen);
    navDir = 'fwd'; S.screen = screen; S.tab = tabOf(screen); render();
  }
  function back() {
    if (S.stack.length > 0) {
      navDir = 'back'; S.screen = S.stack.pop(); S.tab = tabOf(S.screen); render();
    } else if (S.screen !== 'home') {
      if (document.referrer && document.referrer.indexOf(location.host) >= 0) {
        history.back();
      } else {
        location.href = 'index.html';
      }
    }
  }
  function pickTab(tab, screen) { navDir = 'tab'; S.tab = tab; S.screen = screen; S.stack = []; render(); }
  
  function openLesson(i) {
    lastFocusedElement = document.activeElement;
    S.lesson = i;
    go('reader');
  }

  function openArticle(id) {
    lastFocusedElement = document.activeElement;
    S.activeArticleId = id;
    render();
    setTimeout(function () {
      var closeBtn = document.querySelector('.art-modal-close');
      if (closeBtn) closeBtn.focus();
    }, 60);
  }

  function closeArticleModal() {
    S.activeArticleId = null;
    stopTts();
    render();
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function openAdminLogin() {
    lastFocusedElement = document.activeElement;
    S.showAdminLogin = true;
    render();
    setTimeout(function () {
      var pinInput = document.getElementById('admin-pin-input');
      if (pinInput) pinInput.focus();
    }, 60);
  }

  function closeAdminLogin() {
    S.showAdminLogin = false;
    render();
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  /* ── Toast Notification System ──────────────────── */
  function showToast(msg) {
    var old = document.querySelector('.hp-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'hp-toast';
    t.innerHTML = '<span class="toast-icon">' + ICON.star + '</span><span>' + esc(msg) + '</span>';
    document.body.appendChild(t);
    setTimeout(function () { if (t && t.parentNode) t.parentNode.removeChild(t); }, 2800);
  }

  /* ── Text-to-Speech (TTS) Voice Narration Engine ── */
  var ttsState = { isSpeaking: false, rate: 1.0, activeScope: null };
  function getTtsText(scope) {
    if (scope === 'reader') {
      var l = LESSONS[S.lesson];
      if (!l) return '';
      var text = 'บทเรียนที่ ' + l.n + ' เรื่อง ' + l.t + ' ... ' + l.d + ' ... ';
      (l.secs || []).forEach(function (s) { text += s.h + ' ... ' + s.p + ' ... '; });
      return text;
    }
    if (scope === 'article') {
      var a = ALL_ARTICLES.filter(function (x) { return x.id === S.activeArticleId; })[0];
      if (!a) return '';
      var text = a.t + ' ... ' + (a.d || '') + ' ... ';
      (a.secs || []).forEach(function (s) { text += (s.h || '') + ' ... ' + (s.p || '') + ' ... '; });
      return text;
    }
    return '';
  }

  function toggleTts(scope) {
    if (!('speechSynthesis' in window)) {
      showToast('เบราว์เซอร์นี้ยังไม่รองรับระบบอ่านเสียง');
      return;
    }
    if (ttsState.isSpeaking && ttsState.activeScope === scope) {
      stopTts();
      render();
    } else {
      startTts(scope);
      render();
    }
  }

  function startTts(scope) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var text = getTtsText(scope);
    if (!text) return;
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'th-TH';
    utter.rate = ttsState.rate;
    utter.pitch = 1.0;
    var voices = window.speechSynthesis.getVoices() || [];
    var thaiVoice = voices.find(function (v) { return v.lang === 'th-TH' || (v.lang && v.lang.startsWith('th')); });
    if (thaiVoice) utter.voice = thaiVoice;

    utter.onstart = function () {
      ttsState.isSpeaking = true;
      ttsState.activeScope = scope;
    };
    utter.onend = function () {
      ttsState.isSpeaking = false;
      ttsState.activeScope = null;
      render();
    };
    utter.onerror = function () {
      ttsState.isSpeaking = false;
      ttsState.activeScope = null;
      render();
    };
    ttsState.isSpeaking = true;
    ttsState.activeScope = scope;
    window.speechSynthesis.speak(utter);
  }

  function stopTts() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    ttsState.isSpeaking = false;
    ttsState.activeScope = null;
  }

  function setTtsSpeed(speed, scope) {
    ttsState.rate = +speed || 1.0;
    if (ttsState.isSpeaking) {
      startTts(scope || ttsState.activeScope);
    }
    render();
  }

  /* ── Screen Reader Live Announcer (WCAG 4.1.3) ── */
  var lastModalTrigger = null;
  function announce(msg) {
    var el = document.getElementById('a11y-announcer');
    if (!el) {
      el = document.createElement('div');
      el.id = 'a11y-announcer';
      el.className = 'sr-only';
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      document.body.appendChild(el);
    }
    el.textContent = '';
    setTimeout(function () { el.textContent = msg; }, 50);
  }

  function openArticle(id) {
    lastModalTrigger = document.activeElement;
    S.activeArticleId = id;
    render();
    setTimeout(function () {
      var closeBtn = document.querySelector('.art-modal-close');
      if (closeBtn) closeBtn.focus();
    }, 60);
  }
  function closeArticleModal() {
    S.activeArticleId = null;
    render();
    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
      lastModalTrigger.focus();
    }
  }

  function openAdminLogin() {
    lastModalTrigger = document.activeElement;
    S.showAdminLogin = true;
    render();
    setTimeout(function () {
      var pinInput = document.getElementById('admin-pin-input');
      if (pinInput) pinInput.focus();
    }, 60);
  }
  function closeAdminLogin() {
    S.showAdminLogin = false;
    render();
    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
      lastModalTrigger.focus();
    }
  }

  /* ── Planet & House Inspector Detail Sheet ───────── */
  var inspectingPlanet = null;
  function openPlanetDetail(idx) {
    lastModalTrigger = document.activeElement;
    var row = CHART_ROWS[idx];
    if (!row) return;
    var pNo = planetNo(String(row.p).charAt(0));
    var pObj = PLANETS.filter(function (x) { return x.n === String(row.p).charAt(0); })[0];
    var houseMeanings = {
      'ตนุ': 'ภพที่ ๑ · ตัวตน สุขภาพ วาสนา บุคลิกภาพ และจุดเริ่มต้นของชีวิต',
      'กดุมภะ': 'ภพที่ ๒ · ทรัพย์สิน รายได้ การเงิน และความมั่งคั่ง',
      'สหัชชะ': 'ภพที่ ๓ · พี่น้อง เพื่อนฝูง สังคม การติดต่อสื่อสารและการเดินทางใกล้',
      'พันธุ': 'ภพที่ ๔ · ญาติผู้ใหญ่ ครอบครัว บ้าน ที่อยู่อาศัย และรากฐานชีวิต',
      'ปุตตะ': 'ภพที่ ๕ · บุตร บริวาร ความคิดสร้างสรรค์ โชคลาภ และความสุข',
      'อริ': 'ภพที่ ๖ · อุปสรรค ศัตรู ปัญหา และการต่อสู้ฟันฝ่า',
      'ปัตนิ': 'ภพที่ ๗ · คู่ครอง หุ้นส่วน คู่สัญญา และความสัมพันธ์',
      'มรณะ': 'ภพที่ ๘ · ความเสื่อม การพลัดพราก มรดก และสิ่งลี้ลับ',
      'ศุภะ': 'ภพที่ ๙ · บุญกุศล ความเจริญ ความสำเร็จ การศึกษาชั้นสูง และการเดินทางไกล',
      'ทสมะ': 'ภพที่ ๑๐ · การงาน เกียรติยศ ชื่อเสียง และตำแหน่งหน้าที่',
      'ลาภะ': 'ภพที่ ๑๑ · โชคลาภ ลาภผล มิตรภาพ และความสำเร็จอันพึงได้',
      'วินาศ': 'ภพที่ ๑๒ · ความสูญเสีย สิ่งเร้นลับ ความสันโดษ และการสิ้นสุด'
    };
    var stdMeanings = {
      'เกษตร': 'ตำแหน่งที่ดาวสถิตในเรือนของตนเอง มีความมั่นคง เข้มแข็ง และให้คุณสม่ำเสมอ',
      'อุจจ์': 'ตำแหน่งสูงสุดของดาว ทรงพลัง อำนาจ และความรุ่งโรจน์อย่างยิ่งยวด',
      'นิจจ์': 'ตำแหน่งตกต่ำ อ่อนกำลัง ควรระมัดระวังและใช้สติกำกับ',
      'ราชาโชค': 'ตำแหน่งให้คุณด้านเสน่ห์ ความนิยม และผู้อุปถัมภ์ค้ำชู',
      'ปกติ': 'ดาวสถิตอยู่ในระดับมาตรฐาน ให้ผลตามธรรมชาติของดาวและเรือน'
    };
    inspectingPlanet = {
      idx: idx,
      row: row,
      pNo: pNo,
      homeRasi: pObj ? pObj.home : '—',
      houseDesc: houseMeanings[row.house] || 'เรือนภพแห่งชะตาชีวิต',
      stdDesc: stdMeanings[row.std] || 'ตำแหน่งมาตรฐานของดวงดาว'
    };
    render();
    setTimeout(function () {
      var closeBtn = document.querySelector('.sheet-close');
      if (closeBtn) closeBtn.focus();
    }, 60);
  }
  function closePlanetDetail() {
    inspectingPlanet = null;
    render();
    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
      lastModalTrigger.focus();
    }
  }

  function planetInspectorSheet() {
    if (!inspectingPlanet) return '';
    var ip = inspectingPlanet, r = ip.row;
    var color = DAY_COLOR[ip.pNo] || 'var(--gold-deep)';
    return '<div class="sheet-overlay" data-act="close-planet-bg">' +
      '<div class="sheet-card" role="dialog" aria-modal="true" aria-labelledby="sheet-title-planet">' +
      '<button class="sheet-close" data-act="close-planet" aria-label="ปิดหน้าต่างวิเคราะห์ดาว">' + ICON.close + '</button>' +
      '<div class="sheet-badge">' + ICON.planet + ' <span>วิเคราะห์ดาวพระเคราะห์ตามตำรา</span></div>' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">' +
      '<span style="width:16px;height:16px;border-radius:50%;background:' + color + ';display:inline-block"></span>' +
      '<h2 id="sheet-title-planet" class="sheet-title" style="font-size:23px;margin:0">ดาว ' + esc(r.p) + '</h2></div>' +
      '<div class="sheet-sub">สถิตราศี <b>' + esc(r.rasi) + '</b> · ครองภพ <b>' + esc(r.house) + '</b> · มาตรฐาน <b>' + esc(r.std) + '</b></div>' +
      '<div class="sheet-grid">' +
      '<div class="sheet-stat"><div class="sheet-stat-label">เรือนเกษตรดั้งเดิม</div><div class="sheet-stat-val">' + esc(ip.homeRasi) + '</div></div>' +
      '<div class="sheet-stat"><div class="sheet-stat-label">มาตรฐานดาว</div><div class="sheet-stat-val">' + esc(r.std) + '</div></div>' +
      '</div>' +
      '<div class="sheet-desc"><b>ความหมายภพ' + esc(r.house) + ':</b> ' + esc(ip.houseDesc) + '</div>' +
      '<div class="sheet-desc" style="margin-top:-8px"><b>ความหมายตำแหน่ง' + esc(r.std) + ':</b> ' + esc(ip.stdDesc) + '</div>' +
      '<div style="display:flex;gap:10px;margin-top:16px">' +
      '<button class="btn btn-primary btn-block" data-act="lesson" data-i="3">ศึกษาตำราดาวมาตรฐาน (บทที่ ๔)</button>' +
      '<button class="btn btn-secondary" data-act="close-planet">ปิด</button>' +
      '</div></div></div>';
  }

  /* ── Auspicious Calendar Daily Summary Copy ─────── */
  function copyDayRuek(dayNum) {
    var cm = S.calMonth, cy = S.calYear;
    var dt = new Date(cy, cm, dayNum);
    var dowName = DOW_NAMES[dt.getDay()];
    var rasi = getSunRasi(dt);
    var ruek = ruekLabel(dt);
    var fortune = dayFortune(dt);
    var text = 'ฤกษ์มงคล · สถาบันโหรพัฒนา\n' +
      'วัน' + dowName + 'ที่ ' + dayNum + ' ' + MONTHS[cm] + ' ' + (cy + 543) + '\n' +
      'ฤกษ์: ' + ruek + '\n' +
      'สถิตราศี: ' + rasi + ' (' + (fortune === 'good' ? 'ฤกษ์ดี เหมาะเจรจา ทำบุญ' : (fortune === 'avoid' ? 'ควรระวัง งดการสำคัญ' : 'ฤกษ์กลาง ทำกิจทั่วไป')) + ')\n' +
      'ศึกษาตำราบรมครู: https://horapatana.com';
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('คัดลอกสรุปฤกษ์แล้ว นำไปส่งต่อใน LINE ได้ทันที');
      }).catch(function () {
        showToast('คัดลอกข้อมูลเรียบร้อย');
      });
    } else {
      showToast('คัดลอกข้อมูลเรียบร้อย');
    }
  }

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
    var elClass = z.el === 'ไฟ' ? 'el-fire' : (z.el === 'ดิน' ? 'el-earth' : (z.el === 'ลม' ? 'el-air' : 'el-water'));
    return '<figure class="mq-item' + (dup ? ' mq-dup' : '') + '"' + (dup ? ' aria-hidden="true"' : ' role="button" tabindex="0" aria-label="ศึกษาบทเรียน ราศี' + esc(z.name) + ' ธาตุ' + esc(z.el) + '"') +
      ' data-act="lesson" data-i="0" title="ราศี' + esc(z.name) + ' · ธาตุ' + esc(z.el) + '">' +
      '<span class="mq-thumb"><img class="mq-img" src="' + esc(artSrc(z.slug)) +
      '" alt="ภาพราศี' + esc(z.name) + '"' + (dup ? ' aria-hidden="true"' : '') + '>' +
      (!dup ? '<span class="zodiac-el-badge ' + elClass + '">ธาตุ' + esc(z.el) + '</span>' : '') +
      '</span></figure>';
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
  var imageObserver = null;
  function initLazyImages(root) {
    var imgs = (root || document).querySelectorAll('img[loading="lazy"], img.mq-img, .row-thumb img, .hero-portrait img, .art-thumb img, .video-thumb img, .teacher-hero img');
    if (!imgs.length) return;

    var markLoaded = function (img) {
      if (img.naturalWidth > 0 || img.complete) {
        img.classList.add('is-loaded');
      } else {
        img.addEventListener('load', function () { img.classList.add('is-loaded'); }, { once: true });
      }
    };

    if ('IntersectionObserver' in window) {
      if (!imageObserver) {
        imageObserver = new IntersectionObserver(function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var img = entry.target;
              if (img.dataset && img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              markLoaded(img);
              observer.unobserve(img);
            }
          });
        }, { rootMargin: '100px 0px' });
      }
      imgs.forEach(function (img) {
        if (!img.classList.contains('is-loaded')) {
          markLoaded(img);
          imageObserver.observe(img);
        }
      });
    } else {
      imgs.forEach(markLoaded);
    }
  }

  function wireMarquee(root) {
    var mq = root.querySelector('.marquee');
    if (!mq) return;
    initLazyImages(mq);
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
  var TK_CELL = [[1, 2], [1, 3], [1, 4], [2, 4], [3, 4], [4, 4], [4, 3], [4, 2], [4, 1], [3, 1], [2, 1], [1, 1]];
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
    var cx = 170, cy = 170, R = 156, Rin = 115, Rlab = 135, Rp = 75;
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
    var cx = 170, cy = 170;
    var ticks = [];
    for (var d = 0; d < 360; d += 6) {
      var rad = d * Math.PI / 180;
      var r1 = d % 30 === 0 ? 148 : (d % 15 === 0 ? 152 : 154);
      var r2 = 157;
      var x1 = (cx + r1 * Math.cos(rad)).toFixed(1);
      var y1 = (cy + r1 * Math.sin(rad)).toFixed(1);
      var x2 = (cx + r2 * Math.cos(rad)).toFixed(1);
      var y2 = (cy + r2 * Math.sin(rad)).toFixed(1);
      ticks.push('<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="var(--gold-hair)" stroke-width="' + (d % 30 === 0 ? '1.5' : '0.8') + '"/>');
    }
    return '<svg class="wheel-svg" viewBox="0 0 340 340" aria-hidden="true">' +
      '<defs>' +
      '<radialGradient id="wheel-grad" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0%" stop-color="var(--gold-wash)" stop-opacity="0.85"/>' +
      '<stop offset="60%" stop-color="var(--gold-wash)" stop-opacity="0.25"/>' +
      '<stop offset="100%" stop-color="var(--gold-hair)" stop-opacity="0.6"/>' +
      '</radialGradient>' +
      '</defs>' +
      '<circle cx="170" cy="170" r="162" fill="none" stroke="var(--gold-hair)" stroke-width="0.8" opacity="0.6"/>' +
      '<circle cx="170" cy="170" r="157" fill="url(#wheel-grad)" stroke="var(--gold)" stroke-width="' + (strokeWide ? 3 : 1.8) + '"/>' +
      '<circle cx="170" cy="170" r="115" fill="none" stroke="var(--gold-line)" stroke-width="' + (strokeWide ? 2 : 1.2) + '"/>' +
      (strokeWide ? '' : '<circle cx="170" cy="170" r="50" fill="var(--gold-wash)" stroke="var(--gold)" stroke-width="1.5"/>' +
        '<circle cx="170" cy="170" r="46" fill="none" stroke="var(--gold-line)" stroke-width="0.8" stroke-dasharray="3 2"/>' +
        '<circle cx="170" cy="170" r="148" fill="none" stroke="var(--gold-hair)" stroke-width="0.6" stroke-dasharray="2 4"/>') +
      ticks.join('') +
      hs.map(function (h) {
        return '<line x1="' + h.x1 + '" y1="' + h.y1 + '" x2="' + h.x2 + '" y2="' + h.y2 + '" stroke="var(--gold-line)" stroke-width="' + (strokeWide ? 1.5 : 1) + '"/>';
      }).join('') +
      '</svg>';
  }
  function wheel() {
    var hs = houses();
    return '<div class="wheel" role="img" aria-label="ดวงชะตาแบบจักรราศีวงกลม">' + wheelSvg(hs, false) +
      hs.map(function (h) {
        return '<div class="wheel-label" style="left:' + h.lx + ';top:' + h.ly + '">' + esc(h.name) + '</div>' +
          (h.planets ? '<div class="wheel-planet' + (h.lagna ? ' is-lagna' : '') + '" style="left:' + h.px + ';top:' + h.py + '">' +
            tintNums(h.planets) + (h.lagna ? '<span class="wheel-lag-tag">ลัคน์</span>' : '') + '</div>' :
            (h.lagna ? '<div class="wheel-planet is-lagna" style="left:' + h.px + ';top:' + h.py + '"><span class="wheel-lag-tag">ลัคนา</span></div>' : ''));
      }).join('') +
      '<div class="wheel-center">' +
      '<div class="wheel-c-kicker">ลัคนา</div>' +
      '<div class="wheel-c-date">' + esc(birthDate()) + '</div>' +
      '<div class="wheel-c-time">' + esc(birthTime()) + ' น.</div>' +
      '</div></div>';
  }

  /* One large portrait beats two small ornaments: a visitor must see who
     teaches before they see what is taught. Falls back to a marked slot until
     the real photograph is supplied. */
  function heroPortrait() {
    return '<figure class="hero-portrait-arch hero-image-wrapper">' +
      '<div class="arch-crest">บรมครูโหรพัฒนา · ๔๐+ ปี</div>' +
      '<div class="arch-frame"><div class="arch-inner">' +
      '<img class="arch-img hero-image" src="' + esc(TEACHER.photo) + '" alt="อาจารย์' + esc(TEACHER.name) + '" width="760" height="1047">' +
      '</div></div>' +
      '<figcaption>' + esc(TEACHER.name) + '<span>' + esc(TEACHER.born) + ' – ' + esc(TEACHER.died) + '</span></figcaption>' +
      '</figure>';
  }

  /* Third-party recognition carries the trust that a round number cannot. */
  function honours() {
    if (!HONOURS || !HONOURS.length) return '';
    /* Heading and cards share one wrapper so they cannot drift to different
       widths — on desktop the block is centred as a unit. */
    return '<section class="honours-block">' +
      HONOURS.map(function (g) {
        return '<h2 class="sec-title">' + esc(g.group) + '</h2>' +
          '<ul class="honours">' + g.items.map(function (h) {
            return '<li><span class="hon-t">' + esc(h.t) + '</span>' +
              '<span class="hon-by">' + esc(h.by) + '</span></li>';
          }).join('') + '</ul>';
      }).join('') + '</section>';
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
    return '<h2 class="sec-title">เสียงจากลูกศิษย์</h2>' +
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

  /* Site footer — structured archival footer */
  var FOOT_MENU = [
    ['home', 'home', 'หน้าแรก'],
    ['lessons', 'lessons', 'บทเรียน ๙ บท'],
    ['chart', 'chart', 'ผูกดวงชะตา'],
    ['ruek', 'calendar', 'ปฏิทินฤกษ์มงคล'],
    ['courses', 'courses', 'คอร์สเรียน Onsite'],
    ['articles', 'articles', 'คลังบทความ'],
    ['teacher', 'teacher', 'ประวัติอาจารย์พัฒนา'],
    ['videos', 'videos', 'วิดีโอคำสอน']
  ];
  function siteFooter() {
    return '<footer class="site-foot">' +
      '<div class="sf-container">' +
      '<div class="sf-grid">' +

      /* Column 1: Brand & Identity */
      '<div class="sf-col sf-col-brand">' +
      '<div class="sf-brand">' +
      '<img src="logo.png" width="46" height="46" alt="ตราบรมครูโหรพัฒนา" class="sf-logo">' +
      '<div>' +
      '<div class="sf-brand-title">สถาบันโหรพัฒนา</div>' +
      '<div class="sf-brand-sub">บรมครูโหร <em>พัฒนา พัฒนศิริ</em></div>' +
      '</div></div>' +
      '<p class="sf-desc">สืบสานศาสตร์การผูกดวงชะตา วางฤกษ์มงคล และฮวงจุ้ยชั้นสูง ถ่ายทอดความรู้ทางโหราศาสตร์ไทยด้วยหลักวิชาการอันถูกต้องและมีสติ ประสบการณ์กว่า ๔๐ ปี</p>' +
      '</div>' +

      /* Column 2: Quick Links */
      '<div class="sf-col sf-col-nav">' +
      '<div class="sf-heading">สารบัญตำราและบริการ</div>' +
      '<nav class="sf-nav-grid" aria-label="เมนูส่วนท้าย">' +
      FOOT_MENU.map(function (mn) {
        return '<button class="sf-link" data-act="tab" data-tab="' + mn[0] +
          '" data-screen="' + mn[1] + '">' + esc(mn[2]) + '</button>';
      }).join('') +
      '</nav></div>' +

      /* Column 3: Contact & Onsite */
      '<div class="sf-col sf-col-contact">' +
      '<div class="sf-heading">ติดต่อสถาบัน</div>' +
      '<div class="sf-contact-list">' +
      '<a class="sf-contact-item" href="tel:' + esc(CONTACT.tel.replace(/\s/g, '')) + '">' +
      ICON.phone + ' <span>โทร ' + esc(CONTACT.tel) + '</span></a>' +
      '<a class="sf-contact-item" href="https://line.me/R/ti/p/~' + esc(CONTACT.lineId) + '" target="_blank" rel="noopener">' +
      ICON.chat + ' <span>LINE: ' + esc(CONTACT.lineId) + '</span></a>' +
      '<a class="sf-contact-item" href="' + esc(CONTACT.youtube) + '" target="_blank" rel="noopener">' +
      ICON.play + ' <span>YouTube สถาบันโหรพัฒนา</span></a>' +
      '<div style="margin-top:10px"><span class="badge-onsite">' + ICON.school + ' เปิดรับคอร์สเรียน Onsite</span></div>' +
      '</div></div>' +

      '</div>' + /* sf-grid */

      '<div class="sf-bottom">' +
      '<div class="sf-copy">© 2026 Miracle Life Coach Co., Ltd. สงวนลิขสิทธิ์ตามกฎหมาย</div>' +
      '<div class="sf-tagline">โหราศาสตร์ไทย เพื่อความเข้าใจชีวิตและพัฒนาตนเองอย่างมีสติ</div>' +
      '</div>' +

      '</div>' + /* sf-container */
      '</footer>';
  }

  function lessonRows(showTags) {
    var maxDone = Math.max.apply(null, S.done.concat([-1]));
    return LESSONS.map(function (l, i) {
      var done = S.done.indexOf(i) >= 0, now = !done && i === maxDone + 1;
      var imgNum = i + 1;
      var imgSrc = imgNum <= 8 ? 'assets/site/lesson-' + imgNum + '.jpg' : 'assets/site/lesson-1.jpg';
      var thumbHtml = '<div class="row-thumb"><img src="' + esc(imgSrc) + '" alt="ภาพประกอบบทที่ ' + esc(l.n) + '" loading="lazy"><span class="row-thumb-num">' + esc(l.n) + '</span></div>';

      return '<div class="row' + (now ? ' is-now' : '') + '" data-act="lesson" data-i="' + i + '" role="button" tabindex="0" aria-label="บทเรียนที่ ' + esc(l.n) + ' ' + esc(l.t) + '">' +
        thumbHtml + '<div class="row-main">' +
        '<div class="row-title">' + esc(l.t) + '</div><div class="row-sub">' + esc(l.d) + '</div>' +
        (showTags ? '<div class="chips"><span class="tag tag-neutral">' + esc(l.mins) + '</span><span class="tag tag-outline">' + l.secs.length + ' หัวข้อ</span></div>' : '') +
        '</div>' + (done || now ? '<div class="row-state ' + (done ? 'done' : 'now') + '">' + (done ? 'เรียนแล้ว' : 'เรียนต่อ') + '</div>' : '') + '</div>';
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
    return '<aside class="cosmic-compass" aria-label="เข็มทิศดวงดาวประจำวัน">' +
      '<div class="compass-inner">' +
      '<div class="compass-left">' +
      '<span class="compass-date"><span class="compass-icon">' + ICON.planet + '</span> ' + esc(TODAY.label) + '</span>' +
      '<span class="compass-dot" aria-hidden="true">•</span>' +
      '<span class="compass-score-text">พลังมงคล <b>' + esc(TODAY.score) + '</b> (วัน' + esc(TODAY.dowName) + ' สถิตราศี' + esc(TODAY.rasi) + ')</span>' +
      '<span class="compass-dot" aria-hidden="true">•</span>' +
      '<span class="compass-colors">สีมงคล: <b>' + esc(TODAY.goodColor) + '</b> <span class="compass-avoid">/ เลี่ยง: ' + esc(TODAY.avoidColor) + '</span></span>' +
      '</div>' +
      '<button class="compass-badge" data-act="tab" data-tab="ruek" data-screen="calendar" aria-label="เปิดปฏิทินฤกษ์มงคล: ' + esc(TODAY.ruek) + '">' +
      '<span>' + esc(TODAY.ruek) + '</span> <span class="compass-arrow" aria-hidden="true">→</span>' +
      '</button>' +
      '</div>' +
      '</aside>' +

      '<section class="hero" aria-label="แนะนำสถาบันโหรพัฒนา">' +
      '<div class="hero-content">' +
      '<div class="kicker">สถาบันโหราศาสตร์ไทย · ประสบการณ์กว่า ๔๐ ปี</div>' +
      '<h1 class="hero-title"><span class="hero-title-sub">เรียนดวง กับ บรมครูโหร</span><span class="shimmer-gold hero-title-main">พัฒนา พัฒนศิริ</span></h1>' +
      '<div class="orn"><i></i></div>' +
      '<p class="hero-desc">โหราศาสตร์ไทย เพื่อความเข้าใจชีวิต และพัฒนาตนเองอย่างมีสติ ถ่ายทอดวิชาการผูกดวงชะตา วางฤกษ์มงคล และฮวงจุ้ยชั้นสูง ครบถ้วนตามตำราโบราณจารย์</p>' +
      '<div class="hero-actions">' +
      '<button class="btn btn-primary" data-act="tab" data-tab="lessons" data-screen="lessons">' + ICON.scripture + ' <span>เริ่มศึกษาตำรา ๙ บท</span></button>' +
      '<button class="btn btn-secondary" data-act="tab" data-tab="chart" data-screen="chart">' + ICON.chart + ' <span>ผูกดวงชะตา</span></button>' +
      '</div>' +
      '<div class="hero-trust">' +
      '<span class="hero-trust-item"><span style="color:var(--gold)">✦</span> ถ่ายทอดวิชา ๔๐+ ปี</span>' +
      '<span class="hero-trust-dot">•</span>' +
      '<span class="hero-trust-item">ตำราเรียนสมบูรณ์ ๙ บท</span>' +
      '<span class="hero-trust-dot">•</span>' +
      '<span class="hero-trust-item">ศิษย์ทั่วประเทศ</span>' +
      '</div>' +
      '</div>' +
      '<div class="hero-media">' +
      heroPortrait() +
      '</div>' +
      '</section>' +

      '<section class="features-section" aria-label="บริการหลัก">' +
      '<div class="sec-title">สารบัญหลักสถาบัน</div>' +
      '<div class="quick-grid-4">' +
      '<div class="action-card" data-act="tab" data-tab="chart" data-screen="chart" role="button" tabindex="0" aria-label="ผูกดวงชะตาของคุณ">' +
      '<div class="action-card-icon">' + ICON.chart + '</div><div class="action-card-title">ผูกดวงชะตา</div><p class="action-card-desc">คำนวณลัคนา แผนภูมิจตุโกณและจักรราศี</p>' +
      '</div>' +
      '<div class="action-card" data-act="tab" data-tab="ruek" data-screen="calendar" role="button" tabindex="0" aria-label="ปฏิทินฤกษ์มงคล">' +
      '<div class="action-card-icon">' + ICON.calendar + '</div><div class="action-card-title">ปฏิทินฤกษ์</div><p class="action-card-desc">ตรวจฤกษ์มงคล ฤกษ์เจรจา ออกรถ แต่งงาน</p>' +
      '</div>' +
      '<div class="action-card" data-act="tab" data-tab="lessons" data-screen="lessons" role="button" tabindex="0" aria-label="ตำราโหราศาสตร์ ๙ บท">' +
      '<div class="action-card-icon">' + ICON.scripture + '</div><div class="action-card-title">ตำรา ๙ บท</div><p class="action-card-desc">หลักสูตรพื้นฐานสู่การพยากรณ์ชั้นสูง</p>' +
      '</div>' +
      '<div class="action-card" data-act="go" data-screen="articles" role="button" tabindex="0" aria-label="คลังบทความโหราศาสตร์">' +
      '<div class="action-card-icon">' + ICON.wisdom + '</div><div class="action-card-title">คลังความรู้</div><p class="action-card-desc">บทความและเกร็ดวิชาจากบรมครู</p>' +
      '</div>' +
      '</div></section>' +

      statStrip() +
      honours() +
      marquee() +
      '<section class="articles-featured-section"><h2 class="sec-title">บทความแนะนำ</h2>' +
      '<div class="articles-grid" style="padding-bottom:0">' +
      ALL_ARTICLES.slice(0, 3).map(function (a) { return articleCard(a); }).join('') +
      '</div>' +
      '<div style="text-align:center;padding:18px var(--s-5) var(--s-4)">' +
      '<button class="linkish" data-act="go" data-screen="articles">ดูบทความทั้งหมด (' + ALL_ARTICLES.length + ' เรื่อง) →</button>' +
      '</div></section>' +
      '<section class="lessons-featured-section"><h2 class="sec-title">ตำราโหราศาสตร์ทั้ง ๙ บท</h2>' + lessonList(false) + '</section>' +
      testimonials();
  };

  V.homeChart = function () {
    var hs = houses();
    return '<section class="poster"><div class="kicker">ฤกษ์วันนี้ · ' + esc(TODAY.label) + '</div>' +
      '<h2>' + esc(TODAY.ruek) + '</h2><p>' + esc(TODAY.note) + '</p>' +
      '<div class="actions"><button class="btn btn-invert" data-act="tab" data-tab="ruek" data-screen="calendar">ปฏิทินฤกษ์</button>' +
      '<button class="btn btn-outline-light" data-act="go" data-screen="booking">จองปรึกษา</button></div></section>' +
      '<div class="mini-chart" data-act="tab" data-tab="chart" data-screen="chart" role="button" tabindex="0" aria-label="ดูแผนภูมิดวงชะตาของคุณ">' + wheelSvg(hs, true) +
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
    return '<div class="card" role="button" tabindex="0" aria-label="' + esc(title) + '" data-act="' + act + '" data-screen="' + (act === 'tab' ? b : a) + '"' + (act === 'tab' ? ' data-tab="' + a + '"' : '') + '>' +
      '<div class="card-kicker">' + esc(kicker) + '</div><h3 class="card-title">' + esc(title) + '</h3>' +
      '<p class="card-body">' + esc(body) + '</p><div class="card-meta">' + esc(meta) + '</div></div>';
  }

  V.homeCourse = function () {
    var i = nextUnread(), l = LESSONS[i], p = progress();
    return '<div class="hero-photo"><div class="ph">ภาพอาจารย์พัฒนา · รอไฟล์จริง</div>' +
      '<h2>เรียนดวงกับ<br>บรมครูโหรพัฒนา</h2></div>' +
      '<div class="block" data-act="lesson" data-i="' + i + '" role="button" tabindex="0" aria-label="เรียนต่อ บทที่ ' + esc(l.n) + ': ' + esc(l.t) + '" style="cursor:pointer">' +
      '<div class="kicker">เรียนต่อ</div><h3 style="font-size:22px;margin-top:6px">' + esc(l.n) + ' · ' + esc(l.t) + '</h3>' +
      '<div class="row-sub">' + esc(l.d) + '</div>' +
      '<div class="progress" style="margin-top:12px"><span style="width:' + p.pct + '"></span></div>' +
      '<div class="muted" style="font-size:11px;margin-top:5px">เรียนแล้ว ' + p.count + ' / ' + LESSONS.length + ' บท</div></div>' +
      '<h2 class="sec-title">คอร์สที่เปิดรับ</h2>' +
      COURSES.map(function (c) {
        return '<div class="row" data-act="go" data-screen="courses" role="button" tabindex="0" aria-label="' + esc(c.t) + ' ' + esc(c.price) + '"><div class="row-main">' +
          '<div class="row-title">' + esc(c.t) + '</div><div class="row-sub">' + esc(c.meta) + '</div></div>' +
          '<div class="num" style="font-size:15px">' + esc(c.price) + '</div></div>';
      }).join('') +
      '<div class="stack"><button class="btn btn-primary btn-block" data-act="go" data-screen="booking">จองปรึกษาส่วนตัว</button>' +
      '<button class="btn btn-secondary btn-block" data-act="tab" data-tab="chart" data-screen="chart">ผูกดวงชะตาด้วยตัวเอง</button></div>';
  };

  V.lessons = function () {
    var p = progress();
    return '<h1 class="sec-title" style="margin-top:0">ตำราโหราศาสตร์ไทยทั้ง ๙ บท</h1>' +
      '<div class="block" style="display:flex;align-items:center;gap:10px">' +
      '<div class="progress" style="flex:1"><span style="width:' + p.pct + '"></span></div>' +
      '<div class="num" style="font-size:11px">เรียนแล้ว ' + p.count + ' / ' + LESSONS.length + ' บท</div></div>' +
      lessonList(true) + '<div style="height:24px"></div>';
  };

  V.reader = function () {
    var l = LESSONS[S.lesson], done = S.done.indexOf(S.lesson) >= 0;
    var next = Math.min(S.lesson + 1, LESSONS.length - 1);
    var isReading = ttsState.isSpeaking && ttsState.activeScope === 'reader';
    return '<div class="print-doc-header">' +
      '<div class="print-brand"><img src="logo.png" width="46" height="46" alt="ตราบรมครูโหรพัฒนา">' +
      '<div><div class="print-title">ตำราโหราศาสตร์ไทย · สถาบันโหรพัฒนา</div>' +
      '<div class="print-sub">บรมครูโหร พัฒนา พัฒนศิริ — horapatana.com</div></div></div>' +
      '<div class="print-meta">บทที่ ' + esc(l.n) + ': ' + esc(l.t) + '</div></div>' +
      '<div class="reader-toolbar" role="toolbar" aria-label="แถบเครื่องมืออ่านตำรา">' +
      '<button class="reader-tool-btn' + (S.candleMode ? ' is-active' : '') + '" data-act="toggle-candle-mode" aria-pressed="' + (S.candleMode ? 'true' : 'false') + '" title="โหมดแสงเทียนสบายตา">' +
      '<span><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2v4m0 16v-4m10-6h-4M6 12H2m15-7l-2.8 2.8M6.8 6.8L9.6 9.6m10.4 7.6l-2.8-2.8m-10.4 0l2.8-2.8M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg></span><span>แสงเทียน' + (S.candleMode ? ' (เปิด)' : '') + '</span></button>' +
      '<button class="reader-tool-btn" data-act="print-lesson" title="พิมพ์หน้านี้เป็นตำรา หรือบันทึก PDF">' +
      '<span><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M19 8H5a2 2 0 00-2 2v6h4v4h10v-4h4v-6a2 2 0 00-2-2zM7 4h10v2H7V4zm10 12H7v-4h10v4z"/></svg></span><span>พิมพ์ตำรา</span></button>' +
      '</div>' +
      /* ── TTS Audio Player Widget ── */
      '<div class="tts-box">' +
      '<div class="tts-header">' +
      '<div class="tts-info">' +
      '<span class="tts-icon" aria-hidden="true">' + (isReading ? ICON.speaker : ICON.headphones) + '</span>' +
      '<div>' +
      '<div class="tts-title">' + (isReading ? 'กำลังอ่านออกเสียงตำรา...' : 'ฟังเสียงอ่านตำราบทนี้') + '</div>' +
      '<div class="tts-sub">เสียงสังเคราะห์ธรรมชาติ สบายตาสำหรับผู้ใหญ่</div>' +
      '</div></div>' +
      '<button class="tts-btn' + (isReading ? ' is-playing' : '') + '" data-act="tts-toggle" data-scope="reader" aria-label="' + (isReading ? 'หยุดฟังเสียงอ่านตำรา' : 'เริ่มฟังเสียงอ่านตำรา') + '">' +
      (isReading
        ? '<span class="tts-wave"><span></span><span></span><span></span></span><span>' + ICON.pause + ' หยุดฟัง</span>'
        : '<span>' + ICON.playSolid + '</span><span>ฟังเสียงอ่าน</span>') +
      '</button></div>' +
      '<div class="speed-control">' +
      '<span>ความเร็วเสียง:</span>' +
      '<div class="speed-buttons" role="group" aria-label="ความเร็วเสียงอ่าน">' +
      '<button class="speed-btn' + (ttsState.rate === 0.8 ? ' active' : '') + '" aria-pressed="' + (ttsState.rate === 0.8) + '" data-act="tts-speed" data-speed="0.8" data-scope="reader">0.8x ช้าชัด</button>' +
      '<button class="speed-btn' + (ttsState.rate === 1.0 ? ' active' : '') + '" aria-pressed="' + (ttsState.rate === 1.0) + '" data-act="tts-speed" data-speed="1.0" data-scope="reader">1.0x ปกติ</button>' +
      '<button class="speed-btn' + (ttsState.rate === 1.2 ? ' active' : '') + '" aria-pressed="' + (ttsState.rate === 1.2) + '" data-act="tts-speed" data-speed="1.2" data-scope="reader">1.2x กระชับ</button>' +
      '</div></div></div>' +
      '<div class="reader-head"><div class="kicker">บทที่ ' + esc(l.n) + '</div><h1 style="font-size:26px;margin:4px 0 8px;color:var(--paper)">' + esc(l.t) + '</h1>' +
      '<p class="muted" style="margin:8px 0 0;font-size:14px">' + esc(l.d) + '</p></div>' +
      l.secs.map(function (s, i) {
        return '<div class="reader-sec' + (i === 0 ? ' lead-sec' : '') + '"><h2>' + esc(s.h) + '</h2><p>' + esc(s.p) + '</p></div>';
      }).join('') +
      (l.hasTable ? '<div class="reader-sec"><h2>ดาวพระเคราะห์ทั้ง ๑๐ ดวง</h2><table class="table" aria-label="ดาวพระเคราะห์ทั้ง ๑๐ ดวง"><thead><tr><th scope="col">เลข</th><th scope="col">ดาว</th><th scope="col">เกษตร</th></tr></thead><tbody>' +
        PLANETS.map(function (p) {
          return '<tr><td class="num-accent">' + esc(p.n) + '</td><td>' + esc(p.name) + '</td><td class="muted">' + esc(p.home) + '</td></tr>';
        }).join('') + '</tbody></table></div>' : '') +
      '<div class="stack"><button class="btn btn-primary btn-block" data-act="done">' + (done ? 'เรียนบทนี้แล้ว ✓' : 'ทำเครื่องหมายว่าเรียนแล้ว') + '</button>' +
      '<button class="btn btn-secondary btn-block" data-act="lesson" data-i="' + next + '">บทต่อไป · ' + esc(LESSONS[next].t) + '</button></div>';
  };

  V.chart = function () {
    var b = S.birth;
    var dim = daysInMonth(b.m, b.y);
    if (b.d > dim) b.d = dim;
    var thisYear = new Date().getFullYear() + 543;
    var formHtml = '<div class="chart-form-col"><div class="block">' +
      '<div class="kicker">ข้อมูลกำเนิดเพื่อการคำนวณ</div>' +
      '<h1 style="font-size:22px;margin:4px 0 14px;color:var(--paper)">ระบุวัน เวลา และสถานที่เกิด</h1>' +
      '<div class="field"><span>วันเกิด</span><div class="picker picker-date">' +
      select('birth.d', opts(range(1, dim, 1), b.d), 'วันที่เกิด') +
      select('birth.m', opts(MONTHS, b.m, function (n, i) { return i; }), 'เดือนเกิด') +
      select('birth.y', opts(range(thisYear, thisYear - 100, -1), b.y), 'ปี พ.ศ. เกิด') +
      '</div></div>' +
      '<div class="field" style="margin-top:16px"><span>เวลาเกิด</span><div class="picker picker-time">' +
      select('birth.hh', opts(range(0, 23, 1), b.hh, null, function (n) { return pad2(n) + ' น.'; }), 'ชั่วโมงเกิด') +
      select('birth.mm', opts(range(0, 59, 1), b.mm, null, function (n) { return pad2(n) + ' นาที'; }), 'นาทีเกิด') +
      '</div></div>' +
      '<label class="field" style="margin-top:16px"><span>สถานที่เกิด</span>' +
      '<select class="input" data-bind="birth.place" data-live="1" aria-label="สถานที่เกิด">' + opts(PROVINCES, b.place) + '</select>' +
      '</label>' +
      '<button class="btn btn-primary btn-block" style="margin-top:18px" data-act="cast">' +
      (S.chartDone ? 'คำนวณใหม่' : 'ผูกดวงชะตา') + '</button></div></div>';

    if (!S.chartDone) {
      return '<div class="chart-layout">' + formHtml +
        '<div class="chart-result-col">' +
        '<div class="empty-state" style="padding:48px 24px">' +
        '<div class="orn"><i></i></div>' +
        '<h3>พร้อมสำหรับการผูกดวงชะตา</h3>' +
        '<p class="muted">กรุณาระบุวัน เวลา และสถานที่เกิด แล้วกดปุ่ม "ผูกดวงชะตา" เพื่อคำนวณตำแหน่งลัคนา ดาวพระเคราะห์ และมาตรฐานดาว</p>' +
        '</div></div></div>';
    }

    var thai = S.chartStyle !== 'wheel';
    var resultHtml = '<div class="chart-result-col">' +
      '<div class="seg" role="group" aria-label="รูปแบบแผนภูมิ">' +
      '<button class="seg-btn' + (thai ? ' on' : '') + '" data-act="cstyle" data-t="thai">จตุโกณ · แบบไทย</button>' +
      '<button class="seg-btn' + (thai ? '' : ' on') + '" data-act="cstyle" data-t="wheel">จักรราศี · วงกลม</button>' +
      '</div>' +
      '<div class="chart-display-container">' +
      (thai ? '<div class="tk-wrap chart-anim-in">' + squareChart() + '</div>'
        : '<div class="wheel-wrap chart-anim-in">' + wheel() + '</div>') +
      '</div>' +
      '<div class="wheel-caption">' + esc(birthLine()) + '</div>' +
      '<div style="padding:0 16px 6px;text-align:center"><span class="muted" style="font-size:12.5px">คำแนะนำ: แตะที่แถวดาวแต่ละดวงเพื่อดูความหมายและบทวิเคราะห์ตามตำรา</span></div>' +
      '<div style="padding:0 16px 16px"><table class="table" aria-label="ตำแหน่งดาวและมาตรฐานทางโหราศาสตร์"><thead><tr><th scope="col">ดาว</th><th scope="col">ราศี</th><th scope="col">ภพ</th><th scope="col">มาตรฐาน</th></tr></thead><tbody>' +
      CHART_ROWS.map(function (r, idx) {
        var gn = planetNo(String(r.p).charAt(0));
        return '<tr data-act="inspect-planet" data-idx="' + idx + '" data-planet-idx="' + idx + '" role="button" tabindex="0" aria-label="แตะเพื่อดูรายละเอียดดาว ' + esc(r.p) + '" title="แตะเพื่อดูรายละเอียดดาว ' + esc(r.p) + '"><td class="num">' +
          (DAY_COLOR[gn] ? '<i class="graha-dot" style="background:' + DAY_COLOR[gn] + '"></i>' : '') +
          esc(r.p) + '</td><td>' + esc(r.rasi) + '</td><td>' + esc(r.house) + '</td>' +
          '<td><span class="tag ' + r.cls + '">' + esc(r.std) + '</span></td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div style="padding:0 16px 24px"><h2 class="sec-title" style="font-size:17px;margin-bottom:6px;padding:var(--s-4) 0 var(--s-2)">อ่านพื้นดวงอย่างไร</h2>' +
      '<p style="font-size:13px;line-height:1.75">เริ่มจากลัคนา ดูเจ้าเรือนลัคนาสถิตราศีใด แล้วอ่านภพ ๑ ถึง ๑๒ ตามลำดับ ก่อนพิจารณามาตรฐานดาว—เกษตร อุจจ์ นิจจ์—เพื่อชั่งกำลังของแต่ละดวง</p>' +
      '<button class="btn btn-secondary btn-block" data-act="lesson" data-i="6">ไปบทเรียนพยากรณ์</button></div>' +
      '</div>';

    return '<div class="chart-layout">' + formHtml + resultHtml + '</div>';
  };

  V.calendar = function () {
    var cm = S.calMonth, cy = S.calYear;
    var dim = new Date(cy, cm + 1, 0).getDate();
    var offset = new Date(cy, cm, 1).getDay();
    var md = buildMonthDays(cm, cy);
    var GOOD = md.good, AVOID = md.avoid;
    var cells = '';
    for (var i = 0; i < offset; i++) cells += '<div class="cal-day empty" aria-hidden="true"></div>';
    for (var d = 1; d <= dim; d++) {
      var cls = 'cal-day' + (S.calDay === d ? ' sel' : (GOOD.indexOf(d) >= 0 ? ' good' : (AVOID.indexOf(d) >= 0 ? ' avoid' : '')));
      var mark = GOOD.indexOf(d) >= 0 ? '<i class="mk good" aria-hidden="true">✦</i>' : (AVOID.indexOf(d) >= 0 ? '<i class="mk avoid" aria-hidden="true">✕</i>' : '');
      var aria = ' aria-label="วันที่ ' + d + ' ' + MONTHS[cm] + (GOOD.indexOf(d) >= 0 ? ' ฤกษ์ดี' : (AVOID.indexOf(d) >= 0 ? ' ควรเลี่ยง' : ' ฤกษ์ทั่วไป')) + '"';
      cells += '<div class="' + cls + '" data-act="calday" data-d="' + d + '" role="button" tabindex="0"' + aria + '>' + d + '<span>' + mark + '</span></div>';
    }
    var total = offset + dim; while (total % 7 !== 0) { cells += '<div class="cal-day empty" aria-hidden="true"></div>'; total++; }
    var dow = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(function (d) { return '<div class="cal-dow">' + d + '</div>'; }).join('');
    var monthRuek = buildRuek(cm, cy);

    /* Auspicious forecast details for currently selected day in calendar */
    var selDt = new Date(cy, cm, S.calDay || 1);
    var selDow = DOW_NAMES[selDt.getDay()];
    var selRasi = getSunRasi(selDt);
    var selRuek = ruekLabel(selDt);
    var selFortune = dayFortune(selDt);
    var selShareText = 'ฤกษ์มงคล · สถาบันโหรพัฒนา\n' +
      'วัน' + selDow + 'ที่ ' + (S.calDay || 1) + ' ' + MONTHS[cm] + ' ' + (cy + 543) + '\n' +
      'ฤกษ์: ' + selRuek + '\n' +
      'สถิตราศี: ' + selRasi + '\n' +
      'ศึกษาโหราศาสตร์ไทย: https://horapatana.com';
    var lineShareUrl = 'https://line.me/R/msg/text/?' + encodeURIComponent(selShareText);

    return '<div class="cal-layout">' +
      '<div class="cal-col-grid">' +
      '<div class="cal-head">' +
      '<button class="icon-btn" data-act="calPrev" aria-label="เดือนก่อนหน้า" style="width:36px;height:36px">' + ICON.back + '</button>' +
      '<h1 style="font-size:22px;font-weight:700;margin:0">' + esc(thaiMonthYear(cm, cy)) + '</h1>' +
      '<button class="icon-btn" data-act="calNext" aria-label="เดือนถัดไป" style="width:36px;height:36px;transform:rotate(180deg)">' + ICON.back + '</button>' +
      '</div>' +
      '<div class="cal-legend">' +
      '<span style="display:inline-flex;align-items:center;gap:6px"><i class="mk good" aria-hidden="true">✦</i>ฤกษ์ดี</span>' +
      '<span style="display:inline-flex;align-items:center;gap:6px"><i class="mk avoid" aria-hidden="true">✕</i>ควรเลี่ยง</span>' +
      '</div>' +
      '<div class="cal-dows">' + dow + '</div><div class="cal">' + cells + '</div>' +
      '</div>' +

      '<div class="cal-col-detail">' +
      '<div class="cal-action-box">' +
      '<div class="kicker">รายละเอียดฤกษ์ประจำวัน</div>' +
      '<div style="font:700 18px/1.3 var(--font-h);color:var(--gold-ink);margin-top:6px">' +
      'วัน' + esc(selDow) + 'ที่ ' + (S.calDay || 1) + ' ' + esc(MONTHS[cm]) + ' ' + (cy + 543) +
      '</div>' +
      '<div style="font-size:14px;color:var(--dim);margin:4px 0 10px">สถิตราศี' + esc(selRasi) + '</div>' +
      '<div style="margin-bottom:14px">' +
      '<span class="tag ' + (selFortune === 'good' ? 'tag-accent' : (selFortune === 'avoid' ? 'tag-outline' : 'tag-neutral')) + '">' +
      esc(selRuek) + '</span>' +
      '</div>' +
      '<div class="cal-action-btns">' +
      '<button class="btn-copy-ruek" data-act="copy-day-ruek" data-d="' + (S.calDay || 1) + '">' + ICON.code + ' <span>คัดลอกสรุปฤกษ์</span></button>' +
      '<a class="btn-share-line" href="' + lineShareUrl + '" target="_blank" rel="noopener">' + ICON.chat + ' <span>ส่งต่อทาง LINE</span></a>' +
      '</div></div>' +

      '<h2 class="sec-title" style="margin-top:20px">ฤกษ์เด่นประจำเดือน</h2>' +
      (monthRuek.length ? monthRuek.map(function (r) {
        return '<div class="row" data-act="go" data-screen="booking" role="button" tabindex="0" aria-label="ฤกษ์วันที่ ' + esc(r.day) + ': ' + esc(r.t) + '">' +
          '<div class="row-num" style="font-size:20px;width:44px">' + esc(r.day) + '</div><div class="row-main">' +
          '<div class="row-title" style="font-size:15px">' + esc(r.t) + '</div><div class="row-sub">' + esc(r.d) + '</div></div>' +
          '<span class="tag tag-accent">' + esc(r.time) + '</span></div>';
      }).join('') : '<p class="muted" style="text-align:center;padding:var(--s-4)">ไม่มีฤกษ์เด่นในเดือนนี้</p>') +
      '<div style="margin-top:16px"><button class="btn btn-primary btn-block" data-act="go" data-screen="booking">ขอฤกษ์เฉพาะบุคคล</button></div>' +
      '</div></div>';
  };

  /* The contact block the site closes on, QR included. */
  function contactChannels() {
    return '<h2 class="sec-title">ช่องทางติดต่อ</h2>' +
      '<div class="channels">' +
      '<a class="channel" href="tel:' + esc(CONTACT.tel.replace(/\s/g, '')) + '">' +
      '<span class="ch-k">เบอร์ติดต่อ</span><span class="ch-v">' + esc(CONTACT.tel) + '</span></a>' +
      '<a class="channel" href="https://line.me/R/ti/p/~' + esc(CONTACT.lineId) + '" target="_blank" rel="noopener">' +
      '<span class="ch-k">Line ID</span><span class="ch-v">' + esc(CONTACT.lineId) + '</span></a>' +
      '</div>' +
      '<figure class="qr"><img src="' + esc(MEDIA.lineQr) + '" alt="QR code เพิ่มเพื่อนทางไลน์ ' + esc(CONTACT.lineId) + '" ' +
      'width="520" height="520" loading="lazy">' +
      '<figcaption>สแกน QR code เพิ่มเพื่อน Line</figcaption></figure>';
  }

  V.courses = function () {
    return '<div class="banner-onsite" style="margin:var(--s-4) 0 var(--s-2);padding:14px 18px;background:var(--gold-wash);border:1px solid var(--gold-deep);border-radius:var(--r-md);display:flex;align-items:center;gap:14px">' +
      '<div class="banner-icon" style="flex:none;color:var(--gold-ink)" aria-hidden="true">' + ICON.school + '</div>' +
      '<div><div style="font:700 16px/1.3 var(--font-h);color:var(--gold-ink)">หลักสูตรเรียนสด Onsite (รับจำนวนจำกัด)</div>' +
      '<div style="font-size:14px;color:var(--dim);margin-top:2px">เรียนแบบกลุ่มย่อย ใกล้ชิดอาจารย์ผู้สอน ณ สถาบันโหรพัฒนา พร้อมตำราและอุปกรณ์ครบชุด</div></div></div>' +
      '<p class="muted" style="padding:var(--s-3) 0 var(--s-2);text-align:center;max-width:54ch;margin-inline:auto">' +
      esc(INTRO.courses) + '</p>' +
      '<h1 class="sec-title">หลักสูตรโหราศาสตร์ไทย Onsite</h1>' +
      '<div class="courses-grid">' +
      COURSES.map(function (c) {
        var lineMsg = 'สวัสดีครับ/ค่ะ สนใจสอบถามรอบเรียน Onsite หลักสูตร "' + c.t + '" รบกวนขอทราบตารางเรียนและสถานที่ครับ';
        var lineUrl = 'https://line.me/R/oaMessage/' + encodeURIComponent(CONTACT.lineId) + '/?' + encodeURIComponent(lineMsg);
        return '<div class="course-card" style="padding:22px 18px;background:var(--white);border:1px solid var(--gold-hair);border-top:3px solid var(--gold);border-radius:var(--r-md);display:flex;flex-direction:column">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">' +
          '<div><span class="badge-onsite" style="margin-bottom:6px">' + ICON.pin + ' เรียน Onsite</span><h2 style="font-size:20px;font-weight:600">' + esc(c.t) + '</h2></div>' +
          '<div class="num" style="font-size:16px;color:var(--red);font-weight:600">' + esc(c.price) + '</div></div>' +
          '<div class="row-sub" style="font-size:14.5px;color:var(--gold-ink);margin-top:4px">' + esc(c.meta) + '</div>' +
          '<p style="margin:12px 0 0;font-size:15.5px;line-height:1.7;color:var(--dim);flex:1">' + esc(c.body) + '</p>' +
          '<div class="chips" style="margin-top:14px">' + c.tags.map(function (t) { return '<span class="tag tag-neutral">' + esc(t) + '</span>'; }).join('') + '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px">' +
          '<a class="btn btn-primary" style="background:#06c755;border-color:#06c755;color:#fff" href="' + lineUrl + '" target="_blank" rel="noopener">' + ICON.chat + ' <span>ทักไลน์จองที่นั่ง</span></a>' +
          '<a class="btn btn-secondary" href="tel:' + esc(CONTACT.tel.replace(/\s/g, '')) + '">' + ICON.phone + ' <span>โทรสอบถาม</span></a>' +
          '</div></div>';
      }).join('') + '</div>';
  };

  V.booking = function () {
    var b = S.booking;
    if (b.done) {
      return '<div style="padding:22px 16px"><section class="poster" style="border-radius:var(--r-md)">' +
        '<div class="kicker">ยืนยันการจองแล้ว</div><h1 style="font-size:24px">' + esc(b.svc) + '</h1>' +
        '<p style="font-size:14px">' + esc(b.slot) + '</p></section>' +
        '<p class="muted" style="margin:14px 0 0;font-size:13px">ทีมงานจะติดต่อยืนยันทางไลน์ภายใน ๑ วันทำการ</p>' +
        '<button class="btn btn-secondary btn-block" style="margin-top:12px" data-act="rebook">จองรายการอื่น</button></div>';
    }
    return '<p class="muted" style="padding:var(--s-5) var(--s-5) 0;text-align:center">' +
      esc(INTRO.booking) + '</p>' +
      '<h1 class="sec-title">บริการนัดหมายและปรึกษาดวงชะตา</h1>' +
      '<div class="block"><div class="block-title">เลือกบริการ</div><div class="pick-list">' +
      SERVICES.map(function (s) {
        return '<div class="pick" role="button" tabindex="0" aria-pressed="' + (b.svc === s.t) + '" data-act="svc" data-t="' + esc(s.t) + '">' +
          '<div><div class="pick-title">' + esc(s.t) + '</div><div class="pick-sub">' + esc(s.d) + '</div></div>' +
          '<div class="num">' + esc(s.price) + '</div></div>';
      }).join('') + '</div></div>' +
      '<div class="block"><div class="block-title">เลือกเวลา (ฤกษ์ที่เหมาะ)</div><div class="slots">' +
      buildSlots().map(function (s) {
        return '<button class="slot" aria-pressed="' + (b.slot === s.label) + '" data-act="slot" data-t="' + esc(s.label) + '">' +
          '<span class="slot-label">' + esc(s.label) + '</span><span class="slot-note">' + esc(s.note) + '</span></button>';
      }).join('') + '</div></div>' +
      '<div style="padding:16px"><label for="bk-name" class="field"><span>ชื่อ–นามสกุล</span><input id="bk-name" class="input" autocomplete="name" data-bind="booking.name" value="' + esc(b.name) + '"></label>' +
      '<label for="bk-tel" class="field" style="margin-top:10px"><span>เบอร์โทรศัพท์ติดต่อ</span><input id="bk-tel" type="tel" class="input" autocomplete="tel" placeholder="08x-xxx-xxxx"></label>' +
      '<label for="bk-note" class="field" style="margin-top:10px"><span>คำถามที่อยากปรึกษา</span><textarea id="bk-note" class="input" data-bind="booking.note">' + esc(b.note) + '</textarea></label>' +
      '<button class="btn btn-primary btn-block" style="margin-top:12px" data-act="confirm"' + (b.slot ? '' : ' disabled') + '>' +
      (b.slot ? 'ยืนยันการจอง' : 'เลือกเวลาก่อน') + '</button>' +
      '<div class="muted" style="font-size:11px;margin-top:8px">ค่าบริการชำระหลังยืนยันฤกษ์ · ยกเลิกฟรีก่อน ๒๔ ชม.</div></div>' +
      contactChannels();
  };

  /* ── Article components & modals ───────────────── */
  function articleCard(a) {
    var hasImg = a.image && a.image.trim() !== '';
    var thumbHtml = hasImg
      ? '<img src="' + esc(a.image) + '" alt="' + esc(a.t) + '" loading="lazy">'
      : '<div class="art-thumb-ph">' + ICON.bookOpen + '</div>';

    return '<article class="art-card" data-act="openart" data-id="' + esc(a.id) + '" role="button" tabindex="0" aria-label="' + esc(a.t) + '">' +
      '<div class="art-thumb">' + thumbHtml +
      (a.cat ? '<span class="art-badge">' + esc(a.cat) + '</span>' : '') +
      '</div>' +
      '<div class="art-body">' +
      '<h3 class="art-title">' + esc(a.t) + '</h3>' +
      '<p class="art-desc">' + esc(a.d) + '</p>' +
      '<div class="art-meta">' +
      '<span>' + esc(a.meta || a.author || 'ตำราบรมครู') + '</span>' +
      '<span class="art-read-btn">อ่านบทความ ' + ICON.chev + '</span>' +
      '</div></div></article>';
  }

  function articleModal() {
    if (!S.activeArticleId) return '';
    var a = ALL_ARTICLES.filter(function (x) { return x.id === S.activeArticleId; })[0];
    if (!a) return '';

    var hasImg = a.image && a.image.trim() !== '';
    var secs = a.secs || [{ h: 'เนื้อหาบทความ', p: a.d }];
    var isReading = ttsState.isSpeaking && ttsState.activeScope === 'article';

    return '<div class="art-modal-overlay is-open" data-act="closeart-bg">' +
      '<div class="art-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="art-modal-title">' +
      '<button class="art-modal-close" data-act="closeart" aria-label="ปิดหน้าต่างบทความ">' + ICON.close + '</button>' +
      '<div class="art-modal-scroll">' +
      (hasImg ? '<div class="art-modal-banner"><img src="' + esc(a.image) + '" alt="ภาพหน้าปก ' + esc(a.t) + '"></div>' : '') +
      '<div class="art-modal-content">' +
      '<div class="art-modal-kicker">' + (a.cat ? '<span class="tag tag-accent">' + esc(a.cat) + '</span>' : '') + '</div>' +
      '<h2 id="art-modal-title" class="art-modal-title">' + esc(a.t) + '</h2>' +
      '<div class="art-modal-byline">' +
      (a.author ? '<span>โดย <em>' + esc(a.author) + '</em></span>' : '') +
      (a.meta ? '<span>' + esc(a.meta) + '</span>' : '') +
      '</div>' +
      /* ── TTS Audio Player in Article Modal ── */
      '<div class="tts-box" style="margin:var(--s-2) 0 var(--s-3)">' +
      '<div class="tts-header">' +
      '<div class="tts-info">' +
      '<span class="tts-icon" aria-hidden="true">' + (isReading ? ICON.speaker : ICON.headphones) + '</span>' +
      '<div>' +
      '<div class="tts-title">' + (isReading ? 'กำลังอ่านออกเสียงบทความ...' : 'ฟังเสียงอ่านบทความนี้') + '</div>' +
      '<div class="tts-sub">เสียงสังเคราะห์ธรรมชาติ สบายตาสำหรับผู้ใหญ่</div>' +
      '</div></div>' +
      '<button class="tts-btn' + (isReading ? ' is-playing' : '') + '" data-act="tts-toggle" data-scope="article" aria-label="' + (isReading ? 'หยุดฟังเสียงอ่านบทความ' : 'เริ่มฟังเสียงอ่านบทความ') + '">' +
      (isReading
        ? '<span class="tts-wave"><span></span><span></span><span></span></span><span>' + ICON.pause + ' หยุดฟัง</span>'
        : '<span>' + ICON.playSolid + '</span><span>ฟังเสียงอ่าน</span>') +
      '</button></div>' +
      '<div class="speed-control">' +
      '<span>ความเร็วเสียง:</span>' +
      '<div class="speed-buttons" role="group" aria-label="ความเร็วเสียงอ่าน">' +
      '<button class="speed-btn' + (ttsState.rate === 0.8 ? ' active' : '') + '" aria-pressed="' + (ttsState.rate === 0.8) + '" data-act="tts-speed" data-speed="0.8" data-scope="article">0.8x ช้าชัด</button>' +
      '<button class="speed-btn' + (ttsState.rate === 1.0 ? ' active' : '') + '" aria-pressed="' + (ttsState.rate === 1.0) + '" data-act="tts-speed" data-speed="1.0" data-scope="article">1.0x ปกติ</button>' +
      '<button class="speed-btn' + (ttsState.rate === 1.2 ? ' active' : '') + '" aria-pressed="' + (ttsState.rate === 1.2) + '" data-act="tts-speed" data-speed="1.2" data-scope="article">1.2x กระชับ</button>' +
      '</div></div></div>' +
      (a.d ? '<div class="art-modal-summary">' + esc(a.d) + '</div>' : '') +
      secs.map(function (s, i) {
        return '<section class="art-modal-sec">' +
          (s.h ? '<h3 style="font-size:18px;margin-bottom:8px">' + esc(s.h) + '</h3>' : '') +
          '<p>' + esc(s.p).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') + '</p>' +
          '</section>';
      }).join('') +
      '</div></div>' +
      '<div class="art-modal-footer">' +
      '<button class="btn btn-secondary btn-sm" data-act="closeart">ปิดหน้าต่าง</button>' +
      '<button class="btn btn-primary btn-sm" data-act="tab" data-tab="lessons" data-screen="lessons">ไปที่บทเรียนโหราศาสตร์</button>' +
      '</div></div></div>';
  }

  function adminLoginModal() {
    if (!S.showAdminLogin) return '';
    return '<div class="art-modal-overlay is-open" data-act="close-admin-login-bg">' +
      '<div class="art-modal-dialog" style="max-width:380px" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">' +
      '<button class="art-modal-close" data-act="close-admin-login" aria-label="ปิดหน้าต่างเข้าสู่ระบบ">' + ICON.close + '</button>' +
      '<div style="padding:28px 22px 24px;text-align:center">' +
      '<div style="width:52px;height:52px;margin:0 auto 14px;border-radius:50%;background:var(--gold-wash);border:1px solid var(--gold);display:flex;align-items:center;justify-content:center;color:var(--gold-ink)" aria-hidden="true">' +
      ICON.lock + '</div>' +
      '<h2 id="admin-modal-title" style="font-size:20px;font-weight:600;margin-bottom:6px">เข้าสู่ระบบผู้ดูแล (Admin)</h2>' +
      '<label for="admin-pin-input" style="display:block;font-size:13.5px;margin-bottom:18px;color:var(--dimmer)">กรุณากรอกรหัสผ่านเพื่อเข้าสู่ระบบจัดการบทความ</label>' +
      '<form onsubmit="return false;">' +
      '<input type="password" id="admin-pin-input" autocomplete="current-password" class="input" aria-label="รหัสผ่านผู้ดูแล" style="text-align:center;font-size:22px;letter-spacing:6px;background:var(--white);border:1px solid var(--gold-deep);border-radius:4px;padding:8px" placeholder="••••" maxlength="20" autofocus>' +
      '<div id="admin-login-err" style="color:var(--red);font-size:13px;margin-top:8px;display:none" role="alert">รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่</div>' +
      '<div style="display:flex;gap:8px;margin-top:18px">' +
      '<button class="btn btn-primary btn-block" data-act="submit-admin-login">เข้าสู่ระบบ</button>' +
      '<button class="btn btn-secondary" data-act="close-admin-login">ยกเลิก</button>' +
      '</div></form>' +
      '<div class="muted" style="font-size:11.5px;margin-top:12px">รหัสผ่านตั้งต้น: <b>1234</b></div>' +
      '</div></div></div>';
  }

  V.articles = function () {
    var cats = ['ทั้งหมด'];
    ALL_ARTICLES.forEach(function (a) {
      if (a.cat && cats.indexOf(a.cat) < 0) cats.push(a.cat);
    });

    var curCat = S.artCat || 'ทั้งหมด';
    var filtered = curCat === 'ทั้งหมด'
      ? ALL_ARTICLES
      : ALL_ARTICLES.filter(function (a) { return a.cat === curCat; });

    var adminBtn = isAdminAuth
      ? '<button class="admin-badge-btn" data-act="go" data-screen="artadmin" title="จัดการบทความ">' +
      ICON.gear + ' จัดการบทความ (หลังบ้าน)</button>'
      : '<button class="admin-badge-btn" data-act="open-admin-login" title="เข้าสู่ระบบผู้ดูแล">' +
      ICON.lock + ' ผู้ดูแลระบบ</button>';

    var headerHtml = '<div class="articles-header">' +
      '<div class="articles-toolbar">' +
      '<div class="kicker">คลังความรู้ & บทความ</div>' +
      adminBtn +
      '</div>' +
      '<h1 class="page-main-heading">คลังบทความและเกร็ดวิชาโหราศาสตร์</h1>' +
      '<div class="articles-cats" role="tablist" aria-label="หมวดหมู่บทความ">' +
      cats.map(function (c) {
        return '<button class="cat-btn' + (curCat === c ? ' active' : '') + '" role="tab" aria-selected="' + (curCat === c ? 'true' : 'false') + '" data-act="artcat" data-cat="' + esc(c) + '">' +
          esc(c) + '</button>';
      }).join('') +
      '</div></div>';

    if (!filtered.length) {
      return headerHtml +
        '<div class="empty-state" style="padding:40px 20px"><div class="orn"><i></i></div>' +
        '<h2>ยังไม่มีบทความในหมวดนี้</h2>' +
        '<p class="muted">บทความจากตำราของบรมครูโหรพัฒนากำลังจัดเตรียมอยู่</p>' +
        '</div>';
    }

    return headerHtml +
      '<div class="articles-grid">' +
      filtered.map(function (a) { return articleCard(a); }).join('') +
      '</div>';
  };

  /* ── Backend / Admin Management Screen ──────────── */
  V.artadmin = function () {
    if (!isAdminAuth) {
      return '<div class="empty-state" style="padding:48px 20px"><div class="orn"><i></i></div>' +
        '<h1 style="font-size:22px;color:var(--paper)">พื้นที่สำหรับผู้ดูแลระบบเท่านั้น</h1>' +
        '<p class="muted">คุณต้องเข้าสู่ระบบผู้ดูแลด้วยรหัสผ่านก่อนเข้าใช้งานส่วนนี้</p>' +
        '<button class="btn btn-primary" style="margin-top:14px" data-act="open-admin-login">' + ICON.lock + ' เข้าสู่ระบบ Admin</button>' +
        '<div style="margin-top:12px"><button class="linkish" data-act="go" data-screen="articles">กลับไปยังหน้ารวมบทความ</button></div>' +
        '</div>';
    }

    var ed = S.editingArticle;

    if (ed) {
      var isNew = !ed.id || ed.id === 'new';
      return '<div class="admin-panel">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid var(--gold-line);padding-bottom:10px">' +
        '<h1 style="font-size:20px;font-weight:600;margin:0">' + (isNew ? 'เพิ่มบทความใหม่' : 'แก้ไขบทความ') + '</h1>' +
        '<button class="btn btn-secondary btn-sm" data-act="cancel-edit">ยกเลิก</button>' +
        '</div>' +

        '<form onsubmit="return false;">' +
        '<div class="admin-form-group">' +
        '<label for="ed-title">ชื่อบทความ <span aria-hidden="true">*</span></label>' +
        '<input class="input" style="background:var(--white);padding:8px 12px;border:1px solid var(--gold-line);border-radius:4px" id="ed-title" required value="' + esc(ed.t || '') + '" placeholder="เช่น ศาสตร์แห่งการวางฤกษ์มงคล">' +
        '</div>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
        '<div class="admin-form-group">' +
        '<label for="ed-cat">หมวดหมู่</label>' +
        '<input class="input" style="background:var(--white);padding:8px 12px;border:1px solid var(--gold-line);border-radius:4px" id="ed-cat" value="' + esc(ed.cat || 'เกร็ดโหราศาสตร์') + '" placeholder="เกร็ดโหราศาสตร์, ฤกษ์มงคล">' +
        '</div>' +
        '<div class="admin-form-group">' +
        '<label for="ed-author">ผู้เขียน</label>' +
        '<input class="input" style="background:var(--white);padding:8px 12px;border:1px solid var(--gold-line);border-radius:4px" id="ed-author" value="' + esc(ed.author || 'บรมครูโหรพัฒนา พัฒนศิริ') + '">' +
        '</div>' +
        '</div>' +

        '<div class="admin-form-group">' +
        '<label for="ed-desc">คำโปรย / สรุปย่อ</label>' +
        '<textarea class="input" style="background:var(--white);padding:8px 12px;border:1px solid var(--gold-line);border-radius:4px;min-height:60px" id="ed-desc" placeholder="คำอธิบายสรุปสั้น ๆ ของบทความ">' + esc(ed.d || '') + '</textarea>' +
        '</div>' +

        '<div class="admin-form-group">' +
        '<label for="ed-image">รูปภาพหน้าปกบทความ (ใส่ URL หรือเลือกไฟล์จากเครื่อง)</label>' +
        '<div style="display:flex;gap:8px;align-items:center">' +
        '<input class="input" style="flex:1;background:var(--white);padding:8px 12px;border:1px solid var(--gold-line);border-radius:4px" id="ed-image" value="' + esc(ed.image || '') + '" placeholder="assets/site/lesson-1.jpg หรือ https://...">' +
        '<label class="file-upload-btn">' +
        '<input type="file" id="ed-file" accept="image/*" style="display:none" onchange="window.HP_HANDLE_UPLOAD(this)">' +
        ICON.folder + ' <span>เลือกรูปภาพ</span>' +
        '</label>' +
        '</div>' +
        (ed.image ? '<img id="ed-preview" class="admin-img-preview" src="' + esc(ed.image) + '" alt="ตัวอย่างรูปภาพ">' : '<img id="ed-preview" class="admin-img-preview" style="display:none" alt="ตัวอย่างรูปภาพ">') +
        '</div>' +

        '<div class="admin-form-group">' +
        '<label for="ed-content">เนื้อหาบทความ (สามารถใส่หลายย่อหน้า หรือคั่นหัวข้อด้วย ###)</label>' +
        '<textarea class="input" style="background:var(--white);padding:10px 12px;border:1px solid var(--gold-line);border-radius:4px;min-height:160px;line-height:1.6" id="ed-content" placeholder="พิมพ์เนื้อหาที่นี่...">' +
        esc(ed.rawContent || (ed.secs ? ed.secs.map(function (s) { return (s.h ? '### ' + s.h + '\n' : '') + s.p; }).join('\n\n') : '')) +
        '</textarea>' +
        '</div>' +

        '<div style="display:flex;gap:10px;margin-top:20px">' +
        '<button class="btn btn-primary btn-block" data-act="save-article">บันทึกบทความ</button>' +
        '<button class="btn btn-secondary" data-act="cancel-edit">ยกเลิก</button>' +
        '</div>' +
        '</form></div>';
    }

    var exportCode = 'const ARTICLES = ' + JSON.stringify(ALL_ARTICLES, null, 2) + ';';

    return '<div style="padding:var(--s-4) var(--s-5)"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">' +
      '<div><h1 style="font-size:22px;font-weight:700;margin:0">จัดการบทความ (Admin)</h1><div class="row-sub">ทั้งหมด ' + ALL_ARTICLES.length + ' บทความ · เข้าสู่ระบบแล้ว</div></div>' +
      '<div style="display:flex;gap:8px">' +
      '<button class="btn btn-primary btn-sm" data-act="new-article">' + ICON.plus + ' เพิ่มบทความ</button>' +
      '<button class="btn btn-secondary btn-sm" data-act="admin-logout" title="ออกจากระบบ Admin">ออกจากระบบ</button>' +
      '</div></div>' +

      '<div class="block" style="background:var(--white);border-radius:var(--r-md);margin-bottom:16px;padding:0 var(--s-4)">' +
      ALL_ARTICLES.map(function (a, idx) {
        return '<div class="admin-row">' +
          '<div style="min-width:0;flex:1">' +
          '<div style="font-size:12px;color:var(--gold-ink);font-weight:600">' + esc(a.cat || 'บทความ') + '</div>' +
          '<div style="font-weight:600;font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(a.t) + '</div>' +
          '<div class="muted" style="font-size:12px">' + esc(a.meta || a.author || '') + '</div>' +
          '</div>' +
          '<div class="admin-acts">' +
          '<button class="btn btn-secondary btn-sm" data-act="openart" data-id="' + esc(a.id) + '" aria-label="ดูตัวอย่างบทความ ' + esc(a.t) + '" title="ดูตัวอย่าง">ดู</button>' +
          '<button class="btn btn-secondary btn-sm" data-act="edit-article" data-id="' + esc(a.id) + '" aria-label="แก้ไขบทความ ' + esc(a.t) + '" title="แก้ไข">' + ICON.edit + '</button>' +
          '<button class="btn btn-danger btn-sm" data-act="del-article" data-id="' + esc(a.id) + '" aria-label="ลบบทความ ' + esc(a.t) + '" title="ลบ">' + ICON.trash + '</button>' +
          '</div></div>';
      }).join('') +
      '</div>' +

      '<div class="block" style="background:var(--gold-wash);border-radius:var(--r-md)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
      '<div style="font-weight:600;font-size:15px;color:var(--paper)">' + ICON.code + ' ส่งออกโค้ดนำไปใส่ใน data.js</div>' +
      '<button class="btn btn-secondary btn-sm" data-act="copy-export">คัดลอกโค้ด</button>' +
      '</div>' +
      '<p class="muted" style="font-size:13px">หากต้องการบันทึกบทความให้คงอยู่ถาวรในโปรเจกต์ สามารถกดคัดลอกโค้ดด้านล่างนี้ แล้วนำไปวางแทนที่ตัวแปร ARTICLES ในไฟล์ data.js ได้ทันที</p>' +
      '<textarea class="code-export-box" id="export-code-box" aria-label="โค้ด JavaScript สำหรับ data.js" readonly>' + esc(exportCode) + '</textarea>' +
      '</div>' +

      '<div style="margin-top:16px;text-align:center">' +
      '<button class="btn btn-secondary btn-block" data-act="go" data-screen="articles">กลับไปยังหน้ารวมบทความ</button>' +
      '</div></div>';
  };

  V.videos = function () {
    return '<h1 class="sec-title" style="margin-top:0">วิดีโอถ่ายทอดวิชาโหราศาสตร์</h1>' +
      VIDEOS.map(function (v) {
        return '<div class="video-row" role="button" tabindex="0" aria-label="วิดีโอ ' + esc(v.t) + '"><div class="video-thumb"><img src="' + esc(MEDIA.ytThumb) +
          '" alt="ภาพตัวอย่างวิดีโอ ' + esc(v.t) + '" loading="lazy">' + ICON.play + '</div><div class="row-main">' +
          '<div class="video-title">' + esc(v.t) + '</div><div class="row-sub">' + esc(v.meta) + '</div></div></div>';
      }).join('') +
      '<div class="stack"><a class="btn btn-secondary btn-block" href="https://www.youtube.com/" target="_blank" rel="noopener">ไปยังช่อง YouTube</a></div>';
  };

  V.teacher = function () {
    return '<div class="teacher-hero"><img src="' + esc(TEACHER.photo) +
      '" alt="อาจารย์' + esc(TEACHER.name) + '" width="760" height="1047"></div>' +
      '<div style="padding:18px 16px;border-bottom:1px solid var(--gold-hair)">' +
      '<img src="logo.png" width="66" height="66" alt="ตราบรมครูโหรพัฒนา" style="border-radius:50%;margin-bottom:12px;box-shadow:0 0 0 1px var(--gold),0 0 0 4px color-mix(in srgb,var(--gold) 20%,var(--white))">' +
      '<h1 style="font-size:27px">บรมครูโหรพัฒนา พัฒนศิริ</h1>' +
      '<div class="row-sub">โหราจารย์ · ดูดวง ดูฤกษ์ ฮวงจุ้ย และพิธีมงคล</div>' +
      '<p style="margin:12px 0 0;font-size:14px;line-height:1.75">ด้วยประสบการณ์กว่า ๔๐ ปี ท่านอุทิศตนถ่ายทอดวิชาผ่านการสอนและงานเขียน หล่อหลอมความรู้และประสบการณ์สู่ลูกศิษย์และผู้สนใจ ตลอดจนวาระสุดท้าย</p></div>' +
      '<h2 class="sec-title">ประสบการณ์และผลงาน</h2>' +
      TEACHER.timeline.map(function (m) {
        return '<div class="row-static"><div class="row-main"><div class="row-title" style="font-size:15px">' +
          esc(m.k) + '</div><div class="row-sub">' + esc(m.t) + '</div></div></div>';
      }).join('') +
      /* The daughter who carries the practice on — published on เกี่ยวกับเรา. */
      '<h2 class="sec-title">เกี่ยวกับ อาจารย์ฉัตร</h2>' +
      '<p class="muted" style="padding:0 var(--s-5);text-align:center">' + esc(INTRO.successor) + '</p>' +
      '<div style="padding:0 var(--s-5) var(--s-4)"><div class="row-title">' + esc(SUCCESSOR.name) + '</div>' +
      '<div class="row-sub">' + esc(SUCCESSOR.role) + '</div>' +
      '<p class="muted" style="margin:10px 0 0">' + esc(SUCCESSOR.bio) + '</p></div>' +
      '<h2 class="sec-title">บทบาทและความถนัด</h2>' +
      SUCCESSOR.points.map(function (m) {
        return '<div class="row-static"><div class="row-main"><div class="row-title" style="font-size:15px">' +
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
      ['บทความโหราศาสตร์', ALL_ARTICLES.length + ' เรื่อง พร้อมอ่าน', 'go', 'articles']
    ];
    if (isAdminAuth) {
      rows.push(['จัดการบทความ (Admin)', 'เพิ่ม แก้ไข ลบ บทความ', 'go', 'artadmin']);
    }
    rows.push(
      ['นัดปรึกษา', b.done ? b.svc + ' · ' + b.slot : 'ยังไม่มีนัด', 'go', 'booking'],
      ['ประวัติอาจารย์พัฒนา', 'ที่มาของตำราที่ใช้สอน', 'go', 'teacher'],
      ['ติดต่อเรา', 'โทร 084 943 1133 · ไลน์ 0849431133', 'go', 'teacher']
    );
    return '<h1 class="sec-title" style="margin-top:0">บันทึกความคืบหน้าการศึกษา</h1>' +
      '<div class="me-head"><div class="avatar" aria-hidden="true">ศน</div><div><h2 style="font-size:19px;margin:0;color:var(--paper)">ศิษย์ใหม่</h2>' +
      '<div class="row-sub">' + esc(birthLine()) + '</div></div></div>' +
      '<div class="block"><div style="display:flex;justify-content:space-between;align-items:baseline">' +
      '<div class="block-title" style="margin:0">ความคืบหน้าบทเรียน</div><div class="num">' + p.pct + '</div></div>' +
      '<div class="progress" style="margin-top:10px"><span style="width:' + p.pct + '"></span></div>' +
      '<div class="chips-progress" role="group" aria-label="ความคืบหน้าบทเรียน ๑ ถึง ๙">' + LESSONS.map(function (l, i) {
        return '<button class="' + (S.done.indexOf(i) >= 0 ? 'done' : '') + '" data-act="lesson" data-i="' + i + '" aria-label="บทที่ ' + esc(l.n) + (S.done.indexOf(i) >= 0 ? ' เรียนแล้ว' : '') + '">' + esc(l.n) + '</button>';
      }).join('') + '</div></div>' +
      rows.map(function (r) {
        var attrs = r[2] === 'tab' ? ' data-act="tab" data-tab="' + r[3] + '" data-screen="' + r[4] + '"' : ' data-act="go" data-screen="' + r[3] + '"';
        return '<div class="row"' + attrs + ' role="button" tabindex="0" aria-label="' + esc(r[0]) + ': ' + esc(r[1]) + '"><div class="row-main"><div class="row-title" style="font-size:15px">' + esc(r[0]) + '</div>' +
          '<div class="row-sub">' + esc(r[1]) + '</div></div>' + ICON.chev + '</div>';
      }).join('') +
      '';
  };

  V.search = function () {
    var q = S.q.trim();
    var pool = LESSONS.map(function (l, i) { return { kind: 'บทเรียน ' + l.n, t: l.t, d: l.d, act: 'lesson', i: i }; })
      .concat(ALL_ARTICLES.map(function (a) { return { kind: 'บทความ · ' + (a.cat || 'ทั่วไป'), t: a.t, d: a.d, act: 'openart', id: a.id }; }))
      .concat(PLANETS.slice(0, 7).map(function (p) { return { kind: 'ดาวพระเคราะห์', t: p.name + ' (' + p.n + ')', d: 'เกษตร: ' + p.home, act: 'lesson', i: 1 }; }));
    var res = q ? pool.filter(function (r) { return (r.t + r.d + r.kind).indexOf(q) >= 0; }).slice(0, 12) : pool.slice(0, 6);
    return '<h1 class="sec-title" style="margin-top:0">ค้นหาตำรา ดาว และบทความ</h1>' +
      '<div class="block"><label for="search-box" class="sr-only">ค้นหาบทเรียน ดาว ราศี ฤกษ์ บทความ</label><input class="input" id="search-box" data-bind="q" data-live="1" placeholder="ค้นหาบทเรียน ดาว ราศี ฤกษ์ บทความ" aria-label="ค้นหาบทเรียน ดาว ราศี ฤกษ์ บทความ" value="' + esc(S.q) + '">' +
      '<div class="chips">' + ['ลัคนา', 'เกษตร', 'ภูมิทักษา', 'ราหู', 'ฤกษ์แต่งงาน', 'ดาวพระเคราะห์'].map(function (t) {
        return '<span class="tag tag-outline chip" role="button" tabindex="0" aria-label="ค้นหาคำว่า ' + esc(t) + '" data-act="suggest" data-t="' + esc(t) + '">' + esc(t) + '</span>';
      }).join('') + '</div></div>' +
      res.map(function (r) {
        var attrs = r.act === 'lesson'
          ? ' data-act="lesson" data-i="' + r.i + '"'
          : (r.act === 'openart' ? ' data-act="openart" data-id="' + r.id + '"' : ' data-act="go" data-screen="' + r.screen + '"');
        return '<div class="article"' + attrs + ' role="button" tabindex="0" aria-label="' + esc(r.t) + '"><div class="card-kicker">' + esc(r.kind) + '</div>' +
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

  /* Thai numerals are the app's own counting system, so a figure that counts
     up should count in them rather than flipping to Arabic on the way. */
  var TH_NUM = '๐๑๒๓๔๕๖๗๘๙';
  function thaiToInt(str) {
    var out = '';
    String(str).split('').forEach(function (ch) {
      var i = TH_NUM.indexOf(ch);
      if (i >= 0) out += i; else if (/[0-9]/.test(ch)) out += ch;
    });
    return out === '' ? null : parseInt(out, 10);
  }
  function intToThai(n) {
    return String(n).split('').map(function (d) { return TH_NUM[+d]; }).join('');
  }
  /* Figures tick up on arrival; the suffix (+) is preserved. */
  function countUp(main) {
    if (reduced()) return;
    main.querySelectorAll('.stat-n').forEach(function (el, idx) {
      var raw = el.textContent, target = thaiToInt(raw);
      if (target === null || target > 999) return;
      var suffix = raw.replace(/[๐-๙0-9]/g, '');
      var dur = 900, start = null, delay = 140 + idx * 90;
      el.textContent = intToThai(0) + suffix;
      setTimeout(function step(ts) {
        if (typeof ts !== 'number') { requestAnimationFrame(step); return; }
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = intToThai(Math.round(target * eased)) + suffix;
        if (t < 1) requestAnimationFrame(step);
      }, delay);
    });
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
    if (last) last.finished.then(function () { w.classList.remove('is-drawing'); }, function () { });
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
    applyFontSize();
    applyTheme();
    var head = HEADS[S.screen] || HEADS.home;
    if (S.screen === 'reader') head = ['บทที่ ' + LESSONS[S.lesson].n, LESSONS[S.lesson].t];
    var activeTabs = TABS_DEFAULT.slice();
    if (isAdminAuth) {
      activeTabs.splice(3, 0, ['artadmin', 'หลังบ้าน (Admin)', 'artadmin']);
    }

    var curTheme = S.theme || 'midnight';
    var themeControlHtml = '<div class="theme-ctrl" role="group" aria-label="ปรับบรรยากาศสี">' +
      '<button class="theme-btn' + (curTheme === 'midnight' ? ' is-active' : '') + '" data-act="set-theme" data-theme="midnight" aria-label="โหมดรัตติกาลทองคำ" aria-pressed="' + (curTheme === 'midnight') + '" title="รัตติกาลทองคำ">' + ICON.moon + '</button>' +
      '<button class="theme-btn' + (curTheme === 'candle' ? ' is-active' : '') + '" data-act="set-theme" data-theme="candle" aria-label="โหมดแสงเทียนอบอุ่น" aria-pressed="' + (curTheme === 'candle') + '" title="แสงเทียนอบอุ่น">' + ICON.candle + '</button>' +
      '<button class="theme-btn' + (curTheme === 'sand' ? ' is-active' : '') + '" data-act="set-theme" data-theme="sand" aria-label="โหมดทรายทองคำ" aria-pressed="' + (curTheme === 'sand') + '" title="ทรายทองคำ">' + ICON.sun + '</button>' +
      '</div>';

    var fontControlHtml = '<div class="font-ctrl" role="group" aria-label="ปรับขนาดตัวอักษร">' +
      '<button class="font-btn' + (S.fontSize === 'normal' ? ' is-active' : '') + '" data-act="set-font" data-size="normal" aria-label="ขนาดตัวอักษรปกติ" aria-pressed="' + (S.fontSize === 'normal') + '" title="ขนาดปกติ">ก</button>' +
      '<button class="font-btn' + (S.fontSize === 'md' ? ' is-active' : '') + '" data-act="set-font" data-size="md" style="font-size:15px" aria-label="ขนาดตัวอักษรใหญ่" aria-pressed="' + (S.fontSize === 'md') + '" title="ขนาดใหญ่">ก+</button>' +
      '<button class="font-btn' + (S.fontSize === 'lg' ? ' is-active' : '') + '" data-act="set-font" data-size="lg" style="font-size:17px" aria-label="ขนาดตัวอักษรใหญ่พิเศษ" aria-pressed="' + (S.fontSize === 'lg') + '" title="ขนาดใหญ่พิเศษ">ก++</button>' +
      '</div>';

    var appClass = 'app' + (S.fontSize === 'md' ? ' font-md' : (S.fontSize === 'lg' ? ' font-lg' : ''));
    var isSubScreen = S.stack.length > 0 || S.screen !== 'home';
    var screenTitle = S.screen === 'home' ? 'สถาบันโหรพัฒนา' : (head[1] || head[0]);
    if (S.screen === 'reader' && LESSONS[S.lesson]) {
      screenTitle = 'บทที่ ' + LESSONS[S.lesson].n + ' · ' + LESSONS[S.lesson].t;
    }

    var tabIcons = {
      home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      lessons: ICON.scripture,
      articles: ICON.wisdom,
      chart: ICON.chart,
      ruek: ICON.calendar,
      courses: ICON.school,
      teacher: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      me: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 012-2h6a2 2 0 012 2v1.662"/></svg>',
      artadmin: ICON.gear
    };

    var html = '<div class="' + appClass + '">' +
      '<header class="miniapp-bar">' +
      '<div class="miniapp-bar-inner">' +
      '<div class="miniapp-left">' +
      (isSubScreen
        ? '<button class="miniapp-back-btn" data-act="back" aria-label="ย้อนกลับ">' + ICON.back + '</button>'
        : '<img class="miniapp-logo" src="logo.png" width="30" height="30" alt="ตราบรมครูโหรพัฒนา">') +
      '<div class="miniapp-title-wrap">' +
      '<span class="miniapp-title">' + esc(screenTitle) + '</span>' +
      '</div></div>' +
      '<div class="miniapp-right">' +
      '<button class="icon-btn search-btn" data-act="go" data-screen="search" aria-label="ค้นหา" title="ค้นหา">' + ICON.search + '</button>' +
      fontControlHtml +
      themeControlHtml +
      '</div></div></header>' +
      '<main id="main-content" class="app-main" tabindex="-1">' +
      '<div class="main-container">' + (V[S.screen] || V.home)() + '</div>' +
      '</main>' +
      articleModal() + adminLoginModal() + planetInspectorSheet() + '</div>';
    var root = document.getElementById('app');
    var scroll = root.querySelector('.app-main');
    var y = scroll ? scroll.scrollTop : 0;
    var keep = S.screen === 'search' && document.activeElement && document.activeElement.dataset.bind === 'q';
    /* Re-rendering the same view in place (ticking a lesson, picking a slot)
       keeps its scroll position; moving to a new view starts at the top. */
    var view = S.screen + (S.screen === 'reader' ? '/' + S.lesson : '') + (S.activeArticleId ? '/art-' + S.activeArticleId : '');
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
    /* Trigger corner cycle loading animation briefly on view change */
    if (!sameView) {
      announce('แสดงหน้า ' + head[1]);
      var loader = root.querySelector('#corner-loader');
      if (loader) {
        loader.classList.add('is-active');
        setTimeout(function () { loader.classList.remove('is-active'); }, 380);
      }
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
      if (!sameView) countUp(m);
      if (!sameView || replayChart) { drawWheel(m); revealSquare(m); }
    }
    replayChart = false;
    navDir = 'tab';
    lastView = view;
    wireMarquee(root);
    initLazyImages(root);
    save();
  }

  /* File upload helper for image upload in backend editor */
  window.HP_HANDLE_UPLOAD = function (input) {
    if (!input.files || !input.files[0]) return;
    var file = input.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var base64 = e.target.result;
      var imgInput = document.getElementById('ed-image');
      var preview = document.getElementById('ed-preview');
      if (imgInput) imgInput.value = base64;
      if (preview) {
        preview.src = base64;
        preview.style.display = 'block';
      }
      if (S.editingArticle) S.editingArticle.image = base64;
    };
    reader.readAsDataURL(file);
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (inspectingPlanet) { closePlanetDetail(); return; }
      if (S.activeArticleId) { closeArticleModal(); return; }
      if (S.showAdminLogin) { closeAdminLogin(); return; }
    }

    /* Modal focus trapping for WCAG 2.1.2 */
    var openModal = document.querySelector('.art-modal-dialog, .sheet-card');
    if (openModal && e.key === 'Tab') {
      var focusable = openModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length > 0) {
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    /* Global keyboard activation for [data-act] elements (WCAG 2.1.1) */
    if (e.key === 'Enter' || e.key === ' ') {
      var target = e.target;
      if (target && target.matches && target.matches('[data-act], [data-act] *')) {
        var el = target.closest('[data-act]');
        if (el && el.tagName !== 'BUTTON' && el.tagName !== 'A' && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && el.tagName !== 'SELECT') {
          e.preventDefault();
          el.click();
        }
      }
    }
  });

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.dataset.act;
    if (act === 'back') { stopTts(); return back(); }
    if (act === 'go') { stopTts(); return go(el.dataset.screen); }
    if (act === 'tab') { stopTts(); return pickTab(el.dataset.tab, el.dataset.screen); }
    if (act === 'toggle-candle-mode') {
      S.candleMode = !S.candleMode;
      save();
      applyTheme();
      return render();
    }
    if (act === 'print-lesson') {
      window.print();
      return;
    }
    if (act === 'set-theme') {
      S.theme = el.dataset.theme || 'midnight';
      applyTheme();
      save();
      return render();
    }
    if (act === 'set-font') {
      S.fontSize = el.dataset.size || 'normal';
      applyFontSize();
      return render();
    }
    if (act === 'lesson') { stopTts(); return openLesson(+el.dataset.i); }
    if (act === 'done') {
      if (S.done.indexOf(S.lesson) < 0) S.done.push(S.lesson);
      return render();
    }
    /* Switching chart style re-renders the same view, so the draw has to be
       asked for explicitly or the new chart would just appear. */
    if (act === 'cstyle') { S.chartStyle = el.dataset.t; replayChart = true; return render(); }
    if (act === 'cast') { replayChart = true; S.chartDone = true; announce('คำนวณแผนภูมิดวงชะตาเรียบร้อยแล้ว'); return render(); }
    if (act === 'calday') { S.calDay = +el.dataset.d; return render(); }
    if (act === 'calPrev') {
      S.calMonth--;
      if (S.calMonth < 0) { S.calMonth = 11; S.calYear--; }
      S.calDay = 1;
      return render();
    }
    if (act === 'calNext') {
      S.calMonth++;
      if (S.calMonth > 11) { S.calMonth = 0; S.calYear++; }
      S.calDay = 1;
      return render();
    }
    if (act === 'copy-day-ruek') {
      return copyDayRuek(+el.dataset.d);
    }
    if (act === 'inspect-planet') {
      return openPlanetDetail(+el.dataset.idx);
    }
    if (act === 'close-planet' || act === 'close-planet-bg') {
      if (act === 'close-planet-bg' && e.target !== el) return;
      return closePlanetDetail();
    }
    if (act === 'tts-toggle') {
      return toggleTts(el.dataset.scope);
    }
    if (act === 'tts-speed') {
      return setTtsSpeed(el.dataset.speed, el.dataset.scope);
    }
    if (act === 'svc') { S.booking.svc = el.dataset.t; return render(); }
    if (act === 'slot') { S.booking.slot = el.dataset.t; return render(); }
    if (act === 'confirm') { S.booking.done = true; return render(); }
    if (act === 'rebook') { S.booking.done = false; S.booking.slot = null; return render(); }
    if (act === 'suggest') { S.q = el.dataset.t; return render(); }

    /* ── Article interactions ────────────────────────── */
    if (act === 'openart') {
      return openArticle(el.dataset.id);
    }
    if (act === 'closeart' || act === 'closeart-bg') {
      if (act === 'closeart-bg' && e.target !== el) return;
      return closeArticleModal();
    }
    if (act === 'artcat') {
      S.artCat = el.dataset.cat;
      return render();
    }

    /* ── Admin Login & Auth interactions ────────────── */
    if (act === 'open-admin-login') {
      S.showAdminLogin = true;
      return render();
    }
    if (act === 'close-admin-login' || act === 'close-admin-login-bg') {
      if (act === 'close-admin-login-bg' && e.target !== el) return;
      S.showAdminLogin = false;
      return render();
    }
    if (act === 'submit-admin-login') {
      var pinEl = document.getElementById('admin-pin-input');
      var errEl = document.getElementById('admin-login-err');
      var pinVal = pinEl ? pinEl.value.trim() : '';
      if (pinVal === ADMIN_PASS || pinVal === 'horapatana2026') {
        isAdminAuth = true;
        try { sessionStorage.setItem('hp.is_admin', 'true'); } catch (e) { }
        S.showAdminLogin = false;
        S.screen = 'artadmin';
        S.tab = 'artadmin';
        return render();
      } else {
        if (errEl) errEl.style.display = 'block';
        if (pinEl) { pinEl.value = ''; pinEl.focus(); }
        return;
      }
    }
    if (act === 'admin-logout') {
      if (confirm('คุณต้องการออกจากระบบผู้ดูแลใช่หรือไม่?')) {
        isAdminAuth = false;
        try { sessionStorage.removeItem('hp.is_admin'); } catch (e) { }
        S.screen = 'articles';
        S.tab = 'articles';
        return render();
      }
      return;
    }

    /* ── Admin interactions ─────────────────────────── */
    if (act === 'new-article') {
      if (!isAdminAuth) return;
      S.editingArticle = {
        id: 'art-' + Date.now(),
        t: '',
        cat: 'เกร็ดโหราศาสตร์',
        d: '',
        author: 'บรมครูโหรพัฒนา พัฒนศิริ',
        meta: 'บทความใหม่ · ๕ นาที',
        image: 'assets/site/lesson-1.jpg',
        secs: []
      };
      return render();
    }
    if (act === 'edit-article') {
      var targetId = el.dataset.id;
      var found = ALL_ARTICLES.filter(function (x) { return x.id === targetId; })[0];
      if (found) {
        S.editingArticle = JSON.parse(JSON.stringify(found));
        return render();
      }
    }
    if (act === 'cancel-edit') {
      S.editingArticle = null;
      return render();
    }
    if (act === 'del-article') {
      var delId = el.dataset.id;
      if (confirm('คุณต้องการลบบทความนี้ใช่หรือไม่?')) {
        ALL_ARTICLES = ALL_ARTICLES.filter(function (x) { return x.id !== delId; });
        saveArticles();
        if (S.activeArticleId === delId) S.activeArticleId = null;
        return render();
      }
      return;
    }
    if (act === 'save-article') {
      var titleInput = document.getElementById('ed-title');
      var catInput = document.getElementById('ed-cat');
      var authorInput = document.getElementById('ed-author');
      var descInput = document.getElementById('ed-desc');
      var imgInput = document.getElementById('ed-image');
      var contentInput = document.getElementById('ed-content');

      var titleVal = titleInput ? titleInput.value.trim() : '';
      if (!titleVal) {
        alert('กรุณากรอกชื่อบทความ');
        if (titleInput) titleInput.focus();
        return;
      }

      var rawContent = contentInput ? contentInput.value.trim() : '';
      var parsedSecs = [];
      if (rawContent) {
        var blocks = rawContent.split(/\n\s*###\s*/);
        blocks.forEach(function (b, idx) {
          b = b.trim();
          if (!b) return;
          if (idx === 0 && !rawContent.startsWith('###')) {
            var firstLines = b.split('\n');
            var firstH = firstLines[0].replace(/^###\s*/, '').trim();
            var firstP = firstLines.slice(1).join('\n').trim() || firstH;
            if (firstLines.length > 1) {
              parsedSecs.push({ h: firstH, p: firstP });
            } else {
              parsedSecs.push({ h: 'บทนำ', p: b });
            }
          } else {
            var lines = b.split('\n');
            var header = lines[0].trim();
            var body = lines.slice(1).join('\n').trim();
            parsedSecs.push({ h: header, p: body || header });
          }
        });
      }

      var edItem = {
        id: S.editingArticle.id || ('art-' + Date.now()),
        t: titleVal,
        cat: catInput ? catInput.value.trim() || 'ทั่วไป' : 'ทั่วไป',
        author: authorInput ? authorInput.value.trim() : 'บรมครูโหรพัฒนา พัฒนศิริ',
        d: descInput ? descInput.value.trim() : '',
        image: imgInput ? imgInput.value.trim() : '',
        meta: (new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })) + ' · ๕ นาที',
        secs: parsedSecs.length ? parsedSecs : [{ h: 'เนื้อหา', p: descInput ? descInput.value.trim() : '' }]
      };

      var existingIdx = -1;
      for (var k = 0; k < ALL_ARTICLES.length; k++) {
        if (ALL_ARTICLES[k].id === edItem.id) { existingIdx = k; break; }
      }
      if (existingIdx >= 0) {
        ALL_ARTICLES[existingIdx] = edItem;
      } else {
        ALL_ARTICLES.unshift(edItem);
      }

      saveArticles();
      S.editingArticle = null;
      alert('บันทึกบทความเรียบร้อยแล้ว');
      return render();
    }
    if (act === 'copy-export') {
      var box = document.getElementById('export-code-box');
      if (box) {
        box.select();
        navigator.clipboard.writeText(box.value).then(function () {
          alert('คัดลอกโค้ด JavaScript สำหรับ data.js เรียบร้อยแล้ว!');
        }).catch(function () {
          alert('กรุณาคัดลอกจากกล่องข้อความ');
        });
      }
    }
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

