import "./style.css";
import { initHeader } from "./scripts/header";
import { initAnimation } from "./scripts/animations";
import { initHeroSlider } from "./scripts/hero";

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
