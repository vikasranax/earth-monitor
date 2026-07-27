"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  digest: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, digest: "" };

  static getDerivedStateFromError(error: Error): State {
    return { error, digest: Math.random().toString(36).slice(2, 10).toUpperCase() };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "error",
        scope: "error-boundary",
        msg: error.message,
        componentStack: info.componentStack,
      }),
    );
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;

    return (
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="panel w-full max-w-lg">
          <p className="panel-title text-danger">FAULT DETECTED</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase">System hiccup</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The terminal hit an unrecoverable error and isolated it. Quote the digest below when
            reporting the incident.
          </p>
          <p className="mt-4 break-all border border-line bg-panel-2 p-3 font-mono text-xs text-dim">
            DIGEST {this.state.digest} · {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null, digest: "" })}
            className="mt-5 border border-accent px-4 py-2 font-mono text-xs tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            RE-ARM ▸
          </button>
        </div>
      </main>
    );
  }
}