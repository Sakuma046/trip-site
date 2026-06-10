/* ========================================
   WAKWAKweek 2026 - script.js
   ======================================== */

// ========================================
// お知らせデータ（初期データ）
// localStorageに保存済みがあればそちらを優先
// ========================================
const DEFAULT_NOTICES = [
  {
    id: 1,
    date: '2026.06.10',
    badge: 'badge-new',
    label: 'NEW',
    title: 'WAKWAKweek 2026 サイトをオープンしました🎆',
    body: `WAKWAKweek 2026 の公式サイトをオープンしました！\n\n今年も夏休み特別企画「夏だ！花火だ！旅行だ！WAKWAKweek」を開催します。\nサイトでは旅程やスケジュールなど随時情報を更新していきます。お楽しみに！`,
  },
  {
    id: 2,
    date: '2026.06.10',
    badge: 'badge-info',
    label: 'INFO',
    title: '今年の行き先が決定しました！',
    body: `今年の行き先は以下の2か所に決定しました！\n\n🏔️ DESTINATION 01 — 栃木県・那須高原\n緑と温泉の高原リゾート。涼しい夏をのんびりと満喫します。\n\n🎆 DESTINATION 02 — 山形県鶴岡・赤川花火大会\n東北が誇る大花火大会。夜空いっぱいに広がる大輪の花火を一緒に見上げましょう！`,
  },
  {
    id: 3,
    date: 'TBD',
    badge: 'badge-update',
    label: '準備中',
    title: '旅程・スケジュールの詳細は追って決定いたします',
    body: `現在、旅程・スケジュールの詳細を調整中です。\n\n決定次第このサイトでお知らせします。\nもうしばらくお待ちください！`,
  },
];

const STORAGE_KEY = 'wakwak2026_notices';

function loadNotices() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_NOTICES;
  } catch {
    return DEFAULT_NOTICES;
  }
}

// ========================================
// PASSWORD
// ========================================
const CORRECT_PASSWORD = 'wakwak2026';

function checkPassword() {
  const val = document.getElementById('pw-input').value;
  if (val === CORRECT_PASSWORD) {
    document.getElementById('pw-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    renderNotices();
    initFireworks();
    initScrollReveal();
  } else {
    const err = document.getElementById('pw-error');
    err.textContent = 'パスワードが違います';
    document.getElementById('pw-input').value = '';
    document.getElementById('pw-input').focus();
    setTimeout(() => { err.textContent = ''; }, 2500);
  }
}

document.getElementById('pw-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkPassword();
});

// ========================================
// お知らせ一覧をDOMに描画
// ========================================
function renderNotices() {
  const notices = loadNotices();
  const list = document.getElementById('notice-list');
  if (!list) return;

  list.innerHTML = notices.map(n => `
    <div class="notice-item reveal" onclick="openNotice(${n.id})">
      <span class="notice-date">${n.date}</span>
      <span class="notice-badge ${n.badge}">${n.label}</span>
      <p class="notice-text">${n.title}</p>
      <span class="notice-arrow">›</span>
    </div>
  `).join('');

  // 新しく追加されたreveal要素を監視
  document.querySelectorAll('#notice-list .reveal').forEach(el => {
    noticeObserver && noticeObserver.observe(el);
  });
}

let noticeObserver = null;

// ========================================
// ページナビゲーション
// ========================================
function openPage(id) {
  document.getElementById('page-' + id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePage() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-logo, .footer-logo').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      closePage();
      const main = document.getElementById('main-content');
      if (main && main.style.display !== 'none') {
        document.getElementById('top').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// ========================================
// お知らせ詳細
// ========================================
function openNotice(id) {
  const notices = loadNotices();
  const notice = notices.find(n => n.id === id);
  if (!notice) return;

  const page = document.getElementById('page-notice');
  page.querySelector('.page-title').textContent = notice.title;
  page.querySelector('.notice-detail-date').textContent = notice.date;

  const badgeEl = page.querySelector('.notice-detail-badge');
  badgeEl.className = `notice-badge ${notice.badge} notice-detail-badge`;
  badgeEl.textContent = notice.label;

  page.querySelector('.notice-detail-body').innerHTML =
    notice.body.replace(/\n/g, '<br>');

  page.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ========================================
// FIREWORKS
// ========================================
function initFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    ['#FFD060','#FFAA00'],
    ['#FF6B9D','#FF3366'],
    ['#4FC3F7','#0288D1'],
    ['#7EE8A2','#00C853'],
    ['#E0B4FF','#AB47BC'],
  ];

  class Particle {
    constructor(x, y, color) {
      this.x = x; this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = Math.random() * 0.014 + 0.01;
      this.size  = Math.random() * 2.5 + 1;
      this.tail  = [];
    }
    update() {
      this.tail.push({ x: this.x, y: this.y, alpha: this.alpha });
      if (this.tail.length > 6) this.tail.shift();
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.06;
      this.vx *= 0.99;
      this.alpha -= this.decay;
    }
    draw() {
      for (let i = 0; i < this.tail.length; i++) {
        const t = this.tail[i];
        ctx.globalAlpha = Math.max(0, (i / this.tail.length) * t.alpha * 0.35);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  class Rocket {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      this.y = canvas.height + 10;
      this.targetY = Math.random() * canvas.height * 0.5 + 50;
      this.speed = Math.random() * 4 + 6;
      this.colorPair = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.trail = [];
      this.done = false;
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 10) this.trail.shift();
      this.y -= this.speed;
      if (this.y <= this.targetY) { this.explode(); this.done = true; }
    }
    explode() {
      const count = Math.floor(Math.random() * 60) + 80;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(this.x, this.y, this.colorPair[Math.floor(Math.random() * 2)]));
      }
    }
    draw() {
      for (let i = 0; i < this.trail.length; i++) {
        ctx.globalAlpha = (i / this.trail.length) * 0.6;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.trail[i].x, this.trail[i].y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  let rockets = [], particles = [];
  let lastLaunch = 0;

  function loop(ts) {
    ctx.fillStyle = 'rgba(7,13,42,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (ts - lastLaunch > 1800) {
      const n = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < n; i++) rockets.push(new Rocket());
      lastLaunch = ts;
    }
    rockets = rockets.filter(r => { r.update(); r.draw(); return !r.done; });
    particles = particles.filter(p => { p.update(); p.draw(); return p.alpha > 0; });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// ========================================
// SCROLL REVEAL
// ========================================
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  noticeObserver = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        noticeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => noticeObserver.observe(el));
}
