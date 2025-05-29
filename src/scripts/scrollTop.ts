const btn = document.getElementById("scrollToTopBtn");
const hero = document.getElementById("hero");

function isBelowHero() {
  //   console.log(hero);
  if (!hero) return window.scrollY > 100;
  const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
  return window.scrollY > heroBottom - 40;
}

btn?.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function toggleBtn() {
  console.log(btn, isBelowHero());
  if (btn) {
    if (isBelowHero()) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  }
}
// Inicjalizacja stanu przycisku

export const initScrollToTopBtn = () => {
  toggleBtn();
  window.addEventListener("scroll", toggleBtn);
  window.addEventListener("resize", toggleBtn);
};
