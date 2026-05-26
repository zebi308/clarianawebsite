const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const cursorGlow = document.querySelector("[data-cursor-glow]");
const hasGsap = typeof window.gsap !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

if (hasGsap && hasScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

if (!prefersReducedMotion && typeof window.Lenis !== "undefined") {
  window.__clarianaLenisStarted = true;
  const lenis = new Lenis({
    duration: 1.08,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.86
  });

  lenis.on("scroll", () => {
    updateHeader();
    if (hasScrollTrigger) ScrollTrigger.update();
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);
}

const splitWords = (element) => {
  if (!element || element.dataset.split === "true") return;
  const words = element.textContent.trim().split(" ");
  element.textContent = "";
  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = `${word}${index === words.length - 1 ? "" : " "}`;
    span.style.display = "inline-block";
    if (index !== words.length - 1) span.style.marginRight = "0.18em";
    span.style.clipPath = "inset(0 0 0 0)";
    element.appendChild(span);
  });
  element.dataset.split = "true";
};

document.querySelectorAll(".mask-heading").forEach(splitWords);

const revealFallback = () => {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
};

if (!prefersReducedMotion && hasGsap && hasScrollTrigger) {
  window.__clarianaGsapUpgraded = true;
  gsap.set(".reveal", { autoAlpha: 0, y: 44, scale: 0.985 });

  gsap.utils.toArray("[data-section]").forEach((section) => {
    const items = Array.from(section.querySelectorAll(".reveal, .metric-card, .process-item")).filter(
      (item) => !item.classList.contains("is-visible")
    );
    if (!items.length) return;

    gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.09,
      scrollTrigger: {
        trigger: section,
        start: "top 72%",
        once: true
      }
    });
  });

  gsap.fromTo(
    ".hero-title",
    { y: 36, autoAlpha: 0, scale: 0.98 },
    { y: 0, autoAlpha: 1, scale: 1, duration: 1.15, ease: "power4.out", delay: 0.36 }
  );

  gsap.fromTo(
    ".hero-proof span",
    { y: 18, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.72, ease: "power3.out", delay: 0.72 }
  );

  gsap.to("[data-parallax-speed]", {
    yPercent: -10,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  document.querySelectorAll(".mask-heading").forEach((heading) => {
    const words = heading.querySelectorAll("span");
    gsap.from(words, {
      yPercent: 110,
      autoAlpha: 0,
      duration: 0.82,
      ease: "power3.out",
      stagger: 0.025,
      scrollTrigger: {
        trigger: heading,
        start: "top 78%",
        once: true
      }
    });
  });

  const storyCards = gsap.utils.toArray("[data-story-card]");
  const storyNodes = gsap.utils.toArray("[data-story-node]");
  const progress = document.querySelector("[data-story-progress]");

  if (storyCards.length) {
    ScrollTrigger.create({
      trigger: ".sticky-story",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: ({ progress: storyProgress }) => {
        const index = Math.min(storyCards.length - 1, Math.floor(storyProgress * storyCards.length));
        storyCards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === index));
        storyNodes.forEach((node, nodeIndex) => {
          gsap.to(node, {
            scale: nodeIndex <= index ? 1.04 : 1,
            y: nodeIndex <= index ? -8 : 0,
            borderColor: nodeIndex <= index ? "rgba(0, 169, 143, 0.72)" : "rgba(0, 169, 143, 0.2)",
            duration: 0.28,
            overwrite: true
          });
        });
        if (progress) progress.style.width = `${storyProgress * 100}%`;
      }
    });
  }

  gsap.to(".service-grid", {
    xPercent: -4,
    ease: "none",
    scrollTrigger: {
      trigger: ".services-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".testimonial-track", {
    xPercent: -3,
    ease: "none",
    scrollTrigger: {
      trigger: ".testimonials-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
} else {
  revealFallback();
}

const rotatingWord = document.querySelector("[data-rotating-word]");
const rotatingPhrases = ["repetitive work.", "messy reporting.", "lead follow-up.", "manual admin.", "data chaos."];
let rotatingIndex = 0;

if (rotatingWord && !prefersReducedMotion) {
  window.setInterval(() => {
    rotatingIndex = (rotatingIndex + 1) % rotatingPhrases.length;
    if (hasGsap) {
      gsap.to(rotatingWord, {
        y: -16,
        autoAlpha: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          rotatingWord.textContent = rotatingPhrases[rotatingIndex];
          gsap.fromTo(rotatingWord, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.38, ease: "power3.out" });
        }
      });
    } else {
      rotatingWord.textContent = rotatingPhrases[rotatingIndex];
    }
  }, 2300);
}

if (cursorGlow && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener(
    "pointermove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursorGlow.style.opacity = "1";
    },
    { passive: true }
  );

  const animateGlow = () => {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.transform = `translate3d(${glowX - 180}px, ${glowY - 180}px, 0)`;
    requestAnimationFrame(animateGlow);
  };

  animateGlow();
}

const nodes = Array.from(document.querySelectorAll(".flow-node"));
let activeNode = 0;
if (nodes.length && !prefersReducedMotion) {
  window.setInterval(() => {
    nodes[activeNode].classList.remove("active");
    activeNode = (activeNode + 1) % nodes.length;
    nodes[activeNode].classList.add("active");
  }, 1500);
}

const workflows = {
  sales: {
    trigger: "New lead enters CRM",
    triggerSub: "Website form, LinkedIn, or referral",
    ai: "Clean, enrich, and score",
    aiSub: "Removes duplicates and flags intent",
    outcome: "Booked call with context",
    outcomeSub: "Sales team gets next best action"
  },
  reporting: {
    trigger: "Weekly data arrives",
    triggerSub: "Sheets, CRM, finance, and ops tools",
    ai: "Validate and transform",
    aiSub: "Fixes gaps and prepares clean tables",
    outcome: "Live leadership dashboard",
    outcomeSub: "Decisions from one trusted view"
  },
  support: {
    trigger: "Customer request received",
    triggerSub: "Email, website, or help desk",
    ai: "Classify and draft response",
    aiSub: "Reads context and routes urgency",
    outcome: "Faster resolution",
    outcomeSub: "Team handles fewer repetitive tickets"
  },
  finance: {
    trigger: "Invoice or expense uploaded",
    triggerSub: "Email attachment or shared folder",
    ai: "Extract and cross-check",
    aiSub: "Matches supplier, amount, and category",
    outcome: "Ready for approval",
    outcomeSub: "Finance admin moves without chasing"
  }
};

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

document.querySelectorAll("[data-workflow]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-workflow]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const flow = workflows[button.dataset.workflow];
    const cards = document.querySelectorAll(".workflow-card");

    if (hasGsap && !prefersReducedMotion) {
      gsap.to(cards, {
        y: 16,
        autoAlpha: 0,
        duration: 0.18,
        stagger: 0.035,
        onComplete: () => {
          setText("[data-flow-trigger]", flow.trigger);
          setText("[data-flow-trigger-sub]", flow.triggerSub);
          setText("[data-flow-ai]", flow.ai);
          setText("[data-flow-ai-sub]", flow.aiSub);
          setText("[data-flow-outcome]", flow.outcome);
          setText("[data-flow-outcome-sub]", flow.outcomeSub);
          gsap.to(cards, { y: 0, autoAlpha: 1, duration: 0.42, stagger: 0.06, ease: "power3.out" });
        }
      });
    } else {
      setText("[data-flow-trigger]", flow.trigger);
      setText("[data-flow-trigger-sub]", flow.triggerSub);
      setText("[data-flow-ai]", flow.ai);
      setText("[data-flow-ai-sub]", flow.aiSub);
      setText("[data-flow-outcome]", flow.outcome);
      setText("[data-flow-outcome-sub]", flow.outcomeSub);
    }
  });
});

const teamInput = document.querySelector("[data-team]");
const rateInput = document.querySelector("[data-rate]");
const hoursInput = document.querySelector("[data-hours]");

const formatGBP = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }).format(amount);

const updateCalculator = () => {
  const team = Number(teamInput.value);
  const rate = Number(rateInput.value);
  const hours = Number(hoursInput.value);
  const recovered = Math.round(team * hours * 0.76);
  const annualSaving = recovered * rate * 52;
  const implementationCost = 4000;
  const roi = Math.max(0, Math.round(((annualSaving - implementationCost) / implementationCost) * 100));

  setText("[data-team-label]", `${team} ${team === 1 ? "person" : "people"}`);
  setText("[data-rate-label]", `${formatGBP(rate)}/hr`);
  setText("[data-hours-label]", `${hours} hrs`);
  setText("[data-saved-hours]", `${recovered}h`);
  setText("[data-saving]", formatGBP(annualSaving));
  setText("[data-roi]", `${roi}%`);
};

if (teamInput && rateInput && hoursInput) {
  [teamInput, rateInput, hoursInput].forEach((input) => input.addEventListener("input", updateCalculator));
  updateCalculator();
}

const animateCounters = () => {
  document.querySelectorAll("[data-counter]").forEach((element) => {
    const target = Number(element.dataset.counter);
    if (hasGsap && hasScrollTrigger && !prefersReducedMotion) {
      const counter = { value: 0 };
      gsap.to(counter, {
        value: target,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 84%",
          once: true
        },
        onUpdate: () => {
          element.textContent = `${Math.round(counter.value)}`;
        }
      });
    } else {
      element.textContent = `${target}`;
    }
  });
};

animateCounters();

document.querySelectorAll(".tilt-card, .premium-depth, .flow-node").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".magnetic").forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate3d(${x * 0.18}px, ${y * 0.28}px, 0)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

document.querySelectorAll(".flow-node, .workflow-card, .service-card, .price-card, .testimonial-card, .calculator, .lead-form, .cta-panel").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    element.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  });
});

document.querySelector(".lead-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  button.textContent = "Request Ready to Connect";
  if (hasGsap && !prefersReducedMotion) {
    gsap.fromTo(button, { scale: 0.96 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" });
  }
  window.setTimeout(() => {
    button.textContent = "Send Audit Request";
  }, 2600);
});

const startSmoothScroll = () => {
  if (prefersReducedMotion || window.__clarianaLenisStarted || typeof window.Lenis === "undefined") return;
  window.__clarianaLenisStarted = true;
  const lenis = new Lenis({
    duration: 1.08,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.86
  });

  lenis.on("scroll", () => {
    updateHeader();
    if (typeof window.ScrollTrigger !== "undefined") ScrollTrigger.update();
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);
};

const upgradeMotion = () => {
  if (prefersReducedMotion || window.__clarianaGsapUpgraded || typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") return;
  window.__clarianaGsapUpgraded = true;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray("[data-section]").forEach((section) => {
    const items = section.querySelectorAll(".reveal, .metric-card, .process-item");
    if (!items.length) return;
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 44, scale: 0.985 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true
        }
      }
    );
  });

  gsap.fromTo(
    ".hero-title",
    { y: 36, autoAlpha: 0, scale: 0.98 },
    { y: 0, autoAlpha: 1, scale: 1, duration: 1.15, ease: "power4.out", delay: 0.16 }
  );

  gsap.to("[data-parallax-speed]", {
    yPercent: -10,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  const storyCards = gsap.utils.toArray("[data-story-card]");
  const storyNodes = gsap.utils.toArray("[data-story-node]");
  const progress = document.querySelector("[data-story-progress]");
  if (storyCards.length) {
    ScrollTrigger.create({
      trigger: ".sticky-story",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: ({ progress: storyProgress }) => {
        const index = Math.min(storyCards.length - 1, Math.floor(storyProgress * storyCards.length));
        storyCards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === index));
        storyNodes.forEach((node, nodeIndex) => {
          gsap.to(node, {
            scale: nodeIndex <= index ? 1.04 : 1,
            y: nodeIndex <= index ? -8 : 0,
            borderColor: nodeIndex <= index ? "rgba(0, 169, 143, 0.72)" : "rgba(0, 169, 143, 0.2)",
            duration: 0.28,
            overwrite: true
          });
        });
        if (progress) progress.style.width = `${storyProgress * 100}%`;
      }
    });
  }

  gsap.to(".service-grid", {
    xPercent: -4,
    ease: "none",
    scrollTrigger: {
      trigger: ".services-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".testimonial-track", {
    xPercent: -3,
    ease: "none",
    scrollTrigger: {
      trigger: ".testimonials-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
};

window.ClarianaMotion = {
  upgrade: upgradeMotion,
  startSmoothScroll
};

let libraryChecks = 0;
const libraryTimer = window.setInterval(() => {
  libraryChecks += 1;
  startSmoothScroll();
  upgradeMotion();
  if (libraryChecks > 60 || (window.__clarianaLenisStarted && window.__clarianaGsapUpgraded)) {
    window.clearInterval(libraryTimer);
  }
}, 120);
