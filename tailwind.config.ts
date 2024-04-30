import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      darkgreen: "#13382d",
      cream: "#f2f7f2",
      pink: "#35374B",
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
