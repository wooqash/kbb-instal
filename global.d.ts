// global.d.ts
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options?: { action: string }
      ) => Promise<string>;
      // Dodaj inne funkcje, jeśli korzystasz z nich
    };
  }
}

export {};
