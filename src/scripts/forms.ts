const contactForm = <HTMLFormElement>document.getElementById("contactForm");
// Obsługa formularza kontaktowego
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Walidacja formularza
    const name = (<HTMLInputElement>document.getElementById("name")).value;
    const email = (<HTMLInputElement>document.getElementById("email")).value;
    const subject = (<HTMLInputElement>document.getElementById("subject"))
      .value;
    const message = (<HTMLInputElement>document.getElementById("message"))
      .value;

    if (!name || !email || !subject || !message) {
      showFormAlert("Proszę wypełnić wszystkie wymagane pola", "error");
      return;
    }

    // Symulacja wysyłania formularza
    const submitBtn: HTMLButtonElement | null = contactForm.querySelector(
      'button[type="submit"]'
    );
    if (submitBtn) {
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Wysyłanie...";

      // Symulacja opóźnienia serwera
      setTimeout(() => {
        // Tutaj normalnie byłoby wysłanie formularza do API
        showFormAlert("Wiadomość została wysłana. Dziękujemy!", "success");
        contactForm.reset();

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1500);
    }
  });
}

// Funkcja wyświetlająca alert po wysłaniu formularza
function showFormAlert(message: string, type: string) {
  // Sprawdź, czy alert już istnieje i usuń go
  const existingAlert = document.querySelector(".form-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  // Stwórz nowy alert
  const alertDiv = document.createElement("div");
  alertDiv.className = `form-alert ${type}`;
  alertDiv.textContent = message;

  // Dodaj alert przed formularzem
  contactForm?.parentNode?.insertBefore(alertDiv, contactForm);

  // Usuń alert po 3 sekundach
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}
