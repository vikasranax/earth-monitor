"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Newspaper,
  ChevronDown,
  ChevronUp,
  Filter,
  Zap,
  Shield,
  BarChart3,
  MapPin,
  ArrowRight,
  Activity,
} from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBar, CommandPalette, Panel } from "@/components/terminal";

// ─── Country Flag Emoji Map ───
const FLAGS: Record<string, string> = {
  USA: "🇺🇸",
  China: "🇨🇳",
  India: "🇮🇳",
  Russia: "🇷🇺",
  Japan: "🇯🇵",
  Germany: "🇩🇪",
  UK: "🇬🇧",
  France: "🇫🇷",
  Brazil: "🇧🇷",
  Canada: "🇨🇦",
  Australia: "🇦🇺",
  Saudi: "🇸🇦",
  Korea: "🇰🇷",
  Mexico: "🇲🇽",
  Indonesia: "🇮🇩",
  Turkey: "🇹🇷",
  Argentina: "🇦🇷",
  "South Africa": "🇿🇦",
  EU: "🇪🇺",
  "African Union": "🌍",
  Italy: "🇮🇹",
  UAE: "🇦🇪",
  Iran: "🇮🇷",
  Egypt: "🇪🇬",
  Ethiopia: "🇪🇹",
  Pakistan: "🇵🇰",
  Kazakhstan: "🇰🇿",
  Kyrgyzstan: "🇰🇬",
  Tajikistan: "🇹🇯",
  Uzbekistan: "🇺🇿",
  Belarus: "🇧🇾",
  Thailand: "🇹🇭",
  Singapore: "🇸🇬",
  Malaysia: "🇲🇾",
  Philippines: "🇵🇭",
  Vietnam: "🇻🇳",
  Myanmar: "🇲🇲",
  Cambodia: "🇰🇭",
  Laos: "🇱🇦",
  Brunei: "🇧🇳",
  Iraq: "🇮🇶",
  Kuwait: "🇰🇼",
  Algeria: "🇩🇿",
  Nigeria: "🇳🇬",
  Libya: "🇱🇾",
  Venezuela: "🇻🇪",
  Poland: "🇵🇱",
  Netherlands: "🇳🇱",
  Norway: "🇳🇴",
  Spain: "🇪🇸",
  Greece: "🇬🇷",
  Paraguay: "🇵🇾",
  Uruguay: "🇺🇾",
  Belgium: "🇧🇪",
  Sweden: "🇸🇪",
  Austria: "🇦🇹",
  Ireland: "🇮🇪",
};

// ─── Group Definitions ───
interface GroupDef {
  id: string;
  name: string;
  short: string;
  color: string;
  accentColor: string;
  members: string[];
  /** For blocs too large to list fully — shows "+N more" rather than an inaccurate short list presented as complete. */
  totalMemberCount?: number;
  etfProxy: string[];
  etfWeights: number[];
  nextSummit: { date: string; location: string; label: string };
  description: string;
  type: "economic" | "security" | "energy";
}

const GROUPS: GroupDef[] = [
  {
    id: "g20",
    name: "Group of Twenty",
    short: "G20",
    color: "#3ba7ff",
    accentColor: "rgba(59, 167, 255, 0.15)",
    members: [
      "USA",
      "China",
      "India",
      "Russia",
      "Japan",
      "Germany",
      "UK",
      "France",
      "Brazil",
      "Canada",
      "Australia",
      "Saudi",
      "Korea",
      "Mexico",
      "Indonesia",
      "Turkey",
      "Argentina",
      "South Africa",
      "Italy",
      "EU",
      "African Union",
    ],
    etfProxy: ["VXUS", "SPY"],
    etfWeights: [0.6, 0.4],
    nextSummit: { date: "2026-12-14", location: "Miami, USA", label: "Leaders' Summit" },
    description:
      "Premier forum for international economic cooperation. Represents ~85% of global GDP.",
    type: "economic",
  },
  {
    id: "brics",
    name: "BRICS Plus",
    short: "BRICS",
    color: "#ff7a1a",
    accentColor: "rgba(255, 122, 26, 0.15)",
    members: [
      "Brazil",
      "Russia",
      "India",
      "China",
      "South Africa",
      "Indonesia",
      "UAE",
      "Iran",
      "Egypt",
      "Ethiopia",
    ],
    etfProxy: ["BKF", "MCHI", "INDA", "RSX"],
    etfWeights: [0.25, 0.25, 0.25, 0.25],
    nextSummit: { date: "2026-09-12", location: "New Delhi, India", label: "18th BRICS Summit" },
    description:
      "Intergovernmental organisation challenging Western-led governance. ~41% of world GDP (PPP).",
    type: "economic",
  },
  {
    id: "sco",
    name: "Shanghai Cooperation Organisation",
    short: "SCO",
    color: "#ef4444",
    accentColor: "rgba(239, 68, 68, 0.15)",
    members: [
      "China",
      "Russia",
      "India",
      "Pakistan",
      "Kazakhstan",
      "Kyrgyzstan",
      "Tajikistan",
      "Uzbekistan",
      "Iran",
      "Belarus",
    ],
    etfProxy: ["MCHI", "RSX", "INDA", "KWEB"],
    etfWeights: [0.3, 0.3, 0.2, 0.2],
    nextSummit: { date: "2026-10-15", location: "Bishkek, Kyrgyzstan", label: "25th SCO Summit" },
    description:
      "Political, economic & security alliance. ~45% of world population, 25% of global economy.",
    type: "security",
  },
  {
    id: "asean",
    name: "ASEAN",
    short: "ASEAN",
    color: "#2ecc71",
    accentColor: "rgba(46, 204, 113, 0.15)",
    members: [
      "Indonesia",
      "Thailand",
      "Singapore",
      "Malaysia",
      "Philippines",
      "Vietnam",
      "Myanmar",
      "Cambodia",
      "Laos",
      "Brunei",
    ],
    etfProxy: ["ASEA", "VNM", "EIDO"],
    etfWeights: [0.5, 0.25, 0.25],
    nextSummit: { date: "2026-11-10", location: "Manila, Philippines", label: "49th ASEAN Summit" },
    description:
      "Southeast Asian political & economic union. Combined GDP ~$3.6T, 660M population.",
    type: "economic",
  },
  {
    id: "quad",
    name: "Quadrilateral Security Dialogue",
    short: "QUAD",
    color: "#8b5cf6",
    accentColor: "rgba(139, 92, 246, 0.15)",
    members: ["USA", "India", "Japan", "Australia"],
    etfProxy: ["SPY", "INDA", "EWJ", "EWA"],
    etfWeights: [0.4, 0.2, 0.2, 0.2],
    nextSummit: { date: "2026-09-20", location: "TBC", label: "Quad Leaders' Summit" },
    description: "Strategic security dialogue between four Indo-Pacific democracies.",
    type: "security",
  },
  {
    id: "aukus",
    name: "AUKUS",
    short: "AUKUS",
    color: "#06b6d4",
    accentColor: "rgba(6, 182, 212, 0.15)",
    members: ["USA", "UK", "Australia"],
    etfProxy: ["SPY", "EWU", "EWA"],
    etfWeights: [0.5, 0.25, 0.25],
    nextSummit: { date: "2026-11-01", location: "TBC", label: "AUKUS Defence Ministers" },
    description:
      "Trilateral security pact for Indo-Pacific. Focus: nuclear submarines, advanced capabilities.",
    type: "security",
  },
  {
    id: "opec",
    name: "OPEC+",
    short: "OPEC+",
    color: "#f59e0b",
    accentColor: "rgba(245, 158, 11, 0.15)",
    members: [
      "Saudi",
      "Russia",
      "Iraq",
      "UAE",
      "Kuwait",
      "Iran",
      "Algeria",
      "Nigeria",
      "Libya",
      "Venezuela",
    ],
    etfProxy: ["USO", "XLE", "OILK"],
    etfWeights: [0.4, 0.4, 0.2],
    nextSummit: { date: "2026-10-05", location: "Vienna, Austria", label: "JMMC Meeting" },
    description:
      "Oil producer alliance controlling ~40% of global crude production and 80% of proven reserves.",
    type: "energy",
  },
  {
    id: "g7",
    name: "Group of Seven",
    short: "G7",
    color: "#f43f5e",
    accentColor: "rgba(244, 63, 94, 0.15)",
    members: ["USA", "France", "Germany", "Italy", "Japan", "UK", "Canada"],
    etfProxy: ["SPY", "EWJ", "EWG"],
    etfWeights: [0.5, 0.25, 0.25],
    nextSummit: { date: "2026-06-15", location: "TBC", label: "G7 Leaders' Summit" },
    description:
      "Informal bloc of major advanced economies coordinating on monetary policy & sanctions.",
    type: "economic",
  },
  {
    id: "nato",
    name: "North Atlantic Treaty Organisation",
    short: "NATO",
    color: "#64748b",
    accentColor: "rgba(100, 116, 139, 0.15)",
    members: [
      "USA",
      "UK",
      "France",
      "Germany",
      "Italy",
      "Canada",
      "Turkey",
      "Poland",
      "Netherlands",
      "Norway",
      "Spain",
      "Greece",
    ],
    totalMemberCount: 32,
    etfProxy: ["SPY", "VGK", "EWU"],
    etfWeights: [0.5, 0.3, 0.2],
    nextSummit: { date: "2026-07-09", location: "TBC", label: "NATO Summit" },
    description:
      "Transatlantic collective-defence alliance — an armed attack on one member is treated as an attack on all.",
    type: "security",
  },
  {
    id: "mercosur",
    name: "Mercosur",
    short: "MERCOSUR",
    color: "#84cc16",
    accentColor: "rgba(132, 204, 22, 0.15)",
    members: ["Argentina", "Brazil", "Paraguay", "Uruguay"],
    etfProxy: ["ARGT", "EWZ"],
    etfWeights: [0.4, 0.6],
    nextSummit: { date: "2026-12-08", location: "TBC", label: "Mercosur Summit" },
    description: "South American customs union & free-trade bloc among its founding member states.",
    type: "economic",
  },
  {
    id: "eu",
    name: "European Union",
    short: "EU",
    color: "#0ea5e9",
    accentColor: "rgba(14, 165, 233, 0.15)",
    members: [
      "Germany",
      "France",
      "Italy",
      "Netherlands",
      "Poland",
      "Belgium",
      "Spain",
      "Sweden",
      "Austria",
      "Ireland",
    ],
    totalMemberCount: 27,
    etfProxy: ["VGK", "EZU"],
    etfWeights: [0.5, 0.5],
    nextSummit: { date: "2026-06-25", location: "Brussels, Belgium", label: "European Council" },
    description:
      "Political & economic union of European states with a single market and shared institutions.",
    type: "economic",
  },
];

// ─── Mock Market Data Generator ───
function generateSparkline(base: number, points: number = 20): number[] {
  const data: number[] = [base];
  for (let i = 1; i < points; i++) {
    const prev = data[i - 1]!;
    const change = (Math.random() - 0.48) * base * 0.03;
    data.push(Math.max(prev + change, base * 0.7));
  }
  return data;
}

function useGroupMarkets() {
  const [markets, setMarkets] = useState<
    Record<string, { price: number; change: number; sparkline: number[] }>
  >({});

  useEffect(() => {
    const initial: Record<string, { price: number; change: number; sparkline: number[] }> = {};
    GROUPS.forEach((g) => {
      const base = 100 + Math.random() * 50;
      const sparkline = generateSparkline(base);
      const current = sparkline[sparkline.length - 1] ?? base;
      const prev = sparkline[0] ?? base;
      initial[g.id] = {
        price: current,
        change: ((current - prev) / prev) * 100,
        sparkline,
      };
    });
    setMarkets(initial);
  }, []);

  return markets;
}

// ─── Mock News Generator ───
const MOCK_NEWS: Record<string, string[]> = {
  g20: [
    "G20 finance ministers meet in Asheville to discuss debt restructuring frameworks",
    "Miami summit preparations accelerate as Trump administration finalises agenda",
    "G20 trade ministerial in Milwaukee sets sights on supply chain resilience",
  ],
  brics: [
    "BRICS Pay cross-border payment framework enters pilot phase ahead of New Delhi summit",
    "India chairs BRICS foreign ministers meeting; de-dollarisation tops agenda",
    "New Development Bank approves $7B infrastructure lending for member states",
  ],
  sco: [
    "SCO Council of National Coordinators meets in Bishkek ahead of 25th summit",
    "Pakistan confirms hosting 2027 SCO summit in Islamabad",
    "SCO members condemn terrorism at Tianjin declaration, affirm Indus Waters stance",
  ],
  asean: [
    "48th ASEAN Summit concludes in Cebu with digital economy framework agreement",
    "ASEAN centrality tested as members navigate US-China tech competition",
    "Manila prepares for 49th summit with focus on maritime security cooperation",
  ],
  quad: [
    "Quad partners announce joint maritime domain awareness initiative in Indo-Pacific",
    "India-US defence ties deepen with new logistics agreement ahead of summit",
    "Quad working groups expand into critical minerals and undersea cable security",
  ],
  aukus: [
    "AUKUS pillar-two advanced capabilities trial begins in Australian waters",
    "UK Royal Navy receives first AUKUS-class submarine design specifications",
    "Trilateral defence ministers discuss hypersonic missile cooperation timeline",
  ],
  opec: [
    "OPEC+ JMMC maintains production quotas amid volatile Brent crude pricing",
    "Saudi Aramco and Russia's Rosneft coordinate on Asian market supply strategy",
    "OPEC+ considers extending output cuts into Q4 2026 on demand uncertainty",
  ],
  g7: [
    "G7 finance ministers coordinate response to sovereign debt distress in emerging markets",
    "G7 sanctions coordination working group reviews enforcement gaps",
    "Host nation announces agenda focus: AI governance and critical minerals",
  ],
  nato: [
    "NATO defence ministers review burden-sharing targets ahead of summit",
    "Alliance announces expanded Baltic air-policing rotation",
    "NATO-Indo-Pacific partners deepen cooperation on maritime security",
  ],
  mercosur: [
    "Mercosur-EU trade agreement ratification process advances in member parliaments",
    "Bloc discusses common external tariff adjustments amid regional trade talks",
    "Mercosur infrastructure fund approves cross-border transport corridor",
  ],
  eu: [
    "European Council reviews enlargement roadmap for candidate countries",
    "EU finance ministers discuss joint defence financing mechanism",
    "Brussels advances digital markets regulatory framework",
  ],
};

// ─── Countdown Hook ───
function useCountdown(targetDate: string) {
  const [days, setDays] = useState(0);
  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      setDays(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    }, 60000);
    const now = Date.now();
    const diff = target - now;
    setDays(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    return () => clearInterval(interval);
  }, [targetDate]);
  return days;
}

// ─── Sparkline SVG ───
function Sparkline({
  data,
  color,
  width = 120,
  height = 40,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#grad-${color.replace("#", "")})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Group Card ───
function GroupCard({
  group,
  market,
  expanded,
  onToggle,
}: {
  group: GroupDef;
  market?: { price: number; change: number; sparkline: number[] };
  expanded: boolean;
  onToggle: () => void;
}) {
  const daysLeft = useCountdown(group.nextSummit.date);
  const isPositive = (market?.change ?? 0) >= 0;
  const extraMembers = group.totalMemberCount ? group.totalMemberCount - group.members.length : 0;

  const typeIcon = {
    economic: <BarChart3 size={14} />,
    security: <Shield size={14} />,
    energy: <Zap size={14} />,
  }[group.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="corner-ticks rounded-[var(--radius-md)] border overflow-hidden bg-[var(--bg-1)]"
      style={{ borderColor: "var(--border)", boxShadow: `0 0 0 1px ${group.accentColor}` }}
    >
      <div className="p-4 cursor-pointer flex items-center justify-between" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-[var(--radius-sm)] flex items-center justify-center text-xs font-mono font-bold"
            style={{ background: group.accentColor, color: group.color }}
          >
            {group.short}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-semibold text-[var(--fg-0)]">
                {group.name}
              </h3>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium flex items-center gap-1"
                style={{ background: group.accentColor, color: group.color }}
              >
                {typeIcon}
                {group.type.toUpperCase()}
              </span>
            </div>
            <p className="font-mono text-[11px] text-[var(--fg-2)] mt-0.5">
              {group.totalMemberCount ?? group.members.length} members · Next summit in {daysLeft}{" "}
              days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {market && (
            <div className="text-right hidden sm:block">
              <div className="font-mono text-sm font-semibold text-[var(--fg-0)]">
                {market.price.toFixed(2)}
              </div>
              <div
                className="font-mono text-xs flex items-center justify-end gap-1"
                style={{ color: isPositive ? "var(--ok)" : "var(--danger)" }}
              >
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {isPositive ? "+" : ""}
                {market.change.toFixed(2)}%
              </div>
            </div>
          )}
          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--bg-2)]">
            {expanded ? (
              <ChevronUp size={16} className="text-[var(--fg-2)]" />
            ) : (
              <ChevronDown size={16} className="text-[var(--fg-2)]" />
            )}
          </div>
        </div>
      </div>

      {market && (
        <div className="px-4 pb-3">
          <Sparkline
            data={market.sparkline}
            color={isPositive ? "#2ecc71" : "#ff4d4f"}
            width={280}
            height={40}
          />
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-5">
              <div className="h-px bg-[var(--border)]" />

              <p className="text-sm leading-relaxed text-[var(--fg-2)]">{group.description}</p>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={14} style={{ color: group.color }} />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)]">
                    Members
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.members.map((m) => (
                    <div
                      key={m}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium border border-[var(--border)] bg-[var(--bg-2)] text-[var(--fg-0)]"
                    >
                      <span className="text-base">{FLAGS[m] || "🏳️"}</span>
                      <span>{m}</span>
                    </div>
                  ))}
                  {extraMembers > 0 && (
                    <div className="flex items-center px-2.5 py-1.5 rounded-[var(--radius-sm)] text-xs font-mono border border-dashed border-[var(--border-strong)] text-[var(--fg-muted)]">
                      +{extraMembers} more
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={14} style={{ color: group.color }} />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)]">
                    Market Proxy (ETF Blend)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.etfProxy.map((etf, i) => (
                    <div
                      key={etf}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-mono border border-[var(--border)] bg-[var(--bg-2)]"
                    >
                      <span style={{ color: group.color }}>{etf}</span>
                      <span className="text-[var(--fg-2)]">
                        {((group.etfWeights[i] ?? 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] mt-2 text-[var(--fg-muted)] font-mono">
                  Synthetic index weighted from member-country ETFs. Connect to your markets
                  provider for live prices.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Newspaper size={14} style={{ color: group.color }} />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-2)]">
                    Recent News (Illustrative)
                  </span>
                </div>
                <div className="space-y-2">
                  {(MOCK_NEWS[group.id] || []).map((news, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-0)] group cursor-pointer hover:border-[var(--border-strong)] transition-colors"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ background: group.color }}
                      />
                      <div className="flex-1">
                        <p className="text-xs leading-relaxed text-[var(--fg-0)]">{news}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-[var(--fg-muted)] font-mono">
                            {["2h ago", "5h ago", "1d ago"][i]}
                          </span>
                          <ArrowRight
                            size={10}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: group.color }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="p-4 rounded-[var(--radius-md)] border flex items-center justify-between"
                style={{ background: group.accentColor, borderColor: `${group.color}30` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center"
                    style={{ background: `${group.color}20` }}
                  >
                    <Calendar size={16} style={{ color: group.color }} />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-medium" style={{ color: group.color }}>
                      {group.nextSummit.label}
                    </div>
                    <div className="text-sm font-semibold mt-0.5 text-[var(--fg-0)]">
                      {new Date(group.nextSummit.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-[var(--fg-muted)]" />
                      <span className="text-[10px] text-[var(--fg-muted)] font-mono">
                        {group.nextSummit.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono" style={{ color: group.color }}>
                    {daysLeft}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)] font-mono">
                    Days Left
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ───
export default function GroupsPage() {
  const [expandedId, setExpandedId] = useState<string | null>("brics");
  const [filter, setFilter] = useState<"all" | "economic" | "security" | "energy">("all");
  const markets = useGroupMarkets();

  const filtered = useMemo(
    () => (filter === "all" ? GROUPS : GROUPS.filter((g) => g.type === filter)),
    [filter],
  );

  const stats = useMemo(() => {
    const totalMembers = new Set(GROUPS.flatMap((g) => g.members)).size;
    const avgChange =
      Object.values(markets).reduce((sum, m) => sum + m.change, 0) /
      (Object.keys(markets).length || 1);
    return { totalMembers, avgChange };
  }, [markets]);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-0)]">
        <StatusBar />
        <main className="flex-1 p-4 max-w-6xl mx-auto w-full flex flex-col gap-4">
          <Panel
            title="Geopolitical Groupings"
            eyebrow="BLOC INTELLIGENCE"
            actions={
              <div className="flex items-center gap-1 p-1 rounded-[var(--radius-sm)] bg-[var(--bg-2)] border border-[var(--border)]">
                {(["all", "economic", "security", "energy"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-mono font-medium transition-all capitalize"
                    style={{
                      background: filter === f ? "rgba(255, 122, 26, 0.15)" : "transparent",
                      color: filter === f ? "var(--accent)" : "var(--fg-2)",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            }
          >
            <div className="flex items-center gap-4 text-xs font-mono text-[var(--fg-2)] mb-3">
              <div className="flex items-center gap-1.5">
                <Users size={12} />
                <span>{stats.totalMembers} unique members tracked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity size={12} />
                <span style={{ color: stats.avgChange >= 0 ? "var(--ok)" : "var(--danger)" }}>
                  Avg {stats.avgChange >= 0 ? "+" : ""}
                  {stats.avgChange.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Filter size={16} className="text-[var(--info)] shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-[var(--fg-2)]">
                Each grouping shows a synthetic index built from member-country ETFs weighted by
                approximate GDP share, plus illustrative news and summit countdowns. Connect a live
                markets provider for real quotes.
              </p>
            </div>
          </Panel>

          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  market={markets[group.id]}
                  expanded={expandedId === group.id}
                  onToggle={() => setExpandedId(expandedId === group.id ? null : group.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </main>
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
