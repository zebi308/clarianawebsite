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
const rotatingPhrases = ["your entire pipeline.", "lead follow-up.", "customer onboarding.", "inbound enquiries.", "repetitive admin."];
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
    label: "Sales Operations",
    description: "Automates every step from lead capture to booked meeting, so your sales team only talks to warm, ready prospects.",
    hours: "12h", manual: "0", speed: "4×",
    steps: [
      { title: "New lead submits form", desc: "Website, LinkedIn ad, or referral email lands in the system automatically.", tools: ["HubSpot", "Website", "LinkedIn"] },
      { title: "Clean and deduplicate", desc: "Removes duplicate contacts, fixes formatting, and fills in missing fields from enrichment sources.", tools: ["Clearbit", "n8n", "CRM"] },
      { title: "Score and qualify", desc: "AI reads company size, intent signals, and past behaviour to assign a priority score and next action.", tools: ["GPT-4o", "Scoring rules", "CRM"] },
      { title: "Send personalised outreach", desc: "Tailored follow-up email sent within minutes. Calendar link included for high-score leads.", tools: ["Gmail", "Calendly", "Slack"] },
      { title: "Meeting booked, rep briefed", desc: "Sales rep receives a briefing card with lead history, score, and talking points before the call.", tools: ["HubSpot", "Notion", "Slack"] }
    ],
    before: "Sales reps manually chase every lead, copy data between tools, and lose hot prospects in the inbox.",
    after: "Every lead is scored and followed up within minutes. Reps only pick up the phone when a meeting is already booked."
  },
  reporting: {
    label: "Reporting & Dashboards",
    description: "Pulls data from every tool your team uses, cleans it, and delivers one trusted leadership dashboard every Monday morning.",
    hours: "8h", manual: "0", speed: "3×",
    steps: [
      { title: "Data sources send updates", desc: "CRM, finance system, spreadsheets, and ops tools all push fresh data on a schedule.", tools: ["Sheets", "Xero", "HubSpot"] },
      { title: "Validate and flag errors", desc: "Missing values, duplicate rows, and format mismatches are caught and corrected automatically.", tools: ["n8n", "Python", "Make"] },
      { title: "Transform into clean tables", desc: "AI maps each data source to a consistent format, ready for the dashboard layer.", tools: ["GPT-4o", "BigQuery", "Airtable"] },
      { title: "Build and refresh dashboard", desc: "Charts, KPIs, and trend lines update in real time without anyone touching a spreadsheet.", tools: ["Looker Studio", "Notion", "Sheets"] },
      { title: "Report delivered to leaders", desc: "Automated summary email sent to the right people every Monday with highlights and anomalies flagged.", tools: ["Gmail", "Slack", "PDF export"] }
    ],
    before: "Someone spends hours every week pulling numbers from five tools, formatting a spreadsheet, and emailing a PDF that is already out of date.",
    after: "Leadership opens one live dashboard with accurate numbers, trend alerts, and no manual effort from anyone on the team."
  },
  support: {
    label: "Customer Support",
    description: "Sorts, prioritises, and drafts responses to every inbound request so your team spends time solving problems, not reading emails.",
    hours: "15h", manual: "0", speed: "6×",
    steps: [
      { title: "Request arrives", desc: "Email, website form, live chat, or help desk ticket triggers the automation instantly.", tools: ["Zendesk", "Gmail", "Intercom"] },
      { title: "Classify and prioritise", desc: "AI reads the message, identifies the topic, urgency level, and customer tier in seconds.", tools: ["GPT-4o", "Zendesk", "Make"] },
      { title: "Check knowledge base", desc: "Searches internal docs and past tickets for the right answer or resolution path.", tools: ["Notion", "Confluence", "Pinecone"] },
      { title: "Draft personalised response", desc: "Writes a reply in your brand tone, pre-filled with the customer's name, account details, and solution.", tools: ["GPT-4o", "Zendesk", "Gmail"] },
      { title: "Agent reviews and sends", desc: "Agent sees draft response, approves in one click. Complex cases are escalated with full context attached.", tools: ["Slack alert", "Zendesk", "CRM"] }
    ],
    before: "Support agents read every ticket from scratch, search for answers manually, and copy-paste the same replies dozens of times a day.",
    after: "Agents start every shift with triaged tickets, pre-written drafts, and context already loaded. Resolution time drops by over half."
  },
  finance: {
    label: "Finance & Invoicing",
    description: "Captures invoices and expenses from any source, validates them against your records, and moves them through approval without any chasing.",
    hours: "10h", manual: "0", speed: "5×",
    steps: [
      { title: "Invoice or receipt received", desc: "Email attachment, shared folder upload, or supplier portal submission triggers the process.", tools: ["Gmail", "Google Drive", "Xero"] },
      { title: "Extract key data", desc: "AI reads supplier name, amount, date, VAT, and line items from any document format automatically.", tools: ["GPT-4o", "OCR", "n8n"] },
      { title: "Match and validate", desc: "Cross-checks against purchase orders, existing supplier records, and spending limits. Flags anything unusual.", tools: ["Xero", "QuickBooks", "Airtable"] },
      { title: "Route for approval", desc: "Invoices within policy are auto-approved. Exceptions are sent to the right approver with full context.", tools: ["Slack", "Gmail", "Approval flow"] },
      { title: "Filed and reconciled", desc: "Approved invoices are posted to the ledger, filed in the right folder, and the supplier is notified automatically.", tools: ["Xero", "Google Drive", "Gmail"] }
    ],
    before: "Finance team manually opens every email, re-types numbers into spreadsheets, chases approvals over Slack, and reconciles at month end.",
    after: "Invoices process themselves. Finance spends time on analysis and strategy instead of data entry and chasing signatures."
  },
  hr: {
    label: "HR & Onboarding",
    description: "From offer accepted to day one ready — contracts, accounts, welcome packs, and manager briefings all happen without HR lifting a finger.",
    hours: "9h", manual: "0", speed: "5×",
    steps: [
      { title: "Offer accepted in ATS", desc: "Candidate marks offer as accepted in the applicant tracking system, triggering the full onboarding flow.", tools: ["Workable", "Greenhouse", "Gmail"] },
      { title: "Generate contract and docs", desc: "Contract auto-populated with name, role, salary, start date, and company policies. Sent for e-signature instantly.", tools: ["DocuSign", "GPT-4o", "Google Drive"] },
      { title: "Set up accounts and access", desc: "IT receives an automated request to create email, Slack, and system access before the start date.", tools: ["Slack", "Google Workspace", "Notion"] },
      { title: "Send welcome pack", desc: "Personalised welcome email, first-week schedule, team intro, and policy documents delivered automatically.", tools: ["Gmail", "Notion", "Calendar"] },
      { title: "Manager briefing created", desc: "Manager receives a one-page briefing on the new hire: background, role context, and 30-day plan template.", tools: ["Notion", "GPT-4o", "Slack"] }
    ],
    before: "HR manually emails contracts, chases signatures, messages IT separately, and copies the same welcome information into emails for every new starter.",
    after: "A new hire is fully set up before their start date with zero manual effort from HR. Every step is logged and nothing falls through the cracks."
  },
  marketing: {
    label: "Marketing Campaigns",
    description: "Turns a brief into a live, scheduled campaign across every channel — without the team spending days on copy, approvals, and publishing.",
    hours: "14h", manual: "0", speed: "7×",
    steps: [
      { title: "Campaign brief submitted", desc: "Marketing manager fills a short form or sends a Slack message. That is the only manual step.", tools: ["Notion", "Slack", "Typeform"] },
      { title: "Research and angle generation", desc: "AI pulls competitor content, trending topics, and audience signals to recommend the best campaign angle.", tools: ["GPT-4o", "Perplexity", "SEMrush"] },
      { title: "Generate content variants", desc: "Writes email copy, social captions, ad headlines, and blog intro in your brand voice across every channel.", tools: ["GPT-4o", "Brand guidelines", "Canva API"] },
      { title: "Review and approve", desc: "Draft content is posted to Notion or Slack for one-click approval. Edits are fed back and regenerated instantly.", tools: ["Notion", "Slack", "Google Docs"] },
      { title: "Schedule and publish", desc: "Approved content is scheduled across email, LinkedIn, Instagram, and paid channels automatically.", tools: ["Mailchimp", "Buffer", "Meta Ads"] }
    ],
    before: "Campaign takes two weeks of back-and-forth: briefing copywriters, waiting for drafts, chasing approvals, then manually scheduling across six tools.",
    after: "Campaign is researched, written, approved, and live within 48 hours. The team focuses on strategy and results, not production work."
  },
  legal: {
    label: "Legal & Contracts",
    description: "Drafts, reviews, routes, and files contracts without your team re-reading the same clauses or chasing signatures across email threads.",
    hours: "11h", manual: "0", speed: "4×",
    steps: [
      { title: "Contract request raised", desc: "Sales team, operations, or a client triggers a contract request via CRM, email, or a simple form.", tools: ["HubSpot", "Typeform", "Gmail"] },
      { title: "Select template and populate", desc: "System picks the right contract template and fills it with counterparty name, dates, terms, and deal-specific values.", tools: ["GPT-4o", "DocuSign", "Google Docs"] },
      { title: "AI clause review", desc: "AI scans the draft for unusual terms, missing standard clauses, liability gaps, and flags anything that needs human review.", tools: ["GPT-4o", "Legal rules", "n8n"] },
      { title: "Route for approval and signature", desc: "Standard contracts go straight to DocuSign. Flagged items go to the legal reviewer with an annotated summary.", tools: ["DocuSign", "Slack", "Gmail"] },
      { title: "Filed and CRM updated", desc: "Signed contract is stored in the correct folder, metadata extracted, and the CRM deal is automatically updated.", tools: ["Google Drive", "HubSpot", "Airtable"] }
    ],
    before: "Legal team manually drafts each contract from scratch, reviews the same standard clauses every time, and chases signatures for weeks over email.",
    after: "Standard contracts are drafted, reviewed, and sent for signature in under an hour. Legal only gets involved when there is a genuine risk to assess."
  },
  ecommerce: {
    label: "E-commerce Operations",
    description: "Keeps inventory, fulfilment, customer communications, and returns in sync across every channel without anyone manually updating records.",
    hours: "18h", manual: "0", speed: "8×",
    steps: [
      { title: "Order placed or return requested", desc: "New order, cancellation, or return request arrives from Shopify, marketplace, or direct channel.", tools: ["Shopify", "Amazon", "WooCommerce"] },
      { title: "Inventory updated instantly", desc: "Stock levels adjusted across all channels the moment an order is confirmed. Overselling is eliminated.", tools: ["Shopify", "n8n", "Airtable"] },
      { title: "Fulfilment triggered", desc: "Warehouse or 3PL receives the pick list automatically. Tracking number is generated and logged.", tools: ["ShipStation", "Royal Mail", "3PL API"] },
      { title: "Customer kept informed", desc: "Confirmation, dispatch, and delivery notifications sent automatically. Returns handled with one-click label generation.", tools: ["Klaviyo", "Gmail", "Shopify"] },
      { title: "Data synced and reported", desc: "Revenue, returns, and stock data flow into the dashboard. Reorder alerts fire when stock hits threshold.", tools: ["Shopify", "Looker Studio", "Slack"] }
    ],
    before: "Operations team manually checks orders, updates spreadsheets, emails customers individually, and discovers stock issues only when a customer complains.",
    after: "Every order flows from placement to delivery without anyone touching it. The team manages by exception, not by routine."
  },
  ops: {
    label: "Business Operations",
    description: "Runs all recurring operational tasks on schedule — checks, updates, alerts, and handoffs — without anyone needing to remember to do them.",
    hours: "16h", manual: "0", speed: "6×",
    steps: [
      { title: "Scheduled trigger fires", desc: "Daily, weekly, or event-based trigger starts the workflow. No human needs to initiate anything.", tools: ["n8n", "Make", "Cron"] },
      { title: "Gather data from systems", desc: "Pulls current status from CRM, project tools, finance system, and ops platforms in one pass.", tools: ["HubSpot", "Notion", "Xero"] },
      { title: "Run checks and comparisons", desc: "Compares actuals against targets, SLAs, deadlines, and thresholds. Flags anything outside expected range.", tools: ["GPT-4o", "n8n", "Airtable"] },
      { title: "Alert and escalate", desc: "Issues are sent to the right person with context. Routine status updates go to the team automatically.", tools: ["Slack", "Gmail", "Teams"] },
      { title: "Log and archive", desc: "Every run is logged with timestamp, findings, and actions taken. Audit trail maintained automatically.", tools: ["Notion", "Google Drive", "Airtable"] }
    ],
    before: "Operations managers spend hours each week on status checks, chasing updates from different tools, and compiling reports nobody has time to read.",
    after: "Operations run on autopilot. The team gets alerted only when something needs a decision. Everything else is handled, logged, and tracked."
  },
  data: {
    label: "Data Pipelines",
    description: "Connects every data source your business uses, cleans the data automatically, and loads it into one place your team can actually trust.",
    hours: "20h", manual: "0", speed: "10×",
    steps: [
      { title: "New data source connected", desc: "API, webhook, CSV upload, or database connection established. No engineering resource required.", tools: ["n8n", "Fivetran", "Airbyte"] },
      { title: "Raw data extracted", desc: "Data is pulled on a schedule or in real time, handling rate limits, pagination, and authentication automatically.", tools: ["Python", "n8n", "API"] },
      { title: "Clean, map, and validate", desc: "Column names standardised, data types corrected, nulls handled, and duplicates removed before anything is stored.", tools: ["GPT-4o", "dbt", "Python"] },
      { title: "Load to data warehouse", desc: "Clean data is written to BigQuery, Postgres, or your chosen warehouse with schema versioning maintained.", tools: ["BigQuery", "Postgres", "Snowflake"] },
      { title: "Analysts get fresh, trusted data", desc: "Dashboard refreshes automatically. Anomaly alerts fire if data quality drops. No manual intervention needed.", tools: ["Looker Studio", "Metabase", "Slack"] }
    ],
    before: "Data team spends most of its time fixing broken pipelines, arguing about which spreadsheet is correct, and manually refreshing dashboards every morning.",
    after: "Analysts open their tools and the data is already clean, current, and consistent. They spend their time finding insights, not fixing data problems."
  }
};

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

const setHTML = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = value;
};

const applyWorkflow = (flow) => {
  setText("[data-wf-label]", flow.label);
  setText("[data-wf-description]", flow.description);
  setText("[data-wf-hours]", flow.hours);
  setText("[data-wf-manual]", flow.manual);
  setText("[data-wf-speed]", flow.speed);
  setText("[data-wf-before]", flow.before);
  setText("[data-wf-after]", flow.after);

  const stepKeys = ["s1","s2","s3","s4","s5"];
  flow.steps.forEach((step, i) => {
    const k = stepKeys[i];
    setText(`[data-wf-${k}-title]`, step.title);
    setText(`[data-wf-${k}-desc]`, step.desc);
    setHTML(`[data-wf-${k}-tools]`, step.tools.map(t => `<span>${t}</span>`).join(""));
  });
};

document.querySelectorAll("[data-workflow]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-workflow]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const flow = workflows[button.dataset.workflow];
    const pipeline = document.querySelector("[data-wf-pipeline]");
    const canvas = document.querySelector(".wf-canvas");

    if (hasGsap && !prefersReducedMotion && pipeline) {
      gsap.to(pipeline, {
        y: 12, autoAlpha: 0, duration: 0.18,
        onComplete: () => {
          applyWorkflow(flow);
          gsap.to(pipeline, { y: 0, autoAlpha: 1, duration: 0.42, ease: "power3.out" });
        }
      });
      if (canvas) {
        gsap.fromTo(canvas, { borderColor: "rgba(0,169,143,0.6)" }, { borderColor: "rgba(0,125,112,0.18)", duration: 0.8 });
      }
    } else {
      applyWorkflow(flow);
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

// ── Stat counters ──────────────────────────────────────────────
const animateCounter = (el) => {
  const target = parseFloat(el.dataset.target);
  if (!target) return;
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1800;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * ease);
    el.textContent = prefix + value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".stat-number[data-target]").forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector(".stats-bar");
if (statsBar) counterObserver.observe(statsBar);

// ── Timeline scroll activation ─────────────────────────────────
const timelineSteps = document.querySelectorAll(".timeline-step");
const timelineTrackFill = document.querySelector(".timeline-track-fill");

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, { threshold: 0.25, rootMargin: "0px 0px -60px 0px" });

timelineSteps.forEach(step => timelineObserver.observe(step));

// Animate the track fill on scroll
if (timelineTrackFill) {
  const trackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timelineTrackFill.classList.add("is-animated");
        trackObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });
  const timeline = document.querySelector(".timeline");
  if (timeline) trackObserver.observe(timeline);
}

let libraryChecks = 0;
const libraryTimer = window.setInterval(() => {
  libraryChecks += 1;
  startSmoothScroll();
  upgradeMotion();
  if (libraryChecks > 60 || (window.__clarianaLenisStarted && window.__clarianaGsapUpgraded)) {
    window.clearInterval(libraryTimer);
  }
}, 120);

// ── Scroll to top button ───────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('is-visible');
    } else {
      scrollTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
