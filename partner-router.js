(() => {
  const CFG = window.BSEG_PARTNER_CONFIG || { categories: {} };
  const PROFILE_KEY = "bseg_business_profile_v1";
  const ATTR_KEY = "bseg_attribution_v1";
  const EVENT_DEDUPE = "bseg_partner_impressions_v1";

  function safeJson(raw, fallback) {
    try { return JSON.parse(raw) || fallback; } catch (_) { return fallback; }
  }

  function profile() {
    return safeJson(localStorage.getItem(PROFILE_KEY), {});
  }

  function attribution() {
    const stored = safeJson(localStorage.getItem(ATTR_KEY), {});
    if (stored.first_touch || stored.last_touch) return stored;

    const p = new URLSearchParams(location.search);
    const touch = {
      ts: new Date().toISOString(),
      landing_page: location.pathname + location.search,
      referrer: document.referrer || "",
      utm_source: p.get("utm_source") || "",
      utm_medium: p.get("utm_medium") || "",
      utm_campaign: p.get("utm_campaign") || "",
      utm_content: p.get("utm_content") || "",
      utm_term: p.get("utm_term") || ""
    };
    const next = { first_touch: touch, last_touch: touch };
    localStorage.setItem(ATTR_KEY, JSON.stringify(next));
    return next;
  }

  function validHttps(url) {
    try {
      const u = new URL(url);
      return u.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  function active(category) {
    const c = CFG.categories?.[category];
    if (!c) return null;
    if (c.status !== "active") return null;
    if (!c.partner_key || !c.display_name || !validHttps(c.referral_url)) return null;
    return c;
  }

  async function track(eventType, category, partner, details = {}) {
    const p = profile();
    const a = attribution();
    const body = new URLSearchParams();
    body.set("form-name", "partner-events");
    body.set("event_type", eventType);
    body.set("business_id", p.business_id || "");
    body.set("category", category || "");
    body.set("partner_key", partner?.partner_key || "");
    body.set("source_page", location.pathname);
    body.set("first_touch_json", JSON.stringify(a.first_touch || {}));
    body.set("last_touch_json", JSON.stringify(a.last_touch || {}));
    body.set("details_json", JSON.stringify(details || {}));
    body.set("occurred_at", new Date().toISOString());

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        keepalive: true
      });
    } catch (_) {}

    if (window.BSEGAnalytics?.track) {
      window.BSEGAnalytics.track(eventType, {
        category: category || "",
        partner_key: partner?.partner_key || "",
        ...details
      });
    }
  }

  function outboundButton(category, partner, label) {
    const a = document.createElement("a");
    a.className = "btn btn-primary";
    a.href = partner.referral_url;
    a.rel = "sponsored noopener";
    a.target = "_blank";
    a.textContent = label || partner.cta_label || `Visit ${partner.display_name}`;
    a.addEventListener("click", () => {
      track("partner_click", category, partner, { cta_label: a.textContent });
    });
    return a;
  }

  function markImpression(category, partner, context) {
    const seen = safeJson(sessionStorage.getItem(EVENT_DEDUPE), {});
    const key = `${category}:${partner.partner_key}:${context}:${location.pathname}`;
    if (seen[key]) return;
    seen[key] = true;
    sessionStorage.setItem(EVENT_DEDUPE, JSON.stringify(seen));
    track("partner_cta_impression", category, partner, { context });
  }

  function hydrateSlot(el) {
    if (el.dataset.partnerHydrated === "1") return;
    const category = el.dataset.partnerSlot;
    const partner = active(category);
    if (!partner) {
      el.hidden = true;
      return;
    }

    el.dataset.partnerHydrated = "1";
    el.hidden = false;

    if (partner.requires_review && category === "payments") {
      el.innerHTML = `
        <div class="eyebrow">Approved partner path available</div>
        <h2 style="margin-bottom:10px">${partner.display_name}</h2>
        <p class="lead" style="font-size:.96rem">Black Summit routes payment-processing introductions through the free processing review so we can understand your current setup before you decide whether to connect.</p>
        <p class="disclosure">${partner.disclosure}</p>
        <div class="actions"><a class="btn btn-primary" href="/business-solutions/payments/review/" data-partner-review-link>Start Processing Review</a></div>`;
      el.querySelector("[data-partner-review-link]")?.addEventListener("click", () => {
        track("partner_review_path_click", category, partner);
      });
    } else {
      el.innerHTML = `
        <div class="eyebrow">Activated partner option</div>
        <h2 style="margin-bottom:10px">${partner.display_name}</h2>
        <p class="disclosure">${partner.disclosure}</p>
        <div class="actions" data-partner-button-holder></div>`;
      el.querySelector("[data-partner-button-holder]")?.appendChild(
        outboundButton(category, partner)
      );
    }
    markImpression(category, partner, "module_slot");
  }

  function hydrateFinderSlot(el) {
    if (el.dataset.partnerHydrated === "1") return;
    const category = el.dataset.partnerCta;
    const partner = active(category);
    if (!partner) {
      el.hidden = true;
      return;
    }
    el.dataset.partnerHydrated = "1";
    el.hidden = false;

    if (partner.requires_review && category === "payments") {
      el.innerHTML = `<a class="btn btn-secondary" href="/business-solutions/payments/review/">Start Free Processing Review</a>`;
      el.querySelector("a")?.addEventListener("click", () => {
        track("partner_review_path_click", category, partner, { context: "stack_finder" });
      });
    } else {
      el.appendChild(outboundButton(category, partner, partner.cta_label));
    }
    markImpression(category, partner, "stack_finder");
  }

  function showIntro(category, container) {
    const partner = active(category);
    if (!partner || !container) return false;

    container.hidden = false;
    container.innerHTML = `
      <div class="hero-card" style="margin-top:18px">
        <div class="eyebrow">Optional partner introduction</div>
        <h3 style="font-size:1.7rem;margin:.2rem 0 .7rem">${partner.display_name}</h3>
        <p class="lead" style="font-size:.92rem">Your Black Summit review has been submitted. If you want to continue, you can authorize an introduction to this activated partner.</p>
        <label class="check" style="margin:12px 0">
          <input type="checkbox" data-partner-consent>
          <span>I authorize Black Summit to record my request for an introduction to ${partner.display_name}. I understand underwriting, pricing, approval, and account setup are handled by the processor. Checking this box does not automatically transmit my uploaded statement or other sensitive files.</span>
        </label>
        <p class="disclosure">${partner.disclosure}</p>
        <div class="actions" data-intro-button></div>
      </div>`;

    const checkbox = container.querySelector("[data-partner-consent]");
    const holder = container.querySelector("[data-intro-button]");
    const button = outboundButton(category, partner, `Continue to ${partner.display_name}`);
    button.setAttribute("aria-disabled", "true");
    button.style.pointerEvents = "none";
    button.style.opacity = ".5";
    holder.appendChild(button);

    checkbox.addEventListener("change", () => {
      const enabled = checkbox.checked;
      button.style.pointerEvents = enabled ? "auto" : "none";
      button.style.opacity = enabled ? "1" : ".5";
      button.setAttribute("aria-disabled", enabled ? "false" : "true");
      if (enabled) track("partner_referral_intent", category, partner, { consent: true });
    });

    markImpression(category, partner, "post_review_intro");
    return true;
  }

  function hydrate(root = document) {
    root.querySelectorAll?.("[data-partner-slot]").forEach(hydrateSlot);
    root.querySelectorAll?.("[data-partner-cta]").forEach(hydrateFinderSlot);
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) hydrate(node);
      }
    }
  });

  window.BSEGPartners = {
    version: CFG.version || "unknown",
    getActive: active,
    track,
    hydrate,
    showIntro
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      hydrate();
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    hydrate();
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
