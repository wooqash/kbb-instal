const slides = document.querySelectorAll(".hero-slider .slide");
const dotsContainer = document.querySelector(".slider-dots");
let currentSlide = 0;
const delay = 5000;
let slideInterval: NodeJS.Timeout;

// Tworzenie kropek nawigacyjnych
const createDots = () => {
  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      goToSlide(index);
      resetInterval();
    });
    dotsContainer?.appendChild(dot);
  });
};

// Przejście do konkretnego slajdu
const goToSlide = (index: number) => {
  // Usunięcie klasy active z aktualnego slajdu i kropki
  slides[currentSlide].classList.remove("active");
  document
    .querySelectorAll(".slider-dots .dot")
    [currentSlide].classList.remove("active");

  // Ustawienie nowego aktualnego slajdu
  currentSlide = index;

  // Jeśli indeks przekracza liczbę slajdów, wracamy do pierwszego
  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  // Jeśli indeks jest ujemny, przechodzimy do ostatniego slajdu
  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }

  // Dodanie klasy active do nowego aktualnego slajdu i kropki
  slides[currentSlide].classList.add("active");
  document
    .querySelectorAll(".slider-dots .dot")
    [currentSlide].classList.add("active");
};

// Przejście do następnego slajdu
const nextSlide = () => {
  goToSlide(currentSlide + 1);
};

// Resetowanie interwału
const resetInterval = () => {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, delay); // Zmiana slajdu co 5 sekund
};

// Inicjalizacja
export const initHeroSlider = () => {
  createDots();
  resetInterval();
};
