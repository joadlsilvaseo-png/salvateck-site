/* =========================================================
   SALVATECK CASHBACK
   JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     ELEMENTOS
  ======================================================= */

  const whatsappButtons = document.querySelectorAll("[data-cashback-whatsapp]");

  const backToSiteButton = document.querySelector(".cashback-back");

  const trackedSections = [
    {
      element: document.querySelector(".cashback-process"),
      name: "como_funciona",
    },
    {
      element: document.querySelector(".cashback-summary"),
      name: "resumo",
    },
    {
      element: document.querySelector(".cashback-footer"),
      name: "beneficios",
    },
  ];

  /* =======================================================
     ANIMAÇÕES AO ROLAR
  ======================================================= */

  const revealElements = [];

  function registerReveal(selector, animationClass = "", stagger = false) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element, index) => {
      element.classList.add("reveal");

      if (animationClass) {
        element.classList.add(animationClass);
      }

      if (stagger) {
        const delay = (index % 6) + 1;

        element.classList.add(`reveal-delay-${delay}`);
      }

      revealElements.push(element);
    });
  }

  registerReveal(".cashback-intro__title", "reveal--left");

  registerReveal(".cashback-intro__message", "reveal--right");

  registerReveal(".cashback-cta--mobile", "reveal--scale");

  registerReveal(".cashback-section-title");

  registerReveal(".cashback-step", "reveal--scale", true);

  registerReveal(".cashback-example", "reveal--scale");

  registerReveal(".cashback-cycle", "reveal--right");

  registerReveal(".cashback-cycle .cashback-cta", "reveal--scale");

  registerReveal(".cashback-summary", "reveal--scale");

  registerReveal(".cashback-summary__item", "", true);

  registerReveal(".cashback-benefit", "", true);

  registerReveal(".cashback-footer__tagline", "reveal--right");

  if (
    "IntersectionObserver" in window &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches
  ) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* =======================================================
     GOOGLE ANALYTICS
  ======================================================= */

  function trackEvent(eventName, parameters = {}) {
    if (typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", eventName, parameters);
  }

  /* =======================================================
     CTA WHATSAPP
  ======================================================= */

  whatsappButtons.forEach((button) => {
    button.addEventListener("click", () => {
      let buttonLocation = "cashback";

      if (button.closest(".cashback-cta--desktop")) {
        buttonLocation = "card_e_continua";
      }

      if (button.closest(".cashback-cta--mobile")) {
        buttonLocation = "topo_mobile";
      }

      if (button.closest(".cashback-whatsapp-float")) {
        buttonLocation = "floating_whatsapp";
      }

      trackEvent("cashback_whatsapp_click", {
        button_location: buttonLocation,
        page_name: "salvateck_cashback",
      });
    });
  });

  /* =======================================================
     VOLTAR AO SITE
  ======================================================= */

  if (backToSiteButton) {
    backToSiteButton.addEventListener("click", () => {
      trackEvent("cashback_back_to_site", {
        page_name: "salvateck_cashback",
      });
    });
  }

  /* =======================================================
     VISUALIZAÇÃO DAS SEÇÕES
  ======================================================= */

  const viewedSections = new Set();

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const sectionName = entry.target.dataset.analyticsSection;

          if (!sectionName || viewedSections.has(sectionName)) {
            return;
          }

          viewedSections.add(sectionName);

          trackEvent("cashback_section_view", {
            section_name: sectionName,
            page_name: "salvateck_cashback",
          });
        });
      },
      {
        threshold: 0.35,
      },
    );

    trackedSections.forEach(({ element, name }) => {
      if (!element) {
        return;
      }

      element.dataset.analyticsSection = name;

      sectionObserver.observe(element);
    });
  }

  /* =======================================================
     PROFUNDIDADE DE ROLAGEM
  ======================================================= */

  const scrollDepths = [25, 50, 75, 90];

  const trackedScrollDepths = new Set();

  function trackScrollDepth() {
    const documentHeight = document.documentElement.scrollHeight;

    const viewportHeight = window.innerHeight;

    const scrollPosition = window.scrollY + viewportHeight;

    const scrollableHeight = documentHeight;

    if (scrollableHeight <= 0) {
      return;
    }

    const scrollPercentage = (scrollPosition / scrollableHeight) * 100;

    scrollDepths.forEach((depth) => {
      if (scrollPercentage >= depth && !trackedScrollDepths.has(depth)) {
        trackedScrollDepths.add(depth);

        trackEvent("cashback_scroll_depth", {
          percent_scrolled: depth,
          page_name: "salvateck_cashback",
        });
      }
    });
  }

  window.addEventListener("scroll", trackScrollDepth, {
    passive: true,
  });

  trackScrollDepth();

  /* =======================================================
     TEMPO DE ENGAJAMENTO
  ======================================================= */

  const engagementTimes = [15, 30, 60];

  engagementTimes.forEach((seconds) => {
    window.setTimeout(() => {
      if (document.visibilityState !== "visible") {
        return;
      }

      trackEvent("cashback_engagement_time", {
        seconds_on_page: seconds,
        page_name: "salvateck_cashback",
      });
    }, seconds * 1000);
  });

  /* =======================================================
     CARREGAMENTO DA PÁGINA
  ======================================================= */

  trackEvent("cashback_page_loaded", {
    page_name: "salvateck_cashback",
  });
});
