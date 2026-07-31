export interface TerritoryClaim {
  claimant: string;
  status: string; // e.g. "Administers", "Claims sovereignty over", "Self-governs"
}

export interface DisputedTerritory {
  id: string;
  name: string;
  lat: number;
  lng: number;
  claims: TerritoryClaim[];
}

// Each entry lists every claimant's stated position, in their own terms,
// with no claim ordered above another. This is intentional — see
// docs/M05-GLOBAL-MAP.md for the reasoning.
export const disputedTerritories: DisputedTerritory[] = [
  {
    id: "kashmir",
    name: "Kashmir",
    lat: 36.08,
    lng: 74.8,
    claims: [
      {
        claimant: "India",
        status:
          "Administers Jammu & Kashmir, Ladakh; claims full region including Aksai Chin and Pakistan Occupied Kashmir",
      },
      {
        claimant: "Pakistan",
        status: "Administers PoK (Azad Kashmir), Gilgit-Baltistan; claims full region",
      },
      { claimant: "China", status: "Administers Aksai Chin; disputes India's claim to it" },
    ],
  },
  {
    id: "tibet",
    name: "Tibet",
    lat: 31.7,
    lng: 88.1,
    claims: [
      { claimant: "China (PRC)", status: "Governs as Tibet Autonomous Region since 1951" },
      {
        claimant: "Central Tibetan Administration",
        status: "Government-in-exile, based in Dharamshala, India; disputes PRC governance",
      },
    ],
  },
  {
    id: "taiwan",
    name: "Taiwan",
    lat: 23.7,
    lng: 121.0,
    claims: [
      {
        claimant: "Republic of China (Taiwan)",
        status: "Self-governs; does not claim to be part of the PRC",
      },
      { claimant: "China (PRC)", status: "Claims Taiwan as part of its territory" },
    ],
  },
  {
    id: "crimea",
    name: "Crimea",
    lat: 45.03,
    lng: 34.1,
    claims: [
      { claimant: "Russia", status: "Annexed 2014; administers as Russian territory" },
      {
        claimant: "Ukraine",
        status:
          "Claims as sovereign Ukrainian territory; not internationally recognized as Russian",
      },
    ],
  },
  {
    id: "western-sahara",
    name: "Western Sahara",
    lat: 24.2,
    lng: -12.9,
    claims: [
      { claimant: "Morocco", status: "Administers most of the territory" },
      {
        claimant: "Sahrawi Arab Democratic Republic (Polisario Front)",
        status: "Claims sovereignty; administers a smaller portion",
      },
    ],
  },
  {
    id: "golan-heights",
    name: "Golan Heights",
    lat: 33.0,
    lng: 35.8,
    claims: [
      {
        claimant: "Israel",
        status: "Administers; annexed 1981 (not widely internationally recognized)",
      },
      { claimant: "Syria", status: "Claims as sovereign Syrian territory" },
    ],
  },
];
