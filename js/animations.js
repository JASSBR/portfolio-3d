/* ===== Loader ===== */
export function initLoader(onComplete) {
  const loader = document.getElementById('loader');
  const fill = loader.querySelector('.loader-fill');
  const percent = loader.querySelector('.loader-percent');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      percent.textContent = '100%';

      gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          onComplete();
        },
      });
      return;
    }
    fill.style.width = progress + '%';
    percent.textContent = Math.floor(progress) + '%';
  }, 80);
}

/* ===== Hero Animation ===== */
export function initHeroAnimation() {
  // Set initial states
  gsap.set('.hero-name-inner', { yPercent: 120 });
  gsap.set('.hero-greeting', { opacity: 0, y: 20 });
  gsap.set('.hero-title', { opacity: 0, y: 20 });
  gsap.set('.hero-subtitle', { opacity: 0, y: 20 });
  gsap.set('.hero-cta', { opacity: 0, y: 20 });
  gsap.set('.scroll-indicator', { opacity: 0 });

  const tl = gsap.timeline({ delay: 0.3 });

  tl.to('.hero-greeting', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
  })
  .to('.hero-name-inner', {
    yPercent: 0,
    duration: 1.2,
    stagger: 0.12,
    ease: 'power4.out',
  }, 0.4)
  .to('.hero-title', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
  }, 1.0)
  .to('.hero-subtitle', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
  }, 1.2)
  .to('.hero-cta', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
  }, 1.4)
  .to('.scroll-indicator', {
    opacity: 0.7, duration: 1, ease: 'power3.out',
  }, 1.6);
}

/* ===== Scroll Animations ===== */
export function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Navbar
  gsap.to('#navbar', {
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });

  // Hide scroll indicator on scroll
  gsap.to('.scroll-indicator', {
    opacity: 0,
    scrollTrigger: {
      trigger: '#hero',
      start: '80% top',
      end: '100% top',
      scrub: true,
    },
  });

  // Reveal elements
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Skill cards stagger with enhanced animation
  const skillCards = document.querySelectorAll('.skill-card');
  if (skillCards.length) {
    gsap.to(skillCards, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: { each: 0.05, from: 'start' },
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#skills',
        start: 'top 72%',
        toggleActions: 'play none none none',
      },
    });
  }

  // Project cards stagger
  const projectCards = document.querySelectorAll('.project-card');
  if (projectCards.length) {
    gsap.to(projectCards, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 72%',
        toggleActions: 'play none none none',
      },
    });
  }

  // Timeline sequential
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: i * 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Section titles parallax
  document.querySelectorAll('.section-title').forEach((title) => {
    gsap.to(title, {
      y: -30,
      scrollTrigger: {
        trigger: title,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });

  // Scroll progress bar
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    document.getElementById('scroll-progress').style.width = progress + '%';
  }, { passive: true });
}

/* ===== Animated Counters ===== */
export function initCounters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          innerText: target,
          duration: 2.5,
          snap: { innerText: 1 },
          ease: 'power2.out',
        });
      },
    });
  });
}

/* ===== Custom Cursor ===== */
export function initCursor() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let cx = -100, cy = -100;
  let fx = -100, fy = -100;

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`;
  });

  function updateFollower() {
    fx += (cx - fx) * 0.08;
    fy += (cy - fy) * 0.08;
    follower.style.transform = `translate(${fx - 20}px, ${fy - 20}px)`;
    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  // Hover effects on interactive elements
  const interactives = document.querySelectorAll('a, button, [data-tilt], input, textarea');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      follower.classList.remove('active');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}

/* ===== Theme Toggle ===== */
export function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  btn.addEventListener('click', () => {
    const isDark = html.dataset.theme === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    html.dataset.theme = newTheme;

    // Dispatch event for Three.js scene
    document.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: newTheme }
    }));
  });
}

/* ===== Mobile Menu ===== */
export function initMobileMenu() {
  const btn = document.getElementById('nav-menu-btn');
  const menu = document.getElementById('mobile-menu');

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ===== Project Card Tilt ===== */
export function initProjectTilt() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const inner = card.querySelector('.project-inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      inner.style.transform = `
        perspective(800px)
        rotateY(${x * 12}deg)
        rotateX(${-y * 12}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = '';
    });
  });
}

/* ===== Magnetic Buttons ===== */
export function initMagneticButtons() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0, y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => { el.style.transform = ''; },
      });
    });
  });
}

/* ===== Text Scramble on Hover ===== */
export function initTextScramble() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';

  document.querySelectorAll('[data-scramble]').forEach(el => {
    const original = el.textContent;
    let isScrambling = false;

    el.addEventListener('mouseenter', () => {
      if (isScrambling) return;
      isScrambling = true;
      let iteration = 0;

      const interval = setInterval(() => {
        el.textContent = original.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration) return original[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');

        iteration += 1 / 2;
        if (iteration >= original.length) {
          clearInterval(interval);
          el.textContent = original;
          isScrambling = false;
        }
      }, 30);
    });
  });
}

/* ===== Film Grain ===== */
export function initGrain() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;

  const imageData = ctx.createImageData(256, 256);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = Math.random() * 255;
    imageData.data[i] = v;
    imageData.data[i + 1] = v;
    imageData.data[i + 2] = v;
    imageData.data[i + 3] = 10;
  }
  ctx.putImageData(imageData, 0, 0);

  const grain = document.querySelector('.grain');
  if (grain) {
    grain.style.backgroundImage = `url(${canvas.toDataURL()})`;
    grain.style.backgroundRepeat = 'repeat';
  }
}

/* ===== Konami Code ===== */
export function initKonamiCode(onTrigger) {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let index = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === code[index]) {
      index++;
      if (index === code.length) {
        index = 0;
        onTrigger();
      }
    } else {
      index = 0;
    }
  });
}

/* ===== Contact Form ===== */
export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name.value;
    const email = form.elements.email.value;
    const message = form.elements.message.value;
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
    window.open(`mailto:yassirsabbar1@gmail.com?subject=${subject}&body=${body}`, '_self');
  });
}

/* ===== Smooth Nav Active State ===== */
export function initNavHighlight() {
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) current = section.id;
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--neon-cyan)';
      }
    });
  }, { passive: true });
}
