// --- header scroll state ---
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive:true });

// --- scroll reveal ---
const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// --- neural mesh canvas ---
const canvas = document.getElementById('mesh');
const ctx = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let w, h, points = [];
const POINT_COUNT_BASE = 70;

function resize(){
  w = canvas.width = canvas.offsetWidth * devicePixelRatio;
  h = canvas.height = canvas.offsetHeight * devicePixelRatio;
}

function initPoints(){
  const count = Math.min(110, Math.max(40, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 16000)));
  points = Array.from({length: count}).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
    vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio
  }));
}

let mouse = { x: -9999, y: -9999 };
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - rect.left) * devicePixelRatio;
  mouse.y = (e.clientY - rect.top) * devicePixelRatio;
});
canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

function step(){
  ctx.clearRect(0,0,w,h);
  const linkDist = 130 * devicePixelRatio;

  for (const p of points) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 110 * devicePixelRatio) {
      const force = (1 - dist / (110 * devicePixelRatio)) * 0.6;
      p.x += (dx / (dist || 1)) * force;
      p.y += (dy / (dist || 1)) * force;
    }
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i], b = points[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < linkDist) {
        ctx.strokeStyle = `rgba(255,255,255,${(1 - dist/linkDist) * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  for (const p of points) {
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.6 * devicePixelRatio, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!reducedMotion) requestAnimationFrame(step);
}

function setup(){
  resize();
  initPoints();
  ctx.clearRect(0,0,w,h);
  if (!reducedMotion) {
    requestAnimationFrame(step);
  } else {
    // draw a single static frame
    step();
  }
}
window.addEventListener('resize', () => { resize(); initPoints(); });
setup();

// --- typed.js ---
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Typed !== 'undefined') {
    new Typed('#typed-role', {
      strings: ["turning raw data into decisions.","Python · SQL · Machine Learning.","building models and products.","at the intersection of AI engineering and data."],
      typeSpeed: 50,
      backSpeed: 25,
      backDelay: 1800,
      loop: true,
      smartBackspace: true
    });
  }
});