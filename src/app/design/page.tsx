import { Panel, KpiCard, LedBadge, RiskGauge, DataTable, Ticker } from "@/components/terminal";

interface Row {
  country: string;
  risk: number;
  status: "ok" | "warn" | "danger";
}

const sampleRows: Row[] = [
  { country: "IND", risk: 22, status: "ok" },
  { country: "UKR", risk: 88, status: "danger" },
  { country: "TWN", risk: 61, status: "warn" },
];

export default function DesignShowcasePage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-[var(--fg-0)]">
        Design System Showcase
      </h1>

      <Ticker
        items={[
          { label: "OIL", value: "$82.14", delta: 1.2 },
          { label: "GOLD", value: "$2,410", delta: -0.4 },
          { label: "BTC", value: "$71,200", delta: 3.1 },
        ]}
      />

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Global Risk" value="54" delta={2.1} />
        <KpiCard label="Active Alerts" value="12" delta={-5.0} />
        <KpiCard label="Ships Tracked" value="8,204" delta={0.3} />
      </div>

      <Panel title="Risk Gauge" eyebrow="COMPONENT">
        <RiskGauge score={62} />
      </Panel>

      <Panel title="LED Badges" eyebrow="COMPONENT">
        <div className="flex gap-4">
          <LedBadge status="ok" label="Online" pulse />
          <LedBadge status="warn" label="Degraded" />
          <LedBadge status="danger" label="Offline" />
          <LedBadge status="info" label="Syncing" pulse />
        </div>
      </Panel>

      <Panel title="Country Risk Table" eyebrow="COMPONENT">
        <DataTable<Row>
          columns={[
            { key: "country", header: "Country" },
            { key: "risk", header: "Risk", align: "right" },
            {
              key: "status",
              header: "Status",
              render: (r) => <LedBadge status={r.status} label={r.status.toUpperCase()} />,
            },
          ]}
          rows={sampleRows}
          getRowKey={(r) => r.country}
        />
      </Panel>
    </div>
  );
}