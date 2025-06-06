export const initHeader = () => {
  const MOBILE = 768;
  // const isMobile = false;
  let isScrolled = false;
  let menuIsOpen = false;
  // Elementy DOM
  const body = document.querySelector("body");
  const header = document.getElementById("header");
  const mobileMenuBtn: HTMLButtonElement | null =
    document.querySelector(".mobile-menu-btn");
  const nav = document.getElementById("nav");
  const navLinks: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll(".nav-link");

  const checkIsMobile = () => {
    if (window.innerWidth < MOBILE) {
      header?.classList.add("mobile");
    } else {
      header?.classList.remove("mobile");
    }
  };

  // Sticky Header
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100 && !menuIsOpen) {
      header?.classList.add("scrolled");
      isScrolled = true;
    } else {
      header?.classList.remove("scrolled");
      isScrolled = false;
    }
  });

  window.addEventListener("resize", function () {
    checkIsMobile();
  });

  // window.addEventListener("DOMContentLoaded", function () {
  //   checkIsMobile();
  // });

  // Mobile Menu Toggle
  mobileMenuBtn?.addEventListener("click", function () {
    if (nav) {
      nav.classList.toggle("active");

      // Zmiana ikony menu
      const icon = mobileMenuBtn.querySelector("i");
      if (nav.classList.contains("active")) {
        icon?.classList.remove("fa-bars");
        icon?.classList.add("fa-times");
        body?.classList.add("scroll-blocked");
        menuIsOpen = true;
        if (isScrolled) {
          header?.classList.remove("scrolled");
        }
      } else {
        icon?.classList.remove("fa-times");
        icon?.classList.add("fa-bars");
        body?.classList.remove("scroll-blocked");
        menuIsOpen = false;
        if (window.scrollY > 100) {
          header?.classList.add("scrolled");
        }
      }
    }
  });

  // Zamknięcie menu po kliknięciu w link
  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      if (nav) {
        nav.classList.remove("active");
        body?.classList.remove("scroll-blocked");
        menuIsOpen = false;
        const icon = mobileMenuBtn?.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }
    });
  });

  // Smooth Scroll dla linków nawigacyjnych
  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (Array.from(document.querySelectorAll("nav .active")).length === 0) {
        navLinks[0].classList.add("active");
      } else {
        document
          .querySelectorAll("nav .active")
          .forEach(link => link.classList.remove("active"));
        link.classList.add("active");
      }

      const targetId = this.getAttribute("href");
      if (targetId) {
        const targetSection: HTMLAnchorElement | null =
          document.querySelector(targetId);
        const headerHeight = header?.offsetHeight;
        if (targetSection && headerHeight) {
          window.scrollTo({
            top: targetSection.offsetTop - headerHeight,
            behavior: "smooth",
          });
        }
        header?.classList.add("scrolled");
      }
    });
  });
};
