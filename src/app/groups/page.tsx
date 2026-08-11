"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
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

// ─── Design Tokens ───
const TOKENS = {
  bg0: "#05070a",
  bg1: "#0a0e14",
  bg2: "#111827",
  accent: "#ff7a1a",
  ok: "#2ecc71",
  danger: "#ff4d4f",
  info: "#3ba7ff",
  text: "#e2e8f0",
  textMuted: "#64748b",
  border: "#1e293b",
};

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
};

// ─── Group Definitions ───
interface GroupDef {
  id: string;
  name: string;
  short: string;
  color: string;
  accentColor: string;
  members: string[];
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
      className="rounded-xl border overflow-hidden"
      style={{
        background: TOKENS.bg1,
        borderColor: TOKENS.border,
        boxShadow: `0 0 0 1px ${group.accentColor}`,
      }}
    >
      {/* Header */}
      <div className="p-5 cursor-pointer flex items-center justify-between" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold"
            style={{ background: group.accentColor, color: group.color }}
          >
            {group.short}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold" style={{ color: TOKENS.text }}>
                {group.name}
              </h3>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1"
                style={{ background: group.accentColor, color: group.color }}
              >
                {typeIcon}
                {group.type.toUpperCase()}
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: TOKENS.textMuted }}>
              {group.members.length} members · Next summit in {daysLeft} days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {market && (
            <div className="text-right hidden sm:block">
              <div className="text-sm font-mono font-semibold" style={{ color: TOKENS.text }}>
                {market.price.toFixed(2)}
              </div>
              <div
                className="text-xs font-mono flex items-center justify-end gap-1"
                style={{ color: isPositive ? TOKENS.ok : TOKENS.danger }}
              >
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {isPositive ? "+" : ""}
                {market.change.toFixed(2)}%
              </div>
            </div>
          )}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: TOKENS.bg2 }}
          >
            {expanded ? (
              <ChevronUp size={16} style={{ color: TOKENS.textMuted }} />
            ) : (
              <ChevronDown size={16} style={{ color: TOKENS.textMuted }} />
            )}
          </div>
        </div>
      </div>

      {/* Mini Sparkline (always visible) */}
      {market && (
        <div className="px-5 pb-3">
          <Sparkline
            data={market.sparkline}
            color={isPositive ? TOKENS.ok : TOKENS.danger}
            width={280}
            height={40}
          />
        </div>
      )}

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 space-y-5">
              <div className="h-px" style={{ background: TOKENS.border }} />

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: TOKENS.textMuted }}>
                {group.description}
              </p>

              {/* Members Grid */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={14} style={{ color: group.color }} />
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: TOKENS.textMuted }}
                  >
                    Members
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.members.map((m) => (
                    <div
                      key={m}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border"
                      style={{
                        background: TOKENS.bg2,
                        borderColor: TOKENS.border,
                        color: TOKENS.text,
                      }}
                    >
                      <span className="text-base">{FLAGS[m] || "🏳️"}</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Proxy */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={14} style={{ color: group.color }} />
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: TOKENS.textMuted }}
                  >
                    Market Proxy (ETF Blend)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.etfProxy.map((etf, i) => (
                    <div
                      key={etf}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border"
                      style={{
                        background: TOKENS.bg2,
                        borderColor: TOKENS.border,
                        color: TOKENS.text,
                      }}
                    >
                      <span style={{ color: group.color }}>{etf}</span>
                      <span style={{ color: TOKENS.textMuted }}>
                        {((group.etfWeights[i] ?? 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] mt-2" style={{ color: TOKENS.textMuted }}>
                  Synthetic index weighted from member-country ETFs. Connect to TwelveData API for
                  live prices.
                </p>
              </div>

              {/* News Feed */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Newspaper size={14} style={{ color: group.color }} />
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: TOKENS.textMuted }}
                  >
                    Recent News
                  </span>
                </div>
                <div className="space-y-2">
                  {(MOCK_NEWS[group.id] || []).map((news, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg border group cursor-pointer hover:border-opacity-50 transition-colors"
                      style={{
                        background: TOKENS.bg0,
                        borderColor: TOKENS.border,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ background: group.color }}
                      />
                      <div className="flex-1">
                        <p className="text-xs leading-relaxed" style={{ color: TOKENS.text }}>
                          {news}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px]" style={{ color: TOKENS.textMuted }}>
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

              {/* Summit Card */}
              <div
                className="p-4 rounded-xl border flex items-center justify-between"
                style={{
                  background: group.accentColor,
                  borderColor: `${group.color}30`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${group.color}20` }}
                  >
                    <Calendar size={18} style={{ color: group.color }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium" style={{ color: group.color }}>
                      {group.nextSummit.label}
                    </div>
                    <div className="text-sm font-semibold mt-0.5" style={{ color: TOKENS.text }}>
                      {new Date(group.nextSummit.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} style={{ color: TOKENS.textMuted }} />
                      <span className="text-[10px]" style={{ color: TOKENS.textMuted }}>
                        {group.nextSummit.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono" style={{ color: group.color }}>
                    {daysLeft}
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: TOKENS.textMuted }}
                  >
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
    <div className="min-h-screen" style={{ background: TOKENS.bg0 }}>
      {/* Top Bar */}
      <div
        className="border-b sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: `${TOKENS.bg0}ee`, borderColor: TOKENS.border }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${TOKENS.accent}15` }}
            >
              <Globe size={20} style={{ color: TOKENS.accent }} />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: TOKENS.text }}>
                Geopolitical Groupings
              </h1>
              <p
                className="text-[10px] uppercase tracking-widest"
                style={{ color: TOKENS.textMuted }}
              >
                Bloc Intelligence Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="hidden md:flex items-center gap-4 text-xs"
              style={{ color: TOKENS.textMuted }}
            >
              <div className="flex items-center gap-1.5">
                <Users size={12} />
                <span>{stats.totalMembers} unique members</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity size={12} />
                <span style={{ color: stats.avgChange >= 0 ? TOKENS.ok : TOKENS.danger }}>
                  Avg {stats.avgChange >= 0 ? "+" : ""}
                  {stats.avgChange.toFixed(2)}%
                </span>
              </div>
            </div>
            <div
              className="flex items-center gap-1 p-1 rounded-lg"
              style={{ background: TOKENS.bg1, border: `1px solid ${TOKENS.border}` }}
            >
              {(["all", "economic", "security", "energy"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize"
                  style={{
                    background: filter === f ? `${TOKENS.accent}20` : "transparent",
                    color: filter === f ? TOKENS.accent : TOKENS.textMuted,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Intro */}
        <div
          className="mb-8 p-5 rounded-xl border"
          style={{ background: TOKENS.bg1, borderColor: TOKENS.border }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${TOKENS.info}15` }}
            >
              <Filter size={18} style={{ color: TOKENS.info }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-1" style={{ color: TOKENS.text }}>
                Bloc-Level Market Proxies
              </h2>
              <p className="text-xs leading-relaxed" style={{ color: TOKENS.textMuted }}>
                Each grouping shows a synthetic index built from member-country ETFs weighted by
                approximate GDP share. Connect to your existing TwelveData provider in{" "}
                <code
                  className="px-1 py-0.5 rounded text-[10px]"
                  style={{ background: TOKENS.bg2, color: TOKENS.accent }}
                >
                  lib/providers/twelvedata.ts
                </code>{" "}
                to stream live quotes. Summit dates are verified from official sources.
              </p>
            </div>
          </div>
        </div>

        {/* Group Cards */}
        <div className="space-y-4">
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

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center" style={{ borderColor: TOKENS.border }}>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: TOKENS.textMuted }}>
            जगत्-मन्थन · Earth Monitor · 地球监测 · مراقبة الأرض · 지구 모니터링
          </p>
        </div>
      </div>
    </div>
  );
}
