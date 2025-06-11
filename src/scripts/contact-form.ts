import IMask from "imask";

type FormControls = Record<
  string,
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
>;
type FormErrorControls = Record<string, HTMLParagraphElement | null>;

type FormData = {
  name: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  subject: string | undefined;
  message: string | undefined;
  recaptchaToken: unknown;
};

type errorTypes = {
  required?: string;
  min?: string;
  max?: string;
  minLength?: string;
  minHeight?: string;
  maxHeight?: string;
  step?: string;
  email?: string;
  url?: string;
};

const messages: Record<string, string> = {
  success: "🎉 Formularz został wysłany! 🎉",
  failed: "⛔ Mamy jakiś problem, niestety formularz nie został wysłany!",
  serverError: "⛔ Błąd połączenia z serwerem ⛔",
};

const errorMessages: Record<string, errorTypes> = {
  name: { required: "Pole 'Imię i nazwisko' jest obowiązkowe!" },
  email: { required: "Pole 'Email' jest obowiązkowe!" },
  phone: { required: "Pole 'Telefon' jest obowiązkowe!" },
  subject: { required: "Pole 'Temat' jest obowiązkowe!" },
  message: { required: "Pole 'Wiadomość' jest obowiązkowe!" },
};

export const initContactForm = () => {
  const form: HTMLFormElement | null = document.querySelector("#contactForm");
  const submitBtn: HTMLButtonElement | null = document.querySelector(
    "button[type=submit]"
  );
  const formMessage: HTMLElement | null =
    document.getElementById("formMessage");
  const errors: NodeListOf<HTMLParagraphElement> | null =
    document.querySelectorAll(".error-msg");
  const inputs: FormControls = {
    name: document.querySelector("#name"),
    email: document.querySelector("#email"),
    phone: document.querySelector("#phone"),
    subject: document.querySelector("#subject"),
    message: document.querySelector("#message"),
  };

  const errorMessagesControls: FormErrorControls = {
    name: document.querySelector("#nameError"),
    email: document.querySelector("#emailError"),
    phone: document.querySelector("#phoneError"),
    subject: document.querySelector("#subjectError"),
    message: document.querySelector("#messageError"),
  };

  const phoneMaskOptions = {
    mask: "+{00} 000-00[0-0]00",
  };
  if (inputs.phone) {
    IMask(inputs.phone, phoneMaskOptions);
  }

  form?.addEventListener("submit", async e => {
    e.preventDefault();
    clearErrors();

    const formData: FormData = {
      name: inputs.name?.value.trim(),
      email: inputs.email?.value.trim(),
      phone: inputs.phone?.value.trim(),
      subject: inputs.subject?.value.trim(),
      message: inputs.message?.value.trim(),
      recaptchaToken: await getRecaptchaToken(),
    };

    if (form.checkValidity()) {
      submitForm(formData);
    }
  });

  function handleInvalid(event: Event) {
    const target = event.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const errorElement = target.id ? errorMessagesControls[target.id] : null;
    const errorRequiredMessage = target.id
      ? errorMessages[target.id].required
      : null;

    if (!target.value && errorRequiredMessage) {
      target.setCustomValidity(errorRequiredMessage);
    }

    if (errorElement) {
      errorElement.textContent = target.validationMessage;
    }
  }

  function handleInput(event: Event) {
    const target = event.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const errorElement = target.id ? errorMessagesControls[target.id] : null;

    if (target.value) {
      target.setCustomValidity("");
    }
    if (errorElement) {
      errorElement.textContent = "";
    }
    target.checkValidity();
  }

  async function getRecaptchaToken() {
    const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    return new Promise(resolve => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(recaptchaSiteKey, {
            action: "submit",
          })
          .then(token => resolve(token));
      });
    });
  }

  async function submitForm(data: FormData) {
    submitBtn?.classList.add("loading");
    submitBtn?.setAttribute("disabled", "disabled");
    try {
      const response = await fetch("../api/send-email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        showMessage(messages.success, "success");
        form?.reset();
      } else {
        showMessage(
          `${messages.failed}: (${result.error} || "Nieznany błąd")`,
          "error"
        );
      }
    } catch (error) {
      showMessage(messages.serverError, "error");
      console.error(error);
    }
    submitBtn?.classList.remove("loading");
    submitBtn?.removeAttribute("disabled");
  }

  function clearErrors() {
    if (errors) {
      Array.from(errors).forEach(el => {
        el.textContent = "";
      });
    }
  }

  function showMessage(message: string, color: string) {
    if (formMessage) {
      formMessage.textContent = message;
      formMessage.classList.add(color);
      formMessage.classList.remove("hidden");
    }
  }

  inputs.name?.addEventListener("invalid", handleInvalid);
  inputs.email?.addEventListener("invalid", handleInvalid);
  inputs.phone?.addEventListener("invalid", handleInvalid);
  inputs.subject?.addEventListener("invalid", handleInvalid);
  inputs.message?.addEventListener("invalid", handleInvalid);

  inputs.name?.addEventListener("input", handleInput);
  inputs.email?.addEventListener("input", handleInput);
  inputs.phone?.addEventListener("input", handleInput);
  inputs.subject?.addEventListener("input", handleInput);
  inputs.message?.addEventListener("input", handleInput);
};
