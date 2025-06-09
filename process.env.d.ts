declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      RECAPTCHA_SECRET: string;
      RECAPTCHA_SITE_KEY: string;
      // add more environment variables and their types here
    }
  }
}
