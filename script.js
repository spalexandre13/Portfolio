// 1. THEME MANAGEMENT
const themeBtn = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
if(themeBtn) themeBtn.textContent = savedTheme === 'light' ? '🌙' : '☀';

if(themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
    themeBtn.textContent = target === 'light' ? '🌙' : '☀';
  });
}

// 2. MOBILE BURGER MENU
const burger = document.getElementById('burger');
const navlinks = document.querySelector('.navlinks');
if (burger && navlinks) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navlinks.classList.toggle('mobile-open');
  });
  navlinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navlinks.classList.remove('mobile-open');
    });
  });
}

// 3. TERMINAL TYPEWRITER EFFECT
const termBody = document.getElementById('term-body');
if (termBody) {
  const commands = [
    { text: "whoami", type: "cmd" },
    { text: "Alexandre SAMPEREZ, Étudiant BUT R&T", type: "out" },
    { text: "cat skills.txt | grep 'Network'", type: "cmd" },
    { text: "> Cisco CCNA (notions), OSPF, VLANs, Wireshark", type: "out" },
    { text: "./Alternance --date='2026 - 2027'", type: "cmd" },
    { text: "Searching... Match Found! Disponnible en Alternance 2026.", type: "out" },
    { text: "contact --email", type: "cmd" },
    { text: "alexandre.samperez@etu.univ-cotedazur.fr", type: "out", style:"color:var(--accent)" }
  ];

  let cmdIndex = 0;
  let charIndex = 0;

  function typeTerminal() {
    if (cmdIndex >= commands.length) return;
    
    const line = commands[cmdIndex];
    let currentLineDiv = termBody.lastElementChild;
    if (!currentLineDiv || charIndex === 0) {
      currentLineDiv = document.createElement('div');
      currentLineDiv.className = line.type;
      if(line.type === 'cmd') currentLineDiv.innerHTML = '<span style="color:var(--code)">$</span> ';
      if(line.style) currentLineDiv.style = line.style;
      termBody.appendChild(currentLineDiv);
    }

    if (line.type === 'cmd') {
      if (charIndex < line.text.length) {
        currentLineDiv.innerHTML += line.text.charAt(charIndex);
        charIndex++;
        setTimeout(typeTerminal, 50 + Math.random()*50);
      } else {
        cmdIndex++;
        charIndex = 0;
        setTimeout(typeTerminal, 800);
      }
    } else {
      currentLineDiv.innerText = line.text;
      cmdIndex++;
      charIndex = 0;
      termBody.scrollTop = termBody.scrollHeight;
      setTimeout(typeTerminal, 200);
    }
  }
  setTimeout(typeTerminal, 1000);
}

// 3. NETWORK CANVAS ANIMATION
const canvas = document.getElementById('network-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw(color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(window.innerWidth / 15, 100);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  initParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    const style = getComputedStyle(document.documentElement);
    const pColor = style.getPropertyValue('--particle-color').trim();
    const lColor = style.getPropertyValue('--line-color').trim();

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(pColor);
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.strokeStyle = lColor.replace('0.2', (1 - dist/150) * 0.4); 
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// 4. FILTERING & SCROLL REVEAL
function filter(cat) {
  document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.project-card').forEach(card => {
    if(cat === 'all' || card.dataset.cat.includes(cat)) card.style.display = 'flex';
    else card.style.display = 'none';
  });
}

// 5. SKILLS FILTERING
function filterSkills(cat) {
  document.querySelectorAll('.sk-pill').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.sk-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e => {
    if(e.isIntersecting) e.target.classList.add('active');
  });
}, {threshold:0.1});

if (location.protocol === 'file:') {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
} else {
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();