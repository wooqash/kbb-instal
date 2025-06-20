import { initFocusTrap } from "./focus-trap";

const portfolioItems: NodeListOf<HTMLAnchorElement> =
  document.querySelectorAll(".portfolio-item");
const loadMoreBtn = document.getElementById("load-more-btn");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById(
  "lightbox-image"
) as HTMLImageElement;
const lightboxTitle = document.getElementById(
  "lightbox-title"
) as HTMLHeadingElement;
const lightboxDescription = document.getElementById(
  "lightbox-description"
) as HTMLParagraphElement;
const closeLightbox = document.querySelector(".close-lightbox");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");
const currentIndex = document.getElementById(
  "current-index"
) as HTMLSpanElement;
const totalImages = document.getElementById("total-images") as HTMLSpanElement;

let currentImageIndex = 0;
let currentCategory: string | null | undefined = "all";
let filteredItems: HTMLAnchorElement[] = [];

// Dodaj zmienne globalne
const initialShow = 8; // Początkowa liczba widocznych zdjęć
const revealCount = 4; // Liczba zdjęć ładowanych przy każdym kliknięciu
let currentShow = initialShow;

// Modyfikacja funkcji updateFilteredItems
function updateFilteredItems() {
  filteredItems = Array.from(portfolioItems).filter(item => {
    const itemCategory = item.getAttribute("data-category");
    return currentCategory === "all" || itemCategory === currentCategory;
  });

  // Aktualizacja widocznych elementów
  filteredItems.forEach((item, index) => {
    item.style.display = index < currentShow ? "block" : "none";
  });

  // Aktualizuj całkowitą liczbę obrazów
  if (totalImages) {
    totalImages.textContent = filteredItems.length.toString();
  }

  // Aktualizacja przycisku "Załaduj więcej"
  updateLoadMoreButton();
}

// Funkcja obsługująca przycisk "Załaduj więcej"
function handleLoadMore() {
  currentShow += revealCount;
  updateFilteredItems();
}

// Funkcja aktualizująca stan przycisku
function updateLoadMoreButton() {
  const loadMoreBtn = document.getElementById("load-more-btn");
  if (!loadMoreBtn) return;

  if (currentShow >= filteredItems.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-block";
  }
}

export const initGallery = () => {
  loadMoreBtn?.addEventListener("click", handleLoadMore);

  //Ligthbox
  // Inicjalizacja filtrowanych elementów
  updateFilteredItems();

  // Obsługa kliknięcia na element portfolio
  portfolioItems.forEach(item => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const image = this.querySelector("img");
      const title = this.querySelector("h3")?.textContent || "";
      const description = this.querySelector("p")?.textContent || "";

      // Aktualizacja filtrowanych elementów
      currentCategory = document
        .querySelector(".filter-btn.active")
        ?.getAttribute("data-filter");
      updateFilteredItems();

      // Znajdź indeks klikniętego elementu w filtrowanej tablicy
      const itemIndex = filteredItems.findIndex(
        filteredItem => filteredItem === this
      );

      if (image) {
        openLightbox(itemIndex, image.src, title, description);
      }
    });
  });

  // Obsługa przycisków filtrowania
  const filterButtons: NodeListOf<HTMLButtonElement> =
    document.querySelectorAll(".filter-btn");
  filterButtons.forEach(button => {
    button.addEventListener("click", function () {
      // Usuń klasę active ze wszystkich przycisków
      filterButtons.forEach(btn => btn.classList.remove("active"));

      // Dodaj klasę active do klikniętego przycisku
      this.classList.add("active");

      // Aktualizuj kategorię i filtrowane elementy
      currentCategory = this.getAttribute("data-filter");
      currentShow = initialShow;

      // Filtruj elementy portfolio
      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        if (currentCategory === "all" || itemCategory === currentCategory) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });

      updateFilteredItems();
    });
  });

  // Funkcja otwierająca lightbox
  function openLightbox(
    index: number,
    src: string,
    title?: string,
    description?: string
  ) {
    lightboxImage.src = src;
    lightboxTitle.textContent = title || "";
    lightboxDescription.textContent = description || "";
    currentImageIndex = index;
    if (currentIndex) {
      currentIndex.textContent = currentImageIndex + 1 + "";
    }
    if (lightbox) {
      initFocusTrap(lightbox);
    }
    lightbox?.classList.add("active");
    document.body.style.overflow = "hidden"; // Zapobiega przewijaniu strony

    // Dodaj obsługę klawiatury
    document.addEventListener("keydown", handleKeyDown);
  }

  // Funkcja zamykająca lightbox
  function closeLightboxFunc() {
    lightbox?.classList.remove("active");
    document.body.style.overflow = ""; // Przywróć przewijanie strony

    // Usuń obsługę klawiatury
    document.removeEventListener("keydown", handleKeyDown);
  }

  // Funkcja wyświetlająca poprzedni obraz
  function showPrevImage() {
    currentImageIndex =
      (currentImageIndex - 1 + filteredItems.length) % filteredItems.length;
    updateLightboxImage();
  }

  // Funkcja wyświetlająca następny obraz
  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % filteredItems.length;
    updateLightboxImage();
  }

  // Funkcja aktualizująca obraz w lightbox
  function updateLightboxImage() {
    const item = filteredItems[currentImageIndex];
    const image = item.querySelector("img") as HTMLImageElement;
    const title = item.querySelector("h3")?.textContent;
    const description = item.querySelector("p")?.textContent;

    lightboxImage.src = image.src;
    lightboxTitle.textContent = title || "";
    lightboxDescription.textContent = description || "";
    currentIndex.textContent = currentImageIndex + 1 + "";
  }

  // Obsługa klawiszy
  function handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "Escape":
        closeLightboxFunc();
        break;
      case "ArrowLeft":
        showPrevImage();
        break;
      case "ArrowRight":
        showNextImage();
        break;
    }
  }

  // Event Listeners
  closeLightbox?.addEventListener("click", closeLightboxFunc);
  prevButton?.addEventListener("click", showPrevImage);
  nextButton?.addEventListener("click", showNextImage);

  // Zamknij lightbox klikając poza obrazem
  lightbox?.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightboxFunc();
    }
  });
};
