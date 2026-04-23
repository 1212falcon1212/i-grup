import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "design_handoff_igroup_corporate_site/**",
    "docs/**",
  ]),
  {
    rules: {
      // Stable aliases from static maps (iconByName, Field helper) — we want
      // the variable pattern for ergonomics; the component reference itself is
      // stable across renders.
      "react-hooks/static-components": "off",
    },
  },
]);

export default eslintConfig;
