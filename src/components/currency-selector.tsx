"use client";

import { supportedCurrencies } from "@/lib/markets-watchlist";

export default function CurrencySelector({ current }: { current: string }) {
  return (
    <form method="GET" className="flex items-center gap-2">
      <label className="text-[10px] uppercase tracking-wider text-[#6b7684] font-mono">
        Currency
      </label>
      <select
        name="currency"
        defaultValue={current}
        onChange={(e) => e.currentTarget.form?.submit()}
        className="bg-[#0a0d12] border border-[#212832] rounded px-3 py-1.5 text-sm text-[#e6ebf1] focus:outline-none focus:border-[#ff7a1a] cursor-pointer"
      >
        {supportedCurrencies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </form>
  );
}
