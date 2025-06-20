import "./style.css";
import { initHeader } from "./scripts/header";
import { initAnimation } from "./scripts/animations";
import { initHeroSlider } from "./scripts/hero";
import { initGallery } from "./scripts/gallery";
import { protectInfo, copyrightDate } from "./scripts/protect-info";
import { initScrollToTopBtn } from "./scripts/scrollTop";
import { initContactForm } from "./scripts/contact-form";

export { sum } from "./sum";

document.addEventListener("DOMContentLoaded", function () {
  const serviceBtns: NodeListOf<HTMLAnchorElement> | null =
    document.querySelectorAll(".service-btn");
  const warehouseBtn: HTMLAnchorElement | null =
    document.querySelector(".warehouse-btn");
  const subjectField: HTMLSelectElement | null =
    document.querySelector("#subject");

  initHeader();
  initHeroSlider();
  initAnimation();
  initGallery();
  initScrollToTopBtn();
  protectInfo();
  initContactForm();
  copyrightDate();

  if (subjectField) {
    serviceBtns.forEach(button => {
      button.addEventListener("click", function () {
        subjectField.value = "services";
      });
    });

    warehouseBtn?.addEventListener("click", function () {
      subjectField.value = "warehouse";
    });
  }
});
