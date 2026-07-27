"use client";

import { motion, type Variants } from "framer-motion";

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.4, delayChildren: 0.25 } },
};

const item: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function BootSequence({ lines }: { lines: string[] }) {
  return (
    <motion.ol
      variants={list}
      initial="hidden"
      animate="show"
      className="mt-4 space-y-2 font-mono text-[12.5px]"
    >
      {lines.map((line, i) => {
        const isLast = i === lines.length - 1;
        return (
          <motion.li key={line} variants={item} className="text-muted">
            <span className="mr-2 text-dim">{String(i).padStart(2, "0")}</span>
            <span className={isLast ? "text-accent" : undefined}>{line}</span>
            {isLast ? <span className="boot-cursor ml-1" aria-hidden="true" /> : null}
          </motion.li>
        );
      })}
    </motion.ol>
  );
}