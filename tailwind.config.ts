import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * JAGAT-MANTHAN token architecture (AD-12):
 * dark is the DEFAULT (:root). html[data-theme="light"] swaps the same tokens.
 * Components never hardcode colors — they consume semantic tokens only.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        panel: { DEFAULT: "hsl(var(--panel))", 2: "hsl(var(--panel-2))" },
        line: { DEFAULT: "hsl(var(--line))", 2: "hsl(var(--line-2))" },
        muted: "hsl(var(--muted))",
        dim: "hsl(var(--dim))",
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(213 30% 8%)" },
        info: "hsl(var(--info))",
        success: "hsl(var(--success))",
        danger: "hsl(var(--danger))",
        signal: "hsl(var(--signal))",
        // shadcn compatibility layer
        primary: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(213 30% 8%)" },
        secondary: { DEFAULT: "hsl(var(--panel-2))", foreground: "hsl(var(--foreground))" },
        destructive: { DEFAULT: "hsl(var(--danger))", foreground: "hsl(0 0% 98%)" },
        card: { DEFAULT: "hsl(var(--panel))", foreground: "hsl(var(--foreground))" },
        popover: { DEFAULT: "hsl(var(--panel))", foreground: "hsl(var(--foreground))" },
        border: "hsl(var(--line))",
        input: "hsl(var(--line-2))",
        ring: "hsl(var(--accent))",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: { lg: "6px", md: "4px", sm: "2px" },
    },
  },
  plugins: [animate],
};

export default config;