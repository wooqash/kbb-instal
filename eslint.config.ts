// eslint.config.js
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import stylelintPlugin from "eslint-plugin-stylelint";
import prettier from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      "node_modules/",
      "**/*.d.ts",
      "coverage/",
      "test/",
      ".history/",
      ".husky/",
      ".vscode",
      "build/",
      "*.config.*",
    ],
  },

  // Bazowe konfiguracje
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,

  // Konfiguracja dla TypeScript
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@stylistic": stylistic,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
    },
  },

  // Konfiguracja dla JavaScript
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      "@stylistic": stylistic,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-undef": "error",
      "no-console": "warn",
      "@stylistic/semi": ["error", "never"],
    },
  },

  // Konfiguracja dla CSS
  {
    files: ["**/*.css"],
    plugins: {
      stylelint: stylelintPlugin,
    },
    rules: {
      //   'stylelint/selector-class-pattern': [
      //     'error',
      //     {
      //       pattern: '^[a-z][a-zA-Z0-9]*$',
      //       message: 'Nazwy klas powinny używać camelCase'
      //     }
      //   ]
    },
  }
);
