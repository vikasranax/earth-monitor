/**
 * verify-env — prints the provider readiness board for the current .env.local
 * Usage: pnpm verify:env
 * Exit 0 = contract satisfied (keys optional) · Exit 1 = malformed values.
 */
import { readiness, serverEnv } from "@/lib/env";

const out = (s = ""): void => {
  process.stdout.write(s + "\n");
};

const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const mark = (armed: boolean): string =>
  armed ? `${GREEN}▣ ARMED${RESET}` : `${DIM}▢ unarmed${RESET}`;

out();
out(`${BOLD}JAGAT-MANTHAN · ENV READINESS${RESET}`);
out(`NODE_ENV=${serverEnv.NODE_ENV} · SITE_URL=${serverEnv.SITE_URL}`);
out("─".repeat(56));

const r = readiness();
for (const group of r.groups) {
  out(`${CYAN}${group.label}${RESET}`);
  for (const item of group.items) {
    const opt = item.optional ? ` ${DIM}(optional)${RESET}` : "";
    out(`  ${item.key.padEnd(34)} ${mark(item.armed)}${opt}`);
  }
}

out("─".repeat(56));
out(
  `TOTAL ${r.armedCount}/${r.totalCount} armed — ${
    r.armedCount <= 1
      ? "fresh-clone state. M01 runs fully unarmed; providers arm per-module (blueprint §12.1)."
      : "good. See docs/M01-FOUNDATION.md for the arming roadmap."
  }`,
);
out();