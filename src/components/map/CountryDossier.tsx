import { Panel, LedBadge } from "@/components/terminal";
import type { Country } from "@/lib/countries";

interface CountryDossierProps {
  country: Country | null;
}

const govLabels: Record<string, string> = {
  presidential: "Presidential Republic",
  parliamentary: "Parliamentary Republic",
  semi_presidential: "Semi-Presidential",
  constitutional_monarchy: "Constitutional Monarchy",
  absolute_monarchy: "Absolute Monarchy",
  one_party_state: "One-Party State",
  military_junta: "Military Junta",
  theocracy: "Theocracy",
};

export function CountryDossier({ country }: CountryDossierProps) {
  if (!country) {
    return (
      <Panel title="Country Dossier" eyebrow="SELECT A COUNTRY">
        <p className="text-sm text-[var(--fg-2)] font-mono">
          Click a marker on the map to view country intel.
        </p>
      </Panel>
    );
  }

  return (
    <Panel title={country.name} eyebrow={country.code}>
      <div className="flex flex-col gap-3 font-mono text-sm">
        <div className="flex justify-between border-b border-[var(--border)] pb-2">
          <span className="text-[var(--fg-2)]">Capital</span>
          <span className="text-[var(--fg-0)]">{country.capital}</span>
        </div>
        <div className="flex justify-between border-b border-[var(--border)] pb-2">
          <span className="text-[var(--fg-2)]">Population</span>
          <span className="text-[var(--fg-0)]">{country.population}M</span>
        </div>
        <div className="flex justify-between items-center pb-2">
          <span className="text-[var(--fg-2)]">Government</span>
          <LedBadge
            status="info"
            label={govLabels[country.governmentType] ?? country.governmentType}
          />
        </div>
        <p className="text-[10px] text-[var(--fg-muted)] uppercase tracking-widest pt-2 border-t border-[var(--border)]">
          Power structure detail arrives in M14
        </p>
      </div>
    </Panel>
  );
}
