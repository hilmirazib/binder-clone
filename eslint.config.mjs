import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "**/coverage/**",
      "**/public/**",
      "**/generated/**",
      "**/__generated__/**",
      "app/generated/**",
      "app/**/generated/**",
      "**/*.min.js",
      "**/*.wasm.js",
      "next-env.d.ts", 
    ],
  },

  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",

      "import/no-anonymous-default-export": "warn",
    },
  },

  {
    files: [
      "app/generated/**/*.*",
      "**/generated/**/*.*",
      "**/__generated__/**/*.*",
      "**/*.wasm.js",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-expressions": "off",
    },
  },
];

export default config;
