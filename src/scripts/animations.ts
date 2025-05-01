// Elementy DOM
const aboutSection = document.querySelector("#about");
const aboutText = document.querySelector(".about-text");
const aboutImage = document.querySelector(".about-image");
const features = document.querySelectorAll(".feature");

// Funkcja do animacji elementów przy scrollowaniu
const animateAboutSection = function () {
  const aboutPosition = aboutSection?.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  if (aboutPosition && aboutPosition < windowHeight - 100) {
    // Animacja tekstu
    aboutText?.classList.add("animate-fade-in-left");

    // Animacja obrazu
    setTimeout(() => {
      aboutImage?.classList.add("animate-fade-in-right");
    }, 300);

    // Animacja feature boxes z opóźnieniem
    features.forEach((feature, index) => {
      setTimeout(
        () => {
          feature.classList.add("animate-fade-in-up");
        },
        600 + index * 200
      );
    });

    // Usunięcie listenera po wykonaniu animacji
    window.removeEventListener("scroll", animateAboutSection);
  }
};

// Animacja elementów przy scrollowaniu
const animateOnScroll = function () {
  const elements = document.querySelectorAll(
    ".feature, .service-card, .category, .portfolio-item, .testimonial"
  );

  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementPosition < windowHeight - 100) {
      element.classList.add("fade-in");
    }
  });
};

// Dodaj klasę CSS dla animacji
const style = document.createElement("style");
style.textContent = `
  .feature, .service-card, .category, .portfolio-item, .testimonial {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  
  .fade-in {
    opacity: 1;
            transform: translateY(0);
        }
        
        .form-alert {
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        
        .form-alert.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .form-alert.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        `;
document.head.appendChild(style);

// Wywołaj animację przy załadowaniu strony i podczas scrollowania
export const initAnimation = () => {
  window.addEventListener("load", animateOnScroll);
  window.addEventListener("scroll", animateOnScroll);
  window.addEventListener("scroll", animateAboutSection);
};
