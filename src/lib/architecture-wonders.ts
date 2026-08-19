export type ArchitectureCategory = "modern" | "wonder" | "unesco" | "heritage-india";

export interface ArchitectureSite {
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  category: ArchitectureCategory;
}

// Curated starter set — modern architectural marvels, the New 7 Wonders of
// the World, major ASI (Archaeological Survey of India) heritage sites, and
// other globally iconic UNESCO landmarks. Coordinates are approximate for
// a few less-documented modern buildings (flagged inline); precise for
// all major historical sites.
export const architectureSites: ArchitectureSite[] = [
  // Modern architecture marvels
  { name: "Lotus Temple", location: "New Delhi", country: "India", lat: 28.5535, lng: 77.2588, category: "modern" },
  { name: "The Whale", location: "Andenes", country: "Norway", lat: 69.327, lng: 16.118, category: "modern" }, // approximate
  { name: "ArtScience Museum", location: "Singapore", country: "Singapore", lat: 1.2863, lng: 103.8593, category: "modern" },
  { name: "Heydar Aliyev Center", location: "Baku", country: "Azerbaijan", lat: 40.3959, lng: 49.8672, category: "modern" },
  { name: "Beijing Daxing International Airport", location: "Beijing", country: "China", lat: 39.5098, lng: 116.4106, category: "modern" },
  { name: "Esplanade Theatre and Concert Hall", location: "Singapore", country: "Singapore", lat: 1.2897, lng: 103.8558, category: "modern" },
  { name: "National Museum of Qatar", location: "Doha", country: "Qatar", lat: 25.2955, lng: 51.5309, category: "modern" },
  { name: "Beijing National Stadium", location: "Beijing", country: "China", lat: 39.9928, lng: 116.3975, category: "modern" },
  { name: "Yoga & Meditation Retreat", location: "Nusa Penida", country: "Indonesia", lat: -8.7274, lng: 115.5444, category: "modern" }, // approximate, island area
  { name: "Al Bahar Towers", location: "Abu Dhabi", country: "UAE", lat: 24.4539, lng: 54.3232, category: "modern" }, // approximate
  { name: "Eden Project", location: "Cornwall", country: "United Kingdom", lat: 50.3619, lng: -4.7447, category: "modern" },
  { name: "TWA Flight Center", location: "JFK Airport, New York", country: "United States", lat: 40.6459, lng: -73.7767, category: "modern" },
  { name: "Burj Khalifa", location: "Dubai", country: "UAE", lat: 25.1972, lng: 55.2744, category: "modern" },
  { name: "Eiffel Tower", location: "Paris", country: "France", lat: 48.8584, lng: 2.2945, category: "modern" },

  // UNESCO World Heritage (architectural)
  { name: "Sagrada Familia", location: "Barcelona", country: "Spain", lat: 41.4036, lng: 2.1744, category: "unesco" },
  { name: "Park Güell", location: "Barcelona", country: "Spain", lat: 41.4145, lng: 2.1527, category: "unesco" },
  { name: "Sydney Opera House", location: "Sydney", country: "Australia", lat: -33.8568, lng: 151.2153, category: "unesco" },
  { name: "Angkor Wat", location: "Siem Reap", country: "Cambodia", lat: 13.4125, lng: 103.8670, category: "unesco" },
  { name: "Alhambra", location: "Granada", country: "Spain", lat: 37.1760, lng: -3.5881, category: "unesco" },
  { name: "Statue of Liberty", location: "New York", country: "United States", lat: 40.6892, lng: -74.0445, category: "unesco" },
  { name: "Forbidden City", location: "Beijing", country: "China", lat: 39.9163, lng: 116.3972, category: "unesco" },
  { name: "Borobudur", location: "Magelang", country: "Indonesia", lat: -7.6079, lng: 110.2038, category: "unesco" },
  { name: "Alcázar of Seville", location: "Seville", country: "Spain", lat: 37.3833, lng: -5.9903, category: "unesco" },

  // New 7 Wonders of the World
  { name: "Taj Mahal", location: "Agra", country: "India", lat: 27.1751, lng: 78.0421, category: "wonder" },
  { name: "Great Wall of China", location: "Badaling, Beijing", country: "China", lat: 40.4319, lng: 116.5704, category: "wonder" },
  { name: "Petra", location: "Ma'an", country: "Jordan", lat: 30.3285, lng: 35.4444, category: "wonder" },
  { name: "Christ the Redeemer", location: "Rio de Janeiro", country: "Brazil", lat: -22.9519, lng: -43.2105, category: "wonder" },
  { name: "Machu Picchu", location: "Cusco Region", country: "Peru", lat: -13.1631, lng: -72.5450, category: "wonder" },
  { name: "Chichen Itza", location: "Yucatán", country: "Mexico", lat: 20.6843, lng: -88.5678, category: "wonder" },
  { name: "Colosseum", location: "Rome", country: "Italy", lat: 41.8902, lng: 12.4922, category: "wonder" },
  { name: "Great Pyramid of Giza", location: "Giza", country: "Egypt", lat: 29.9792, lng: 31.1342, category: "wonder" },

  // ASI / India heritage sites
  { name: "Sun Temple", location: "Konark, Odisha", country: "India", lat: 19.8876, lng: 86.0945, category: "heritage-india" },
  { name: "Khajuraho Group of Monuments", location: "Khajuraho, Madhya Pradesh", country: "India", lat: 24.8318, lng: 79.9199, category: "heritage-india" },
  { name: "Hampi", location: "Karnataka", country: "India", lat: 15.3350, lng: 76.4600, category: "heritage-india" },
  { name: "Ellora Caves", location: "Maharashtra", country: "India", lat: 20.0269, lng: 75.1780, category: "heritage-india" },
  { name: "Ajanta Caves", location: "Maharashtra", country: "India", lat: 20.5519, lng: 75.7033, category: "heritage-india" },
  { name: "Qutub Minar", location: "New Delhi", country: "India", lat: 28.5245, lng: 77.1855, category: "heritage-india" },
  { name: "Red Fort", location: "New Delhi", country: "India", lat: 28.6562, lng: 77.2410, category: "heritage-india" },
  { name: "Shore Temple", location: "Mahabalipuram, Tamil Nadu", country: "India", lat: 12.6167, lng: 80.1927, category: "heritage-india" },
  { name: "Meenakshi Amman Temple", location: "Madurai, Tamil Nadu", country: "India", lat: 9.9195, lng: 78.1193, category: "heritage-india" },
];

export function getSitesByCategory(category: ArchitectureCategory): ArchitectureSite[] {
  return architectureSites.filter((s) => s.category === category);
}
