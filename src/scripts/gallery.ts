const filterBtns: NodeListOf<HTMLButtonElement> =
  document.querySelectorAll(".filter-btn");
const portfolioItems: NodeListOf<HTMLDivElement> =
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
let filteredItems: HTMLDivElement[] = [];

export const initGallery = () => {
  // Portfolio Filter
  filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      // Usuń klasę active ze wszystkich przycisków
      filterBtns.forEach(btn => btn.classList.remove("active"));

      // Dodaj klasę active do klikniętego przycisku
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      portfolioItems.forEach(item => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  //Ligthbox
  // Inicjalizacja filtrowanych elementów
  updateFilteredItems();

  // Obsługa kliknięcia na element portfolio
  portfolioItems.forEach(item => {
    item.addEventListener("click", function () {
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
      updateFilteredItems();

      // Filtruj elementy portfolio
      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        if (currentCategory === "all" || itemCategory === currentCategory) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // Funkcja aktualizująca filtrowane elementy
  function updateFilteredItems() {
    filteredItems = Array.from(portfolioItems).filter(item => {
      const itemCategory = item.getAttribute("data-category");
      return currentCategory === "all" || itemCategory === currentCategory;
    });

    // Aktualizuj całkowitą liczbę obrazów
    if (totalImages) {
      totalImages.textContent = filteredItems.length.toString();
    }
  }

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
