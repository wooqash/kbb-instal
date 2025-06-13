export const initFocusTrap = (modal: HTMLElement) => {
  // Find all the buttons
  const focusableElements: NodeListOf<HTMLElement> = modal.querySelectorAll(
    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
  );
  if (focusableElements) {
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const ev = event as PointerEvent;
    console.log(document.activeElement === lastElement && !ev?.shiftKey);

    if (lastElement) {
      console.log(lastElement);
      ev.preventDefault();
      lastElement.tabIndex = 0;
      lastElement.focus();
    }

    // if the lastElement has focus and shift key wasn't pressed
    // then focus the firstElement
    if (document.activeElement === lastElement && !ev?.shiftKey) {
      ev.preventDefault();
      firstElement.focus();
    }

    // if the firstElement has focus and shift key was pressed
    // then focus the lastElement
    if (document.activeElement === firstElement && ev.shiftKey) {
      ev.preventDefault();
      lastElement.focus();
    }
  }
};
