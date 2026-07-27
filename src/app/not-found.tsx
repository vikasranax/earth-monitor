import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="radar h-40 w-40" aria-hidden="true" />
      <p className="font-mono text-[11px] tracking-[0.32em] text-danger">SIGNAL LOST · 404</p>
      <h1 className="font-display text-6xl font-black uppercase">No contact</h1>
      <p className="max-w-md text-sm text-muted">
        This coordinate is outside the monitored grid. Return to the command deck.
      </p>
      <Link
        href="/"
        className="border border-accent px-5 py-2.5 font-mono text-xs tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        ◂ BACK TO COMMAND DECK
      </Link>
    </main>
  );
}