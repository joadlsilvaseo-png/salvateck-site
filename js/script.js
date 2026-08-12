/* =========================================================
   SALVATECK
   Landing Page Institucional
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     ELEMENTOS
  ========================================================= */

  const menuButton = document.querySelector("#menu-button");
  const siteNav = document.querySelector("#site-nav");

  const internalLinks = document.querySelectorAll('a[href^="#"]');

  const whatsappLinks = document.querySelectorAll(
    'a[href*="wa.me"], a[href*="whatsapp.com"]',
  );

  const mobileBreakpoint = 860;

  /* =========================================================
     MENU MOBILE
  ========================================================= */

  function setMobileMenu(open) {
    if (!menuButton || !siteNav) {
      return;
    }

    siteNav.classList.toggle("is-open", open);
    menuButton.classList.toggle("is-open", open);

    menuButton.setAttribute("aria-expanded", String(open));

    menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }

  function toggleMobileMenu() {
    if (!siteNav) {
      return;
    }

    const menuIsOpen = siteNav.classList.contains("is-open");

    setMobileMenu(!menuIsOpen);
  }

  if (menuButton && siteNav) {
    menuButton.addEventListener("click", toggleMobileMenu);
  }

  /* =========================================================
     FECHAR MENU AO CLICAR FORA
  ========================================================= */

  document.addEventListener("click", (event) => {
    if (!menuButton || !siteNav) {
      return;
    }

    if (!siteNav.classList.contains("is-open")) {
      return;
    }

    const clickedMenu = siteNav.contains(event.target);
    const clickedButton = menuButton.contains(event.target);

    if (!clickedMenu && !clickedButton) {
      setMobileMenu(false);
    }
  });

  /* =========================================================
     FECHAR MENU COM ESC
  ========================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    setMobileMenu(false);
  });

  /* =========================================================
     FECHAR MENU AO VOLTAR PARA DESKTOP
  ========================================================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > mobileBreakpoint) {
      setMobileMenu(false);
    }
  });

  /* =========================================================
     NAVEGAÇÃO ENTRE SEÇÕES
  ========================================================= */

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      setMobileMenu(false);

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  /* =========================================================
     WHATSAPP
  ========================================================= */

  const whatsappMessage =
    "Olá! Vim pelo site da Salvateck e gostaria de solicitar um atendimento para meu condomínio.";

  whatsappLinks.forEach((link) => {
    try {
      const url = new URL(link.href);

      if (!url.searchParams.has("text")) {
        url.searchParams.set("text", whatsappMessage);

        link.href = url.toString();
      }
    } catch (error) {
      console.warn("Não foi possível preparar o link do WhatsApp.", error);
    }

    link.addEventListener("click", () => {
      trackEvent("whatsapp_click", {
        link_text:
          link.textContent.trim() ||
          link.getAttribute("aria-label") ||
          "WhatsApp",

        page_section:
          link.closest("section")?.id ||
          link.closest("header")?.id ||
          link.closest("footer")?.className ||
          "pagina",
      });
    });
  });

  /* =========================================================
     EVENTOS PARA GA4
  ========================================================= */

  function trackEvent(eventName, eventParameters = {}) {
    if (typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", eventName, eventParameters);
  }

  /* =========================================================
     CLIQUES NOS SERVIÇOS
  ========================================================= */

  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    card.addEventListener("click", () => {
      const serviceName = card.querySelector("h3")?.textContent.trim();

      if (!serviceName) {
        return;
      }

      trackEvent("service_interest", {
        service_name: serviceName,
      });
    });
  });

  /* =========================================================
     ACOMPANHAMENTO DAS SEÇÕES
  ========================================================= */

  const trackedSections = document.querySelectorAll("main section[id]");

  const viewedSections = new Set();

  if ("IntersectionObserver" in window && trackedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const sectionId = entry.target.id;

          if (viewedSections.has(sectionId)) {
            return;
          }

          viewedSections.add(sectionId);

          trackEvent("section_view", {
            section_name: sectionId,
          });
        });
      },
      {
        threshold: 0.45,
      },
    );

    trackedSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* =========================================================
     ANIMAÇÕES DE ENTRADA
  ========================================================= */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll(
      [
        ".section-heading",
        ".service-card",
        ".process-step",
        ".technology__content",
        ".technology__visual",
        ".preventive__card",
        ".document-card",
        ".why-us__image",
        ".why-us__content",
        ".final-cta__card",
      ].join(","),
    );

    revealElements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";

      element.style.transition = [
        "opacity 600ms ease",
        "transform 600ms ease",
      ].join(", ");

      element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
    });

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -45px 0px",
        },
      );

      revealElements.forEach((element) => {
        revealObserver.observe(element);
      });
    } else {
      revealElements.forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
    }
  }

  /* =========================================================
     ANO DO RODAPÉ
  ========================================================= */

  const footerCopyright = document.querySelector(
    ".site-footer__bottom span:first-child",
  );

  if (footerCopyright) {
    footerCopyright.textContent = footerCopyright.textContent.replace(
      /\b20\d{2}\b/,
      String(new Date().getFullYear()),
    );
  }
});
