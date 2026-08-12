export interface WatchlistSymbol {
  symbol: string;
  label: string;
  category: "index" | "commodity" | "forex" | "crypto" | "equity";
  region: string;
  regionName: string;
  currency: string;
}

export const watchlist: WatchlistSymbol[] = [
  // ════════ INDIA ════════
  {
    symbol: "INDA",
    label: "Nifty 50",
    category: "index",
    region: "IN",
    regionName: "India",
    currency: "USD",
  },
  {
    symbol: "EPI",
    label: "India S&P",
    category: "index",
    region: "IN",
    regionName: "India",
    currency: "USD",
  },
  {
    symbol: "USD/INR",
    label: "USD/INR",
    category: "forex",
    region: "IN",
    regionName: "India",
    currency: "INR",
  },
  {
    symbol: "RELIANCE.NS",
    label: "Reliance Industries",
    category: "equity",
    region: "IN",
    regionName: "India",
    currency: "INR",
  },

  // ════════ EAST ASIA ════════
  {
    symbol: "FXI",
    label: "China Large-Cap",
    category: "index",
    region: "CN",
    regionName: "China",
    currency: "USD",
  },
  {
    symbol: "ASHR",
    label: "China A-Shares",
    category: "index",
    region: "CN",
    regionName: "China",
    currency: "USD",
  },
  {
    symbol: "EWH",
    label: "Hong Kong Hang Seng",
    category: "index",
    region: "CN",
    regionName: "Hong Kong",
    currency: "USD",
  },
  {
    symbol: "EWT",
    label: "Taiwan MSCI",
    category: "index",
    region: "CN",
    regionName: "Taiwan",
    currency: "USD",
  },
  {
    symbol: "EWJ",
    label: "Japan Nikkei",
    category: "index",
    region: "JP",
    regionName: "Japan",
    currency: "USD",
  },
  {
    symbol: "EWY",
    label: "South Korea KOSPI",
    category: "index",
    region: "KR",
    regionName: "South Korea",
    currency: "USD",
  },
  {
    symbol: "USD/CNY",
    label: "USD/CNY",
    category: "forex",
    region: "CN",
    regionName: "China",
    currency: "CNY",
  },
  {
    symbol: "USD/JPY",
    label: "USD/JPY",
    category: "forex",
    region: "JP",
    regionName: "Japan",
    currency: "JPY",
  },
  {
    symbol: "USD/KRW",
    label: "USD/KRW",
    category: "forex",
    region: "KR",
    regionName: "South Korea",
    currency: "KRW",
  },

  // ════════ SOUTH-EAST ASIA & PACIFIC ════════
  {
    symbol: "EWS",
    label: "Singapore STI",
    category: "index",
    region: "SG",
    regionName: "Singapore",
    currency: "USD",
  },
  {
    symbol: "EWM",
    label: "Malaysia KLCI",
    category: "index",
    region: "SG",
    regionName: "Malaysia",
    currency: "USD",
  },
  {
    symbol: "EPHE",
    label: "Philippines PSEi",
    category: "index",
    region: "SG",
    regionName: "Philippines",
    currency: "USD",
  },
  {
    symbol: "IDX",
    label: "Indonesia JCI",
    category: "index",
    region: "SG",
    regionName: "Indonesia",
    currency: "USD",
  },
  {
    symbol: "THD",
    label: "Thailand SET",
    category: "index",
    region: "SG",
    regionName: "Thailand",
    currency: "USD",
  },
  {
    symbol: "EWA",
    label: "Australia ASX",
    category: "index",
    region: "AS",
    regionName: "Australia",
    currency: "USD",
  },
  {
    symbol: "ENZL",
    label: "New Zealand NZX",
    category: "index",
    region: "AS",
    regionName: "New Zealand",
    currency: "USD",
  },
  {
    symbol: "USD/SGD",
    label: "USD/SGD",
    category: "forex",
    region: "SG",
    regionName: "Singapore",
    currency: "SGD",
  },
  {
    symbol: "USD/AUD",
    label: "USD/AUD",
    category: "forex",
    region: "AS",
    regionName: "Australia",
    currency: "AUD",
  },

  // ════════ WEST ASIA ════════
  {
    symbol: "GAF",
    label: "West Asia & Africa",
    category: "index",
    region: "WA",
    regionName: "West Asia",
    currency: "USD",
  },
  {
    symbol: "USD/SAR",
    label: "USD/SAR",
    category: "forex",
    region: "WA",
    regionName: "Saudi Arabia",
    currency: "SAR",
  },
  {
    symbol: "USD/AED",
    label: "USD/AED",
    category: "forex",
    region: "WA",
    regionName: "UAE",
    currency: "AED",
  },
  {
    symbol: "USD/ILS",
    label: "USD/ILS",
    category: "forex",
    region: "WA",
    regionName: "Israel",
    currency: "ILS",
  },

  // ════════ EUROPE & RUSSIA ════════
  {
    symbol: "VGK",
    label: "Europe FTSE",
    category: "index",
    region: "EU",
    regionName: "Europe",
    currency: "USD",
  },
  {
    symbol: "EZU",
    label: "Eurozone Euro Stoxx",
    category: "index",
    region: "EU",
    regionName: "Eurozone",
    currency: "USD",
  },
  {
    symbol: "EWU",
    label: "UK FTSE 100",
    category: "index",
    region: "GB",
    regionName: "United Kingdom",
    currency: "USD",
  },
  {
    symbol: "EWP",
    label: "Spain IBEX",
    category: "index",
    region: "ES",
    regionName: "Spain",
    currency: "USD",
  },
  {
    symbol: "EWG",
    label: "Germany DAX",
    category: "index",
    region: "DE",
    regionName: "Germany",
    currency: "USD",
  },
  {
    symbol: "EWQ",
    label: "France CAC 40",
    category: "index",
    region: "FR",
    regionName: "France",
    currency: "USD",
  },
  {
    symbol: "EWI",
    label: "Italy FTSE MIB",
    category: "index",
    region: "IT",
    regionName: "Italy",
    currency: "USD",
  },
  {
    symbol: "EUR/USD",
    label: "EUR/USD",
    category: "forex",
    region: "EU",
    regionName: "Europe",
    currency: "EUR",
  },
  {
    symbol: "GBP/USD",
    label: "GBP/USD",
    category: "forex",
    region: "GB",
    regionName: "United Kingdom",
    currency: "GBP",
  },
  {
    symbol: "USD/RUB",
    label: "USD/RUB",
    category: "forex",
    region: "RU",
    regionName: "Russia",
    currency: "RUB",
  },

  // ════════ AFRICA ════════
  {
    symbol: "EZA",
    label: "South Africa JSE",
    category: "index",
    region: "ZA",
    regionName: "South Africa",
    currency: "USD",
  },
  {
    symbol: "AFK",
    label: "Africa Index",
    category: "index",
    region: "AF",
    regionName: "Africa",
    currency: "USD",
  },
  {
    symbol: "USD/ZAR",
    label: "USD/ZAR",
    category: "forex",
    region: "ZA",
    regionName: "South Africa",
    currency: "ZAR",
  },
  {
    symbol: "USD/EGP",
    label: "USD/EGP",
    category: "forex",
    region: "EG",
    regionName: "Egypt",
    currency: "EGP",
  },
  {
    symbol: "USD/NGN",
    label: "USD/NGN",
    category: "forex",
    region: "NG",
    regionName: "Nigeria",
    currency: "NGN",
  },

  // ════════ AMERICAS ════════
  {
    symbol: "SPY",
    label: "S&P 500",
    category: "index",
    region: "US",
    regionName: "United States",
    currency: "USD",
  },
  {
    symbol: "QQQ",
    label: "Nasdaq 100",
    category: "index",
    region: "US",
    regionName: "United States",
    currency: "USD",
  },
  {
    symbol: "DIA",
    label: "Dow Jones",
    category: "index",
    region: "US",
    regionName: "United States",
    currency: "USD",
  },
  {
    symbol: "IWM",
    label: "Russell 2000",
    category: "index",
    region: "US",
    regionName: "United States",
    currency: "USD",
  },
  {
    symbol: "EWW",
    label: "Mexico IPC",
    category: "index",
    region: "MX",
    regionName: "Mexico",
    currency: "USD",
  },
  {
    symbol: "EWZ",
    label: "Brazil Bovespa",
    category: "index",
    region: "BR",
    regionName: "Brazil",
    currency: "USD",
  },
  {
    symbol: "EPU",
    label: "Peru Lima",
    category: "index",
    region: "PE",
    regionName: "Peru",
    currency: "USD",
  },
  {
    symbol: "ARGT",
    label: "Argentina Merval",
    category: "index",
    region: "AR",
    regionName: "Argentina",
    currency: "USD",
  },
  {
    symbol: "USD/BRL",
    label: "USD/BRL",
    category: "forex",
    region: "BR",
    regionName: "Brazil",
    currency: "BRL",
  },
  {
    symbol: "USD/MXN",
    label: "USD/MXN",
    category: "forex",
    region: "MX",
    regionName: "Mexico",
    currency: "MXN",
  },
  {
    symbol: "USD/CAD",
    label: "USD/CAD",
    category: "forex",
    region: "CA",
    regionName: "Canada",
    currency: "CAD",
  },

  // ════════ COMMODITIES (Global) ════════
  {
    symbol: "GLD",
    label: "Gold",
    category: "commodity",
    region: "GL",
    regionName: "Global",
    currency: "USD",
  },
  {
    symbol: "SLV",
    label: "Silver",
    category: "commodity",
    region: "GL",
    regionName: "Global",
    currency: "USD",
  },
  {
    symbol: "USO",
    label: "Crude Oil WTI",
    category: "commodity",
    region: "GL",
    regionName: "Global",
    currency: "USD",
  },
  {
    symbol: "UNG",
    label: "Natural Gas",
    category: "commodity",
    region: "GL",
    regionName: "Global",
    currency: "USD",
  },

  // ════════ CRYPTO (Global) ════════
  {
    symbol: "BTC-USD",
    label: "Bitcoin",
    category: "crypto",
    region: "GL",
    regionName: "Global",
    currency: "USD",
  },
  {
    symbol: "ETH-USD",
    label: "Ethereum",
    category: "crypto",
    region: "GL",
    regionName: "Global",
    currency: "USD",
  },
  {
    symbol: "SOL-USD",
    label: "Solana",
    category: "crypto",
    region: "GL",
    regionName: "Global",
    currency: "USD",
  },
  {
    symbol: "WLD-USD",
    label: "Worldcoin",
    category: "crypto",
    region: "GL",
    regionName: "Global",
    currency: "USD",
  },
  {
    symbol: "XRP-USD",
    label: "Ripple",
    category: "crypto",
    region: "GL",
    regionName: "Global",
    currency: "USD",
  },
  {
    symbol: "ADA-USD",
    label: "Cardano",
    category: "crypto",
    region: "GL",
    regionName: "Global",
    currency: "USD",
  },
  {
    symbol: "DOGE-USD",
    label: "Dogecoin",
    category: "crypto",
    region: "GL",
    regionName: "Global",
    currency: "USD",
  },

  // ════════ KEY GLOBAL EQUITIES ════════
  {
    symbol: "AAPL",
    label: "Apple",
    category: "equity",
    region: "US",
    regionName: "United States",
    currency: "USD",
  },
  {
    symbol: "TSLA",
    label: "Tesla",
    category: "equity",
    region: "US",
    regionName: "United States",
    currency: "USD",
  },
  {
    symbol: "NVDA",
    label: "NVIDIA",
    category: "equity",
    region: "US",
    regionName: "United States",
    currency: "USD",
  },
  {
    symbol: "TSM",
    label: "TSMC",
    category: "equity",
    region: "TW",
    regionName: "Taiwan",
    currency: "USD",
  },
  {
    symbol: "BABA",
    label: "Alibaba",
    category: "equity",
    region: "CN",
    regionName: "China",
    currency: "USD",
  },
  {
    symbol: "SHEL",
    label: "Shell",
    category: "equity",
    region: "GB",
    regionName: "United Kingdom",
    currency: "USD",
  },
  {
    symbol: "TTE",
    label: "TotalEnergies",
    category: "equity",
    region: "FR",
    regionName: "France",
    currency: "USD",
  },
];

// ═══════════════════════════════════════════════════════════════════
//  SYMBOL ALIAS MAP
// ═══════════════════════════════════════════════════════════════════
export const symbolMap = new Map<string, WatchlistSymbol>(
  watchlist.flatMap((w) => {
    const keys: string[] = [w.symbol.toUpperCase()];
    if (w.symbol === "INDA") keys.push("NIFTY", "NIFTY50", "NIFTY 50", "INDIA INDEX");
    if (w.symbol === "EPI") keys.push("INDIA S&P", "INDIA ETF");
    if (w.symbol === "USD/INR") keys.push("INR", "RUPEE", "RUPEES", "INDIAN RUPEE");
    if (w.symbol === "RELIANCE.NS") keys.push("RELIANCE", "MUKESH AMBANI");
    if (w.symbol === "FXI") keys.push("CHINA", "CHINESE", "SHANGHAI");
    if (w.symbol === "ASHR") keys.push("CHINA A SHARE", "A SHARES");
    if (w.symbol === "EWJ") keys.push("JAPAN", "JAPANESE", "NIKKEI", "TOKYO");
    if (w.symbol === "EWY") keys.push("KOREA", "KOREAN", "KOSPI", "SEOUL");
    if (w.symbol === "USD/CNY") keys.push("YUAN", "RENMINBI", "RMB");
    if (w.symbol === "EWS") keys.push("SINGAPORE", "STI", "LION CITY");
    if (w.symbol === "EWM") keys.push("MALAYSIA", "KLCI", "MALAY");
    if (w.symbol === "EPHE") keys.push("PHILIPPINES", "MANILA", "PSE");
    if (w.symbol === "IDX") keys.push("INDONESIA", "JAKARTA", "JCI");
    if (w.symbol === "THD") keys.push("THAILAND", "BANGKOK", "SET");
    if (w.symbol === "GAF") keys.push("WEST ASIA", "MENA", "GULF", "ARAB");
    if (w.symbol === "USD/SAR") keys.push("RIYAL", "SAUDI");
    if (w.symbol === "USD/AED") keys.push("DIRHAM", "DUBAI", "UAE");
    if (w.symbol === "USD/ILS") keys.push("SHEKEL", "ISRAELI");
    if (w.symbol === "VGK") keys.push("EUROPE", "EUROPEAN", "EU STOXX");
    if (w.symbol === "EZU") keys.push("EUROZONE", "EURO AREA");
    if (w.symbol === "EWU") keys.push("UK", "BRITAIN", "BRITISH", "LONDON", "FTSE");
    if (w.symbol === "EWP") keys.push("SPAIN", "SPANISH", "IBEX", "MADRID");
    if (w.symbol === "EWG") keys.push("GERMANY", "GERMAN", "DAX", "FRANKFURT");
    if (w.symbol === "EWQ") keys.push("FRANCE", "FRENCH", "CAC", "PARIS");
    if (w.symbol === "EWI") keys.push("ITALY", "ITALIAN", "MIB", "MILAN");
    if (w.symbol === "EUR/USD") keys.push("EURO", "EURO DOLLAR");
    if (w.symbol === "GBP/USD") keys.push("POUND", "STERLING", "CABLE");
    if (w.symbol === "USD/RUB") keys.push("ROUBLE", "RUBLE", "RUSSIAN", "MOSCOW", "MOEX");
    if (w.symbol === "EZA") keys.push("SOUTH AFRICA", "JSE", "JOHANNESBURG");
    if (w.symbol === "AFK") keys.push("AFRICA", "AFRICAN", "AFRICAN UNION");
    if (w.symbol === "USD/ZAR") keys.push("RAND");
    if (w.symbol === "USD/EGP") keys.push("EGYPTIAN POUND", "EGYPT");
    if (w.symbol === "USD/NGN") keys.push("NAIRA", "NIGERIA");
    if (w.symbol === "SPY") keys.push("S&P", "SP500", "S AND P", "US MARKET");
    if (w.symbol === "QQQ") keys.push("NASDAQ", "TECH", "US TECH");
    if (w.symbol === "DIA") keys.push("DOW", "DOW JONES", "INDUSTRIAL");
    if (w.symbol === "EWW") keys.push("MEXICO", "MEXICAN", "IPC", "MEXICO CITY");
    if (w.symbol === "EWZ") keys.push("BRAZIL", "BRAZILIAN", "BOVESPA", "SAO PAULO");
    if (w.symbol === "EPU") keys.push("PERU", "LIMA", "PERUVIAN");
    if (w.symbol === "ARGT") keys.push("ARGENTINA", "ARGENTINE", "MERVAL", "BUENOS AIRES");
    if (w.symbol === "USD/BRL") keys.push("REAL", "BRAZIL REAL");
    if (w.symbol === "USD/MXN") keys.push("PESO", "MEXICAN PESO");
    if (w.symbol === "USD/CAD") keys.push("LOONIE", "CANADIAN DOLLAR", "CANADA");
    if (w.symbol === "GLD") keys.push("GOLD", "XAU", "PRECIOUS METAL");
    if (w.symbol === "SLV") keys.push("SILVER", "XAG");
    if (w.symbol === "USO") keys.push("OIL", "WTI", "CRUDE", "PETROL", "BRENT");
    if (w.symbol === "UNG") keys.push("GAS", "NATGAS");
    if (w.symbol === "BTC-USD") keys.push("BTC", "BITCOIN", "CRYPTO");
    if (w.symbol === "ETH-USD") keys.push("ETH", "ETHEREUM", "ETHER");
    if (w.symbol === "SOL-USD") keys.push("SOL", "SOLANA");
    if (w.symbol === "WLD-USD") keys.push("WLD", "WORLDCOIN");
    if (w.symbol === "XRP-USD") keys.push("XRP", "RIPPLE");
    if (w.symbol === "ADA-USD") keys.push("ADA", "CARDANO");
    if (w.symbol === "DOGE-USD") keys.push("DOGE", "DOGECOIN");
    if (w.symbol === "TSM") keys.push("TSMC", "TAIWAN", "TAIWANESE");
    if (w.symbol === "BABA") keys.push("ALIBABA", "CHINA TECH");
    if (w.symbol === "SHEL") keys.push("SHELL", "ROYAL DUTCH");
    if (w.symbol === "TTE") keys.push("TOTAL", "TOTALENERGIES", "FRENCH OIL");
    if (w.symbol === "EWH") keys.push("HONG KONG", "HANG SENG", "HK");
    if (w.symbol === "EWT") keys.push("TAIWAN", "TAIWANESE");
    if (w.symbol === "EWA") keys.push("AUSTRALIA", "AUSTRALIAN", "ASX");
    if (w.symbol === "ENZL") keys.push("NEW ZEALAND", "NZ", "NZX");
    return keys.map((k) => [k, w]);
  }),
);

// Region groups for UI
export const regions = [
  { code: "IN", name: "India", color: "#ff7a1a" },
  { code: "CN", name: "China & Greater China", color: "#ff4d4f" },
  { code: "JP", name: "Japan", color: "#f5c542" },
  { code: "KR", name: "South Korea", color: "#3ba7ff" },
  { code: "SG", name: "South-East Asia", color: "#2ecc71" },
  { code: "AS", name: "Australia & Pacific", color: "#2ecc71" },
  { code: "WA", name: "West Asia", color: "#8b7cf6" },
  { code: "IL", name: "Israel", color: "#2ecc71" },
  { code: "EU", name: "European Union", color: "#3ba7ff" },
  { code: "GB", name: "United Kingdom", color: "#a8b3c1" },
  { code: "FR", name: "France", color: "#3ba7ff" },
  { code: "RU", name: "Russia", color: "#ff4d4f" },
  { code: "US", name: "United States", color: "#3ba7ff" },
  { code: "BR", name: "Brazil", color: "#2ecc71" },
  { code: "MX", name: "Mexico", color: "#ff7a1a" },
  { code: "ZA", name: "South Africa", color: "#f5c542" },
  { code: "AF", name: "Africa", color: "#2ecc71" },
  { code: "GL", name: "Global", color: "#e6ebf1" },
];

// Asia-Pacific group (for page rendering) — JP + KR + SG + AS
export const asiaRegions = ["JP", "KR", "SG", "AS"];

// Supported currencies for conversion
export const supportedCurrencies = ["USD", "INR", "EUR", "GBP", "JPY", "CNY", "SGD", "KRW"];
