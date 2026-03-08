/* ============================================================
   PERSONAL LANDING PAGE — ENHANCED ANIMATIONS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════
     1. PAGE FADE-IN
  ═══════════════════════════════════════════════ */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => { document.body.style.opacity = '1'; }));


  /* ═══════════════════════════════════════════════
     2. CUSTOM CURSOR (desktop only)
  ═══════════════════════════════════════════════ */
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top  = my + 'px';
    });

    const animRing = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    };
    animRing();

    document.querySelectorAll('a, button, .portfolio-card, .contact-info-item, .accordion-button').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
    });

    document.addEventListener('mouseleave', () => { cursorDot.style.opacity='0'; cursorRing.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { cursorDot.style.opacity='1'; cursorRing.style.opacity='1'; });
  }


  /* ═══════════════════════════════════════════════
     3. SCROLL PROGRESS BAR
  ═══════════════════════════════════════════════ */
  const progressBar = document.getElementById('scrollProgress');

  const updateProgress = () => {
    if (!progressBar) return;
    const total = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  };


  /* ═══════════════════════════════════════════════
     4. NAVBAR + ACTIVE LINKS
  ═══════════════════════════════════════════════ */
  const navbar   = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const onScroll = () => {
    updateProgress();
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }

    let current = '';
    document.querySelectorAll('section[id]').forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === current));

    const btn = document.getElementById('backToTop');
    if (btn) btn.classList.toggle('show', window.scrollY > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ═══════════════════════════════════════════════
     5. PARTICLE CANVAS (Home)
  ═══════════════════════════════════════════════ */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    new ResizeObserver(resize).observe(canvas);

    class Particle {
      constructor() { this.reset(true); }
      reset(random = false) {
        this.x    = Math.random() * W;
        this.y    = random ? Math.random() * H : H + 10;
        this.r    = Math.random() * 1.8 + 0.4;
        this.vx   = (Math.random() - 0.5) * 0.4;
        this.vy   = -(Math.random() * 0.5 + 0.15);
        this.life = random ? Math.random() : 0;
        this.opacity = 0;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life += 0.004;
        this.opacity = this.life < 0.2 ? this.life/0.2 : this.life > 0.8 ? 1-(this.life-0.8)/0.2 : 1;
        if (this.life >= 1 || this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(182,174,159,${this.opacity*0.6})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      // connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i+1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(182,174,159,${(1-d/90)*0.1})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    };
    loop();
  }


  /* ═══════════════════════════════════════════════
     6. HERO STAGGER ENTRANCE
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('.hero-anim').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    setTimeout(() => {
      el.style.transition = `opacity 0.9s cubic-bezier(0.4,0,0.2,1) ${i*0.14}s, transform 0.9s cubic-bezier(0.4,0,0.2,1) ${i*0.14}s`;
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 200);
  });


  /* ═══════════════════════════════════════════════
     7. SCROLL REVEAL — all animated elements
  ═══════════════════════════════════════════════ */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in-up,.fade-in-left,.fade-in-right,.blur-in,.stagger-children,.draw-line').forEach(el => revealObs.observe(el));


  /* ═══════════════════════════════════════════════
     8. ANIMATED COUNTER
  ═══════════════════════════════════════════════ */
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = target / 60;
      const tick = () => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur) + suffix;
        if (cur < target) requestAnimationFrame(tick);
        else { el.textContent = target + suffix; el.classList.add('pop'); }
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 }).observe(document.querySelector('#statsRow') || document.body);

  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = target / 60;
      const tick = () => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur) + suffix;
        if (cur < target) requestAnimationFrame(tick);
        else { el.textContent = target + suffix; el.classList.add('pop'); }
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 }).observe(el);
  });


  /* ═══════════════════════════════════════════════
     9. PROGRESS BARS (About skills)
  ═══════════════════════════════════════════════ */
  const skillsWrap = document.querySelector('.skills-wrap');
  if (skillsWrap) {
    new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.progress-bar[data-width]').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.width = bar.dataset.width + '%';
          bar.classList.add('shimmer');
        }, i * 160);
      });
    }, { threshold: 0.3 }).observe(skillsWrap);
  }


  /* ═══════════════════════════════════════════════
     10. MAGNETIC BUTTONS
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
    const inner = wrap.querySelector('.btn-accent,.btn-outline-accent') || wrap;
    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const dx   = ((e.clientX - rect.left - rect.width/2)) * 0.3;
      const dy   = ((e.clientY - rect.top  - rect.height/2)) * 0.3;
      wrap.style.transform  = `translate(${dx}px, ${dy}px)`;
      if (inner !== wrap) inner.style.transform = `translate(${dx*0.12}px, ${dy*0.12}px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      wrap.style.transition  = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
      wrap.style.transform   = '';
      if (inner !== wrap) { inner.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)'; inner.style.transform=''; }
      setTimeout(() => { wrap.style.transition=''; if(inner!==wrap)inner.style.transition=''; }, 600);
    });
  });


  /* ═══════════════════════════════════════════════
     11. RIPPLE EFFECT
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const circle = document.createElement('span');
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      circle.className = 'ripple-circle';
      circle.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
      btn.appendChild(circle);
      circle.addEventListener('animationend', () => circle.remove());
    });
  });


  /* ═══════════════════════════════════════════════
     12. PORTFOLIO CARD 3D TILT
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.style.transition = 'transform 0.15s ease, border-color 0.35s, box-shadow 0.35s';
    card.addEventListener('mousemove', e => {
      card.style.transition = 'border-color 0.35s, box-shadow 0.35s';
      const rect = card.getBoundingClientRect();
      const dx = ((e.clientX-rect.left)/rect.width - 0.5) * 2;
      const dy = ((e.clientY-rect.top)/rect.height  - 0.5) * 2;
      card.style.transform = `translateY(-8px) rotateX(${-dy*6}deg) rotateY(${dx*6}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), border-color 0.35s, box-shadow 0.35s';
      card.style.transform  = '';
    });
  });


  /* ═══════════════════════════════════════════════
     13. TYPED TEXT (Home)
  ═══════════════════════════════════════════════ */
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const phrases = ['Software Developer','Database Enthusiast','System Analyst','Problem Solver'];
    let pi = 0, ci = 0, del = false;
    const type = () => {
      const cur = phrases[pi];
      ci += del ? -1 : 1;
      typedEl.textContent = cur.substring(0, ci);
      let speed = del ? 55 : 95;
      if (!del && ci === cur.length) { speed = 2000; del = true; }
      else if (del && ci === 0) { del = false; pi = (pi+1) % phrases.length; speed = 380; }
      setTimeout(type, speed);
    };
    setTimeout(type, 900);
  }


  /* ═══════════════════════════════════════════════
     14. WORD-BY-WORD REVEAL
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('.word-reveal').forEach(el => {
    const words = el.textContent.trim().split(' ');
    el.innerHTML = words.map((w, i) =>
      `<span class="word" style="transition-delay:${0.05+i*0.08}s">${w}</span>`
    ).join(' ');
    new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add('visible'); }, { threshold:0.5 }).observe(el);
  });


  /* ═══════════════════════════════════════════════
     15. SECTION NUMS PARALLAX
  ═══════════════════════════════════════════════ */
  const paralSections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    paralSections.forEach(sec => {
      const num = sec.querySelector('.section-num');
      if (!num) return;
      const progress = -sec.getBoundingClientRect().top / sec.offsetHeight;
      num.style.transform = `translateY(${progress * 50}px)`;
    });
  }, { passive: true });


  /* ═══════════════════════════════════════════════
     16. SMOOTH SCROLL
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const nav = document.getElementById('navbarNav');
      if (nav?.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav).hide();
      const off = navbar ? navbar.offsetHeight : 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
    });
  });


  /* ═══════════════════════════════════════════════
     17. BACK TO TOP
  ═══════════════════════════════════════════════ */
  document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ═══════════════════════════════════════════════
     18. CONTACT FORM
  ═══════════════════════════════════════════════ */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.innerHTML = '⏳ Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '✓ Message Sent!';
        const fb = document.getElementById('formFeedback');
        if (fb) { fb.style.display='block'; fb.style.opacity='0'; fb.style.transition='opacity 0.5s'; setTimeout(()=>fb.style.opacity='1',10); }
        setTimeout(() => {
          form.reset();
          btn.innerHTML = '<i class="bi bi-send me-2"></i>Kirim Pesan';
          btn.disabled = false;
          btn.style.background = '';
          if (fb) fb.style.display = 'none';
        }, 4000);
      }, 1200);
    });
  }


  /* ═══════════════════════════════════════════════
     19. NAV MOBILE CLOSE
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.getElementById('navbarNav');
      if (nav?.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav).hide();
    });
  });

});
