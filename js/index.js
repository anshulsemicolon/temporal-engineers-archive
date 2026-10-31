/**
 * Temporal Engineering Archive - Anshul Kulkarni
 * Modular Client Suite: Background Music (BGM) Engine, Precision Cursor Reticle & Scroll Telemetry
 */

// ============================================================================
// 1. Background Music (BGM) Controller (Temporarily commented out)
// ============================================================================
/*
class BgmController {
  constructor() {
    this.audio = document.getElementById("bgm-audio");
    if (!this.audio) {
      this.audio = new Audio("public/sound.mp3");
      this.audio.id = "bgm-audio";
      this.audio.loop = true;
      document.body.appendChild(this.audio);
    }
    this.audio.loop = true;
    this.audio.volume = 0.35; // Comfortable ambient volume

    this.toggleBtns = document.querySelectorAll(".bgm-toggle");
    this.isPlaying = false;
    this.userPreference = localStorage.getItem("tea_bgm_state"); // 'on', 'off', or null
  }

  init() {
    // If user explicitly muted previously, respect it
    if (this.userPreference === "off") {
      this.updateUI(false);
      this.attachEvents();
      return;
    }

    // Attempt autoplay when website loads
    this.playAudio()
      .then(() => {
        this.updateUI(true);
      })
      .catch(() => {
        // Autoplay policy prevented immediate playback:
        // Set up one-time listener to start playing on first user gesture
        this.updateUI(false);
        const startOnInteraction = () => {
          if (this.userPreference !== "off" && !this.isPlaying) {
            this.playAudio()
              .then(() => this.updateUI(true))
              .catch(() => {});
          }
          window.removeEventListener("pointerdown", startOnInteraction);
          window.removeEventListener("keydown", startOnInteraction);
          window.removeEventListener("scroll", startOnInteraction);
        };

        window.addEventListener("pointerdown", startOnInteraction, { once: true });
        window.addEventListener("keydown", startOnInteraction, { once: true });
        window.addEventListener("scroll", startOnInteraction, { once: true });
      });

    this.attachEvents();
  }

  attachEvents() {
    this.toggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.toggle());
    });

    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.updateUI(true);
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.updateUI(false);
    });
  }

  async playAudio() {
    try {
      await this.audio.play();
      this.isPlaying = true;
      this.userPreference = "on";
      localStorage.setItem("tea_bgm_state", "on");
      this.updateUI(true);
    } catch (err) {
      this.isPlaying = false;
      this.updateUI(false);
      throw err;
    }
  }

  pauseAudio() {
    this.audio.pause();
    this.isPlaying = false;
    this.userPreference = "off";
    localStorage.setItem("tea_bgm_state", "off");
    this.updateUI(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio().catch(() => {});
    }
  }

  updateUI(isPlaying) {
    this.toggleBtns.forEach((btn) => {
      btn.classList.toggle("active", isPlaying);
      const text = btn.querySelector(".bgm-text");
      if (text) {
        text.textContent = isPlaying ? "BGM: ON" : "BGM: OFF";
      }

      const soundIcon = btn.querySelector(".bgm-icon-sound");
      const muteIcon = btn.querySelector(".bgm-icon-mute");
      if (soundIcon && muteIcon) {
        soundIcon.style.display = isPlaying ? "inline-block" : "none";
        muteIcon.style.display = isPlaying ? "none" : "inline-block";
      }
    });
  }
}
*/

// ============================================================================
// 2. Main DOMContentLoaded Execution
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Background Music Engine (Temporarily commented out)
  // const bgm = new BgmController();
  // bgm.init();

  // --------------------------------------------------------------------------
  // Sleek Precision Cursor Tracker (Never covers text)
  // --------------------------------------------------------------------------
  const cursorTracker = document.getElementById("cursor-tracker");
  const hudCoords = document.getElementById("hud-coords");
  const hudState = document.getElementById("hud-state");
  const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (cursorTracker && !isTouch && !prefersReduced) {
    let mouseX = -100;
    let mouseY = -100;
    let reticleX = -100;
    let reticleY = -100;
    let isVisible = false;

    const dot = cursorTracker.querySelector(".cursor-dot");
    const reticle = cursorTracker.querySelector(".cursor-reticle");

    // Track mouse position
    window.addEventListener("pointermove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        cursorTracker.classList.add("visible");
        isVisible = true;
      }

      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // Update stationary telemetry coordinates at bottom
      if (hudCoords) {
        const padX = String(Math.max(0, mouseX)).padStart(4, "0");
        const padY = String(Math.max(0, mouseY)).padStart(4, "0");
        hudCoords.textContent = `X:${padX} Y:${padY}`;
      }
    }, { passive: true });

    // Time-Dilation Scroll Velocity Tracking (DESIGN.md)
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let currentStreak = 0;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
    }, { passive: true });

    // Smooth physics lerp follower for reticle with velocity stretching
    const animateCursor = () => {
      if (isVisible && reticle) {
        reticleX += (mouseX - reticleX) * 0.22;
        reticleY += (mouseY - reticleY) * 0.22;

        scrollVelocity *= 0.88;
        currentStreak += (scrollVelocity - currentStreak) * 0.22;
        const stretchY = 1 + Math.min(currentStreak * 0.035, 1.5);
        const squishX = 1 / (1 + Math.min(currentStreak * 0.018, 0.45));

        reticle.style.transform = `translate3d(${reticleX}px, ${reticleY}px, 0) translate(-50%, -50%) scale(${squishX.toFixed(3)}, ${stretchY.toFixed(3)})`;
      }
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Click feedback
    window.addEventListener("pointerdown", () => {
      cursorTracker.classList.add("cursor-down");
    });
    window.addEventListener("pointerup", () => {
      cursorTracker.classList.remove("cursor-down");
    });

    // Window exit/enter
    document.addEventListener("mouseleave", () => {
      cursorTracker.classList.remove("visible");
      isVisible = false;
    });
    document.addEventListener("mouseenter", () => {
      cursorTracker.classList.add("visible");
      isVisible = true;
    });

    // Hover targeting states (expands reticle to cleanly frame element)
    const hoverTargets = "a, button, .filter, summary, .schematic .node, .portrait, .metric, .tva-card, .tva-flip-trigger";

    document.addEventListener("pointerover", (e) => {
      const target = e.target.closest(hoverTargets);
      if (target) {
        cursorTracker.classList.add("cursor-hover");

        if (hudState) {
          if (target.matches("a[href^='#']")) {
            hudState.textContent = "NAV: JUMP";
          } else if (target.matches("#copy-email")) {
            hudState.textContent = "COMM: CLIP";
          } else if (target.matches("#resume-btn, a[download]")) {
            hudState.textContent = "FILE: RESUME";
          } else if (target.matches(".tva-card, .tva-flip-trigger")) {
            hudState.textContent = "TEA: FLIP CARD";
          } else if (target.matches(".filter")) {
            hudState.textContent = "FILTER: DOSSIER";
          } else if (target.matches(".node")) {
            hudState.textContent = "SIGNAL: NODE";
          } else if (target.matches("summary")) {
            hudState.textContent = "EXPAND: DOSSIER";
          } else {
            hudState.textContent = "TARGET: ACQUIRED";
          }
        }
      }
    });

    document.addEventListener("pointerout", (e) => {
      const target = e.target.closest(hoverTargets);
      if (target) {
        cursorTracker.classList.remove("cursor-hover");
        if (hudState) {
          hudState.textContent = "SYSTEM READY";
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // Scroll Progress Laser Bar, Orbital Parallax & HUD Telemetry
  // --------------------------------------------------------------------------
  const scrollProgress = document.getElementById("scroll-progress");
  const orbital = document.querySelector(".orbital");

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${pct}%`;
    }

    if (orbital && !prefersReduced) {
      orbital.style.transform = `rotate(${scrollTop * 0.04}deg) translateY(${scrollTop * 0.06}px)`;
    }

    // Dynamic Telemetry HUD Update based on scroll sector
    if (hudState) {
      if (scrollTop < 450) {
        hudState.textContent = "SECTOR: 00-INTAKE // ACTIVE STREAM";
      } else if (scrollTop < 1600) {
        hudState.textContent = `SECTOR: 01-WORK // DEPTH: ${Math.round(pct)}%`;
      } else if (scrollTop < 2600) {
        hudState.textContent = "SECTOR: 02-TIMELINE // RECORDED";
      } else if (scrollTop < 3400) {
        hudState.textContent = "SECTOR: 03-SYSTEMS // THE LOOM";
      } else {
        hudState.textContent = "SECTOR: 04-EXTRACTION // LOCKED";
      }
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --------------------------------------------------------------------------
  // Metric Counters Animation (Smooth Ease-Out on Scroll)
  // --------------------------------------------------------------------------
  const counterElements = document.querySelectorAll(".counter");

  if ("IntersectionObserver" in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.dataset.animated !== "true") {
            el.dataset.animated = "true";
            animateCounter(el);
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach((el) => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || "";
    const pad = parseInt(el.dataset.pad, 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);

      let str = String(current);
      if (pad > 0) str = str.padStart(pad, "0");
      el.textContent = str + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        let finalStr = String(target);
        if (pad > 0) finalStr = finalStr.padStart(pad, "0");
        el.textContent = finalStr + suffix;
      }
    };

    requestAnimationFrame(update);
  }

  // --------------------------------------------------------------------------
  // Navigation Scrollspy (Active Section Highlighting)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll("nav a[href^='#']");

  if ("IntersectionObserver" in window && sections.length > 0 && navAnchors.length > 0) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navAnchors.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${id}`);
          });
        }
      });
    }, { threshold: 0.2, rootMargin: "-70px 0px -40% 0px" });

    sections.forEach((sec) => spyObserver.observe(sec));
  }

  // --------------------------------------------------------------------------
  // Mobile Drawer Menu Toggle
  // --------------------------------------------------------------------------
  const menuToggle = document.querySelector(".menu-toggle");
  const navDrawer = document.querySelector("nav");

  if (menuToggle && navDrawer) {
    menuToggle.addEventListener("click", () => {
      const open = navDrawer.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.textContent = open ? "CLOSE −" : "MENU +";
    });

    navDrawer.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navDrawer.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "MENU +";
      })
    );
  }

  // --------------------------------------------------------------------------
  // Engineering Dossiers Project Filtering
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");

  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      filterBtns.forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
      projects.forEach((p) => {
        const cats = p.dataset.category ? p.dataset.category.split(" ") : [];
        p.hidden = btn.dataset.filter !== "all" && !cats.includes(btn.dataset.filter);
      });
    })
  );

  // --------------------------------------------------------------------------
  // Dynamic Footer Copyright Year
  // --------------------------------------------------------------------------
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // Clipboard Copy Email with Toast
  // --------------------------------------------------------------------------
  const copyBtn = document.getElementById("copy-email");
  let toastTimer;

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const toast = document.querySelector(".toast");
      if (!toast) return;

      try {
        await navigator.clipboard.writeText("anshulkulkarni00@gmail.com");
        toast.textContent = "EMAIL COPIED / READY FOR YOUR NEXT BRANCH";
      } catch (err) {
        toast.textContent = "Email: anshulkulkarni00@gmail.com";
      }

      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.hidden = true;
      }, 5000);
    });
  }

  // ==========================================================================
  // Interactive Scroll Choreography & 3D Transition Engine
  // ==========================================================================
  
  // 1. Enable Motion Ready State on Body
  document.body.classList.add("motion-ready");

  // 2. Staggered Scroll Reveal Observer (Projects, Timeline Jobs, Skills, Metrics, FAQ)
  const revealTargets = document.querySelectorAll(".project, .job, .skill-row, .metric, .reality-divider, .faq-item");

  if ("IntersectionObserver" in window && !prefersReduced) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          
          // Trigger signal electricity flow on schematic arrows
          const arrows = entry.target.querySelectorAll(".schematic .arrow");
          arrows.forEach((arr, i) => {
            arr.style.animationDelay = `${i * 0.6}s`;
          });
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-revealed"));
  }

  // 3. Interactive TEA Business Card (3D Flip & Parallax)
  const tvaCard = document.getElementById("tva-card");
  const tvaStage = document.getElementById("tva-card-stage");
  const tvaTrigger = document.getElementById("tva-flip-trigger");
  const tvaStatus = document.getElementById("tva-flip-status");

  if (tvaCard) {
    let isFlipped = false;

    const toggleCardFlip = () => {
      isFlipped = !isFlipped;
      tvaCard.classList.toggle("flipped", isFlipped);
      if (tvaStatus) {
        tvaStatus.textContent = isFlipped 
          ? "[ SACRED TIMELINE (BACK) ]" 
          : "[ AGENT ID (FRONT) ]";
      }
      tvaCard.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
    };

    tvaCard.addEventListener("click", toggleCardFlip);
    if (tvaTrigger) {
      tvaTrigger.addEventListener("click", toggleCardFlip);
    }

    tvaCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCardFlip();
      }
    });

    // Gyroscopic mouse parallax on hover (Desktop)
    if (tvaStage && !isTouch && !prefersReduced) {
      tvaStage.addEventListener("mousemove", (e) => {
        const rect = tvaStage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = -y * 0.045;
        const rotY = (isFlipped ? 180 : 0) + x * 0.045;
        tvaCard.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });

      tvaStage.addEventListener("mouseleave", () => {
        tvaCard.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
      });
    }
  }

  // 4. Interactive 3D Tilt on Project Dossier Cards
  const projectCards = document.querySelectorAll(".project");
  if (!isTouch && !prefersReduced) {
    projectCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = -y * 0.02;
        const rotY = x * 0.02;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
      });
    });
  }

});
