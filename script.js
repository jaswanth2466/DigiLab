const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let mouseMoved = false;

const pointer = {
  x: 0.5 * window.innerWidth,
  y: 0.5 * window.innerHeight,
};

const params = {
  pointsNumber: 40,
  widthFactor: 10,
  mouseThreshold: 0.5,
  spring: 0.25,
  friction: 0.5,
};

const trail = new Array(params.pointsNumber).fill().map(() => ({
  x: pointer.x,
  y: pointer.y,
  dx: 0,
  dy: 0,
}));

function updateMousePosition(x, y) {
  pointer.x = x;
  pointer.y = y;
}

window.addEventListener("mousemove", (e) => {
  mouseMoved = true;
  updateMousePosition(e.pageX, e.pageY);
});

window.addEventListener("touchmove", (e) => {
  mouseMoved = true;
  updateMousePosition(e.touches[0].pageX, e.touches[0].pageY);
});

window.addEventListener("resize", setupCanvas);

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function update(t) {
  if (!mouseMoved) {
    pointer.x = (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) * window.innerWidth;
    pointer.y = (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t)) * window.innerHeight;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  trail.forEach((p, i) => {
    const prev = i === 0 ? pointer : trail[i - 1];
    const spring = i === 0 ? 0.4 * params.spring : params.spring;

    p.dx += (prev.x - p.x) * spring;
    p.dy += (prev.y - p.y) * spring;
    p.dx *= params.friction;
    p.dy *= params.friction;
    p.x += p.dx;
    p.y += p.dy;
  });

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "rgb(154, 7, 98)");
  gradient.addColorStop(1, "rgba(57, 34, 115, 1)");

  ctx.strokeStyle = gradient;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(trail[0].x, trail[0].y);

  for (let i = 1; i < trail.length - 1; i++) {
    const xc = 0.5 * (trail[i].x + trail[i + 1].x);
    const yc = 0.5 * (trail[i].y + trail[i + 1].y);
    ctx.lineWidth = params.widthFactor * (params.pointsNumber - i) / params.pointsNumber;
    ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
    ctx.stroke();
  }

  requestAnimationFrame(update);
}

setupCanvas();
update(0);


// Navbar toggle
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  });
}

if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}

// Hero slider
const slider = document.getElementById('hero-slider');
let currentSlide = 0;
setInterval(() => {
  currentSlide = (currentSlide + 1) % 2;
  slider.style.transform = `translateX(-${currentSlide * 100}vw)`;
}, 4000);

// Animate timeline components on scroll
const timelineComponents = document.querySelectorAll('.timeline__component');
const footerCols = document.querySelectorAll('.footer-col');

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;
  timelineComponents.forEach(comp => {
    const compTop = comp.getBoundingClientRect().top;
    if (compTop < triggerBottom) {
      comp.classList.add('show');
    }
  });
  footerCols.forEach(col => {
    const colTop = col.getBoundingClientRect().top;
    if (colTop < triggerBottom) {
      col.style.opacity = 1;
      col.style.transform = 'translateY(0)';
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);





