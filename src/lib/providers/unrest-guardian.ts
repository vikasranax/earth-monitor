import { fetchWithCache } from "@/lib/fetch-with-cache";
import { serverEnv } from "@/lib/env";
import type { UnrestLiveResult, UnrestMarker } from "./unrest-acled";

const BASE_URL = "https://content.guardianapis.com/search";

// Stricter query to avoid false positives
const SEARCH_QUERY =
  '"protest" OR "riots" OR "civil unrest" OR "anti-government" OR "clashes with police"';

interface GuardianResponse {
  response?: {
    results?: GuardianArticle[];
  };
}

interface GuardianArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: {
    trailText?: string;
  };
}

// Massive list of major global cities and conflict hotspots with exact coordinates
const CITY_COORDS: Record<string, { lat: number; lng: number; country: string }> = {
  // ─── Europe ───
  Paris: { lat: 48.8566, lng: 2.3522, country: "France" },
  London: { lat: 51.5074, lng: -0.1278, country: "United Kingdom" },
  Berlin: { lat: 52.52, lng: 13.405, country: "Germany" },
  Rome: { lat: 41.9028, lng: 12.4964, country: "Italy" },
  Madrid: { lat: 40.4168, lng: -3.7038, country: "Spain" },
  Athens: { lat: 37.9838, lng: 23.7275, country: "Greece" },
  Moscow: { lat: 55.7558, lng: 37.6173, country: "Russia" },
  Kyiv: { lat: 50.4501, lng: 30.5234, country: "Ukraine" },
  Minsk: { lat: 53.9006, lng: 27.559, country: "Belarus" },
  Warsaw: { lat: 52.2297, lng: 21.0122, country: "Poland" },
  Prague: { lat: 50.0755, lng: 14.4378, country: "Czech Republic" },
  Vienna: { lat: 48.2082, lng: 16.3738, country: "Austria" },
  Budapest: { lat: 47.4979, lng: 19.0402, country: "Hungary" },
  Bucharest: { lat: 44.4268, lng: 26.1025, country: "Romania" },
  Sofia: { lat: 42.6977, lng: 23.3219, country: "Bulgaria" },
  Belgrade: { lat: 44.7866, lng: 20.4489, country: "Serbia" },
  Zagreb: { lat: 45.815, lng: 15.9819, country: "Croatia" },
  Sarajevo: { lat: 43.8563, lng: 18.4131, country: "Bosnia" },
  Tirana: { lat: 41.3275, lng: 19.8187, country: "Albania" },
  Skopje: { lat: 41.9981, lng: 21.4254, country: "North Macedonia" },
  Podgorica: { lat: 42.4304, lng: 19.2594, country: "Montenegro" },
  Pristina: { lat: 42.6629, lng: 21.1655, country: "Kosovo" },
  Tallinn: { lat: 59.437, lng: 24.7536, country: "Estonia" },
  Riga: { lat: 56.9496, lng: 24.1052, country: "Latvia" },
  Vilnius: { lat: 54.6872, lng: 25.2797, country: "Lithuania" },
  Helsinki: { lat: 60.1699, lng: 24.9384, country: "Finland" },
  Stockholm: { lat: 59.3293, lng: 18.0686, country: "Sweden" },
  Oslo: { lat: 59.9139, lng: 10.7522, country: "Norway" },
  Copenhagen: { lat: 55.6761, lng: 12.5683, country: "Denmark" },
  Amsterdam: { lat: 52.3676, lng: 4.9041, country: "Netherlands" },
  Brussels: { lat: 50.8476, lng: 4.3572, country: "Belgium" },
  Zurich: { lat: 47.3769, lng: 8.5417, country: "Switzerland" },
  Geneva: { lat: 46.2044, lng: 6.1432, country: "Switzerland" },
  Lisbon: { lat: 38.7223, lng: -9.1393, country: "Portugal" },
  Dublin: { lat: 53.3498, lng: -6.2603, country: "Ireland" },
  Glasgow: { lat: 55.8609, lng: -4.2514, country: "United Kingdom" },
  Manchester: { lat: 53.4808, lng: -2.2426, country: "United Kingdom" },
  Birmingham: { lat: 52.4862, lng: -1.8904, country: "United Kingdom" },
  Edinburgh: { lat: 55.9533, lng: -3.1883, country: "United Kingdom" },
  Barcelona: { lat: 41.3851, lng: 2.1734, country: "Spain" },
  Milan: { lat: 45.4642, lng: 9.19, country: "Italy" },
  Naples: { lat: 40.8518, lng: 14.2681, country: "Italy" },
  Marseille: { lat: 43.2965, lng: 5.3698, country: "France" },
  Lyon: { lat: 45.764, lng: 4.8357, country: "France" },
  Frankfurt: { lat: 50.1109, lng: 8.6821, country: "Germany" },
  Munich: { lat: 48.1351, lng: 11.582, country: "Germany" },
  Hamburg: { lat: 53.5511, lng: 9.9937, country: "Germany" },
  Cologne: { lat: 50.9375, lng: 6.9603, country: "Germany" },
  Stuttgart: { lat: 48.7758, lng: 9.1829, country: "Germany" },
  Istanbul: { lat: 41.0082, lng: 28.9784, country: "Turkey" },
  Ankara: { lat: 39.9334, lng: 32.8597, country: "Turkey" },
  Tbilisi: { lat: 41.7151, lng: 44.8271, country: "Georgia" },
  Yerevan: { lat: 40.1872, lng: 44.5152, country: "Armenia" },
  Baku: { lat: 40.4093, lng: 49.8671, country: "Azerbaijan" },

  // ─── Middle East / West Asia ───
  Tehran: { lat: 35.6892, lng: 51.389, country: "Iran" },
  "Tel Aviv": { lat: 32.0853, lng: 34.7818, country: "Israel" },
  Jerusalem: { lat: 31.7683, lng: 35.2137, country: "Israel" },
  Beirut: { lat: 33.8938, lng: 35.5018, country: "Lebanon" },
  Damascus: { lat: 33.5138, lng: 36.2765, country: "Syria" },
  Baghdad: { lat: 33.3152, lng: 44.3661, country: "Iraq" },
  Amman: { lat: 31.9454, lng: 35.9284, country: "Jordan" },
  Riyadh: { lat: 24.7136, lng: 46.6753, country: "Saudi Arabia" },
  Jeddah: { lat: 21.4858, lng: 39.1925, country: "Saudi Arabia" },
  Mecca: { lat: 21.3891, lng: 39.8579, country: "Saudi Arabia" },
  Medina: { lat: 24.5247, lng: 39.5692, country: "Saudi Arabia" },
  Doha: { lat: 25.2854, lng: 51.531, country: "Qatar" },
  "Abu Dhabi": { lat: 24.4539, lng: 54.3773, country: "UAE" },
  Dubai: { lat: 25.2048, lng: 55.2708, country: "UAE" },
  Kuwait: { lat: 29.3759, lng: 47.9774, country: "Kuwait" },
  Manama: { lat: 26.2285, lng: 50.586, country: "Bahrain" },
  Muscat: { lat: 23.5859, lng: 58.4059, country: "Oman" },
  Sanaa: { lat: 15.3694, lng: 44.191, country: "Yemen" },
  Aden: { lat: 12.7855, lng: 45.0187, country: "Yemen" },
  Gaza: { lat: 31.5, lng: 34.47, country: "Palestine" },
  Ramallah: { lat: 31.8996, lng: 35.2042, country: "Palestine" },
  Hebron: { lat: 31.5326, lng: 35.0998, country: "Palestine" },
  Aleppo: { lat: 36.2021, lng: 37.1343, country: "Syria" },
  Homs: { lat: 34.7308, lng: 36.7094, country: "Syria" },
  Erbil: { lat: 36.1911, lng: 44.0092, country: "Iraq" },
  Basra: { lat: 30.5156, lng: 47.7804, country: "Iraq" },
  Mosul: { lat: 36.3566, lng: 43.1642, country: "Iraq" },

  // ─── South Asia ───
  "New Delhi": { lat: 28.6139, lng: 77.209, country: "India" },
  Delhi: { lat: 28.7041, lng: 77.1025, country: "India" },
  Mumbai: { lat: 19.076, lng: 72.8777, country: "India" },
  Kolkata: { lat: 22.5726, lng: 88.3639, country: "India" },
  Chennai: { lat: 13.0827, lng: 80.2707, country: "India" },
  Bangalore: { lat: 12.9716, lng: 77.5946, country: "India" },
  Hyderabad: { lat: 17.4065, lng: 78.4772, country: "India" },
  Pune: { lat: 18.5204, lng: 73.8567, country: "India" },
  Ahmedabad: { lat: 23.0225, lng: 72.5714, country: "India" },
  Jaipur: { lat: 26.9124, lng: 75.7873, country: "India" },
  Lucknow: { lat: 26.8467, lng: 80.9462, country: "India" },
  Kanpur: { lat: 26.4499, lng: 80.3319, country: "India" },
  Nagpur: { lat: 21.1458, lng: 79.0882, country: "India" },
  Patna: { lat: 25.5941, lng: 85.1376, country: "India" },
  Bhopal: { lat: 23.2599, lng: 77.4126, country: "India" },
  Indore: { lat: 22.7196, lng: 75.8577, country: "India" },
  Islamabad: { lat: 33.6844, lng: 73.0479, country: "Pakistan" },
  Karachi: { lat: 24.8607, lng: 67.0011, country: "Pakistan" },
  Lahore: { lat: 31.5204, lng: 74.3587, country: "Pakistan" },
  Peshawar: { lat: 34.0151, lng: 71.5249, country: "Pakistan" },
  Quetta: { lat: 30.1798, lng: 66.975, country: "Pakistan" },
  Rawalpindi: { lat: 33.5651, lng: 73.0169, country: "Pakistan" },
  Dhaka: { lat: 23.8103, lng: 90.4125, country: "Bangladesh" },
  Chittagong: { lat: 22.3569, lng: 91.7832, country: "Bangladesh" },
  Colombo: { lat: 6.9271, lng: 79.8612, country: "Sri Lanka" },
  Kandy: { lat: 7.2906, lng: 80.6337, country: "Sri Lanka" },
  Kathmandu: { lat: 27.7172, lng: 85.324, country: "Nepal" },
  Thimphu: { lat: 27.4728, lng: 89.639, country: "Bhutan" },
  Male: { lat: 4.1755, lng: 73.5093, country: "Maldives" },

  // ─── East Asia ───
  Beijing: { lat: 39.9042, lng: 116.4074, country: "China" },
  Shanghai: { lat: 31.2304, lng: 121.4737, country: "China" },
  "Hong Kong": { lat: 22.3193, lng: 114.1694, country: "China" },
  Guangzhou: { lat: 23.1291, lng: 113.2644, country: "China" },
  Shenzhen: { lat: 22.5431, lng: 114.0579, country: "China" },
  Chengdu: { lat: 30.5728, lng: 104.0668, country: "China" },
  Wuhan: { lat: 30.5928, lng: 114.3055, country: "China" },
  Xi: { lat: 34.3416, lng: 108.9398, country: "China" },
  Nanjing: { lat: 32.0603, lng: 118.7969, country: "China" },
  Hangzhou: { lat: 30.2741, lng: 120.1551, country: "China" },
  Chongqing: { lat: 29.563, lng: 106.5516, country: "China" },
  Tianjin: { lat: 39.0842, lng: 117.201, country: "China" },
  Tokyo: { lat: 35.6762, lng: 139.6503, country: "Japan" },
  Osaka: { lat: 34.6937, lng: 135.5023, country: "Japan" },
  Nagoya: { lat: 35.1815, lng: 136.9066, country: "Japan" },
  Sapporo: { lat: 43.0618, lng: 141.3545, country: "Japan" },
  Fukuoka: { lat: 33.5902, lng: 130.4017, country: "Japan" },
  Seoul: { lat: 37.5665, lng: 126.978, country: "South Korea" },
  Busan: { lat: 35.1796, lng: 129.0756, country: "South Korea" },
  Incheon: { lat: 37.4563, lng: 126.7052, country: "South Korea" },
  Pyongyang: { lat: 39.0392, lng: 125.7625, country: "North Korea" },
  Taipei: { lat: 25.033, lng: 121.5654, country: "Taiwan" },
  Kaohsiung: { lat: 22.6273, lng: 120.3014, country: "Taiwan" },
  Manila: { lat: 14.5995, lng: 120.9842, country: "Philippines" },
  Cebu: { lat: 10.3157, lng: 123.8854, country: "Philippines" },
  Davao: { lat: 7.1907, lng: 125.4553, country: "Philippines" },
  Hanoi: { lat: 21.0278, lng: 105.8342, country: "Vietnam" },
  "Ho Chi Minh City": { lat: 10.8231, lng: 106.6297, country: "Vietnam" },
  Bangkok: { lat: 13.7563, lng: 100.5018, country: "Thailand" },
  Chiang: { lat: 18.7883, lng: 98.9853, country: "Thailand" },
  Phnom: { lat: 11.5564, lng: 104.9282, country: "Cambodia" },
  Vientiane: { lat: 17.9757, lng: 102.6331, country: "Laos" },
  Yangon: { lat: 16.8409, lng: 96.1735, country: "Myanmar" },
  Naypyidaw: { lat: 19.7633, lng: 96.0785, country: "Myanmar" },
  Mandalay: { lat: 21.9813, lng: 96.0823, country: "Myanmar" },
  Kuala: { lat: 3.139, lng: 101.6869, country: "Malaysia" },
  Singapore: { lat: 1.3521, lng: 103.8198, country: "Singapore" },
  Jakarta: { lat: -6.2088, lng: 106.8456, country: "Indonesia" },
  Surabaya: { lat: -7.2575, lng: 112.7521, country: "Indonesia" },
  Bandung: { lat: -6.9175, lng: 107.6191, country: "Indonesia" },
  Medan: { lat: 3.5952, lng: 98.6722, country: "Indonesia" },

  // ─── Africa ───
  Cairo: { lat: 30.0444, lng: 31.2357, country: "Egypt" },
  Alexandria: { lat: 31.2001, lng: 29.9187, country: "Egypt" },
  Giza: { lat: 30.0131, lng: 31.2089, country: "Egypt" },
  Khartoum: { lat: 15.5007, lng: 32.5599, country: "Sudan" },
  Omdurman: { lat: 15.6478, lng: 32.4807, country: "Sudan" },
  Nairobi: { lat: -1.2921, lng: 36.8219, country: "Kenya" },
  Mombasa: { lat: -4.0435, lng: 39.6682, country: "Kenya" },
  Lagos: { lat: 6.5244, lng: 3.3792, country: "Nigeria" },
  Abuja: { lat: 9.0765, lng: 7.3986, country: "Nigeria" },
  Kano: { lat: 12.0022, lng: 8.592, country: "Nigeria" },
  Ibadan: { lat: 7.3775, lng: 3.947, country: "Nigeria" },
  Pretoria: { lat: -25.7479, lng: 28.2293, country: "South Africa" },
  "Cape Town": { lat: -33.9249, lng: 18.4241, country: "South Africa" },
  Johannesburg: { lat: -26.2041, lng: 28.0473, country: "South Africa" },
  Durban: { lat: -29.8587, lng: 31.0218, country: "South Africa" },
  Tunis: { lat: 36.8065, lng: 10.1815, country: "Tunisia" },
  Algiers: { lat: 36.7538, lng: 3.0588, country: "Algeria" },
  Oran: { lat: 35.6971, lng: -0.6308, country: "Algeria" },
  Tripoli: { lat: 32.8872, lng: 13.1913, country: "Libya" },
  Benghazi: { lat: 32.1167, lng: 20.0667, country: "Libya" },
  Casablanca: { lat: 33.5731, lng: -7.5898, country: "Morocco" },
  Rabat: { lat: 34.0209, lng: -6.8416, country: "Morocco" },
  Marrakech: { lat: 31.6295, lng: -7.9811, country: "Morocco" },
  Addis: { lat: 9.0054, lng: 38.7636, country: "Ethiopia" },
  "Dire Dawa": { lat: 9.5931, lng: 41.8661, country: "Ethiopia" },
  Mogadishu: { lat: 2.0469, lng: 45.3182, country: "Somalia" },
  Hargeisa: { lat: 9.56, lng: 44.0653, country: "Somaliland" },
  Kampala: { lat: 0.3476, lng: 32.5825, country: "Uganda" },
  Kigali: { lat: -1.9441, lng: 30.0619, country: "Rwanda" },
  Bujumbura: { lat: -3.3614, lng: 29.3599, country: "Burundi" },
  Kinshasa: { lat: -4.4419, lng: 15.2663, country: "DR Congo" },
  Lubumbashi: { lat: -11.6876, lng: 27.5026, country: "DR Congo" },
  Brazzaville: { lat: -4.2634, lng: 15.2429, country: "Congo" },
  Luanda: { lat: -8.839, lng: 13.2894, country: "Angola" },
  Harare: { lat: -17.8252, lng: 31.0335, country: "Zimbabwe" },
  Bulawayo: { lat: -20.1325, lng: 28.6265, country: "Zimbabwe" },
  Lusaka: { lat: -15.3875, lng: 28.3228, country: "Zambia" },
  Ndola: { lat: -12.9692, lng: 28.6364, country: "Zambia" },
  Maputo: { lat: -25.9692, lng: 32.5732, country: "Mozambique" },
  Beira: { lat: -19.8433, lng: 34.8389, country: "Mozambique" },
  Antananarivo: { lat: -18.8792, lng: 47.5079, country: "Madagascar" },
  Port: { lat: -20.1619, lng: 57.4989, country: "Mauritius" },
  Dakar: { lat: 14.7167, lng: -17.4677, country: "Senegal" },
  Bamako: { lat: 12.6392, lng: -8.0029, country: "Mali" },
  Ouagadougou: { lat: 12.3714, lng: -1.5197, country: "Burkina Faso" },
  Niamey: { lat: 13.5116, lng: 2.1254, country: "Niger" },
  Ndjamena: { lat: 12.1348, lng: 15.0557, country: "Chad" },
  Bangui: { lat: 4.3947, lng: 18.5582, country: "CAR" },
  Yaounde: { lat: 3.848, lng: 11.5021, country: "Cameroon" },
  Douala: { lat: 4.0511, lng: 9.7679, country: "Cameroon" },
  Libreville: { lat: 0.4162, lng: 9.4673, country: "Gabon" },
  Malabo: { lat: 3.75, lng: 8.7833, country: "Equatorial Guinea" },
  Freetown: { lat: 8.4657, lng: -13.2317, country: "Sierra Leone" },
  Monrovia: { lat: 6.3156, lng: -10.8074, country: "Liberia" },
  Conakry: { lat: 9.6412, lng: -13.5784, country: "Guinea" },
  Bissau: { lat: 11.8636, lng: -15.5843, country: "Guinea-Bissau" },
  Banjul: { lat: 13.455, lng: -16.5775, country: "Gambia" },
  Accra: { lat: 5.6037, lng: -0.187, country: "Ghana" },
  Kumasi: { lat: 6.6666, lng: -1.6163, country: "Ghana" },
  Abidjan: { lat: 5.36, lng: -4.0083, country: "Ivory Coast" },
  Yamoussoukro: { lat: 6.8276, lng: -5.2893, country: "Ivory Coast" },
  Lome: { lat: 6.1725, lng: 1.2314, country: "Togo" },
  Cotonou: { lat: 6.3703, lng: 2.3912, country: "Benin" },
  Porto: { lat: 6.4969, lng: 2.6289, country: "Benin" },
  // ── North America ──
  Washington: { lat: 38.9072, lng: -77.0369, country: "United States" },
  "Washington D.C.": { lat: 38.9072, lng: -77.0369, country: "United States" },
  "New York": { lat: 40.7128, lng: -74.006, country: "United States" },
  "Los Angeles": { lat: 34.0522, lng: -118.2437, country: "United States" },
  Chicago: { lat: 41.8781, lng: -87.6298, country: "United States" },
  Houston: { lat: 29.7604, lng: -95.3698, country: "United States" },
  Phoenix: { lat: 33.4484, lng: -112.074, country: "United States" },
  Philadelphia: { lat: 39.9526, lng: -75.1652, country: "United States" },
  Dallas: { lat: 32.7767, lng: -96.797, country: "United States" },
  Atlanta: { lat: 33.749, lng: -84.388, country: "United States" },
  Seattle: { lat: 47.6062, lng: -122.3321, country: "United States" },
  Minneapolis: { lat: 44.9778, lng: -93.265, country: "United States" },
  "San Francisco": { lat: 37.7749, lng: -122.4194, country: "United States" },
  Miami: { lat: 25.7617, lng: -80.1918, country: "United States" },
  Ottawa: { lat: 45.4215, lng: -75.6972, country: "Canada" },
  Toronto: { lat: 43.6532, lng: -79.3832, country: "Canada" },
  Montreal: { lat: 45.5017, lng: -73.5673, country: "Canada" },
  Vancouver: { lat: 49.2827, lng: -123.1207, country: "Canada" },
  Calgary: { lat: 51.0447, lng: -114.0719, country: "Canada" },
  "Mexico City": { lat: 19.4326, lng: -99.1332, country: "Mexico" },
  Guadalajara: { lat: 20.6597, lng: -103.3496, country: "Mexico" },
  Monterrey: { lat: 25.6866, lng: -100.3161, country: "Mexico" },
  Havana: { lat: 23.1136, lng: -82.3666, country: "Cuba" },
  "Port-au-Prince": { lat: 18.5944, lng: -72.3074, country: "Haiti" },
  "Santo Domingo": { lat: 18.4861, lng: -69.9312, country: "Dominican Republic" },
  "San José": { lat: 9.9281, lng: -84.0907, country: "Costa Rica" },
  "Panama City": { lat: 8.9824, lng: -79.5199, country: "Panama" },
  Kingston: { lat: 17.9714, lng: -76.792, country: "Jamaica" },

  // ── South America ──
  Brasilia: { lat: -15.8267, lng: -47.9218, country: "Brazil" },
  "Sao Paulo": { lat: -23.5505, lng: -46.6333, country: "Brazil" },
  "Rio de Janeiro": { lat: -22.9068, lng: -43.1729, country: "Brazil" },
  Salvador: { lat: -12.9714, lng: -38.5014, country: "Brazil" },
  Fortaleza: { lat: -3.7172, lng: -38.5433, country: "Brazil" },
  "Belo Horizonte": { lat: -19.9167, lng: -43.9345, country: "Brazil" },
  Bogota: { lat: 4.711, lng: -74.0721, country: "Colombia" },
  Medellin: { lat: 6.2442, lng: -75.5812, country: "Colombia" },
  Cali: { lat: 3.4516, lng: -76.532, country: "Colombia" },
  Cartagena: { lat: 10.391, lng: -75.4794, country: "Colombia" },
  Lima: { lat: -12.0464, lng: -77.0428, country: "Peru" },
  Arequipa: { lat: -16.409, lng: -71.5375, country: "Peru" },
  Trujillo: { lat: -8.1116, lng: -79.0287, country: "Peru" },
  Santiago: { lat: -33.4489, lng: -70.6693, country: "Chile" },
  Valparaiso: { lat: -33.0472, lng: -71.6127, country: "Chile" },
  Concepcion: { lat: -36.8201, lng: -73.0444, country: "Chile" },
  "Buenos Aires": { lat: -34.6037, lng: -58.3816, country: "Argentina" },
  Cordoba: { lat: -31.4201, lng: -64.1888, country: "Argentina" },
  Rosario: { lat: -32.9442, lng: -60.6505, country: "Argentina" },
  Mendoza: { lat: -32.8895, lng: -68.8458, country: "Argentina" },
  Montevideo: { lat: -34.9011, lng: -56.1645, country: "Uruguay" },
  Asuncion: { lat: -25.2637, lng: -57.5759, country: "Paraguay" },
  Quito: { lat: -0.1807, lng: -78.4678, country: "Ecuador" },
  Guayaquil: { lat: -2.1894, lng: -79.8891, country: "Ecuador" },
  "La Paz": { lat: -16.4897, lng: -68.1193, country: "Bolivia" },
  "Santa Cruz": { lat: -17.7833, lng: -63.1821, country: "Bolivia" },
  Caracas: { lat: 10.4806, lng: -66.9036, country: "Venezuela" },
  Maracaibo: { lat: 10.6427, lng: -71.6125, country: "Venezuela" },
};
function extractLocation(
  title: string,
  text?: string,
): { lat: number; lng: number; name: string } | null {
  const content = `${title} ${text || ""}`;

  // Check for cities first using word boundaries
  for (const city of Object.keys(CITY_COORDS)) {
    const regex = new RegExp(`\\b${city}\\b`, "i");
    if (regex.test(content)) {
      const c = CITY_COORDS[city];
      // Fix: Add this undefined check to satisfy TypeScript
      if (!c) continue;

      return { lat: c.lat, lng: c.lng, name: `${city}, ${c.country}` };
    }
  }

  return null;
}

export async function fetchLiveUnrestGuardian(): Promise<UnrestLiveResult> {
  const apiKey = serverEnv.GUARDIAN_API_KEY;
  if (!apiKey) {
    return {
      markers: [],
      cached: false,
      fetchedAt: new Date().toISOString(),
      armed: false,
      source: "none",
    };
  }

  try {
    const { data, cached } = await fetchWithCache(
      "unrest:guardian:v4", // Bumped cache key to force refresh
      async () => {
        const params = new URLSearchParams({
          "api-key": apiKey,
          q: SEARCH_QUERY,
          "show-fields": "trailText",
          "order-by": "newest",
          "page-size": "50",
          section: "world",
        });

        const res = await fetch(`${BASE_URL}?${params.toString()}`);
        if (!res.ok) throw new Error(`Guardian API responded ${res.status}`);

        const json = (await res.json()) as GuardianResponse;
        const articles = json.response?.results ?? [];

        const byLocation = new Map<string, UnrestMarker>();

        for (const article of articles) {
          const loc = extractLocation(article.webTitle, article.fields?.trailText);
          if (!loc) continue;

          const key = loc.name;
          const existing = byLocation.get(key);
          const detailLabel =
            article.webTitle.length > 100
              ? article.webTitle.slice(0, 100) + "..."
              : article.webTitle;

          if (existing) {
            existing.count += 1;
            if (existing.details.length < 3) {
              existing.details.push({
                label: detailLabel,
                url: article.webUrl,
              });
            }
          } else {
            byLocation.set(key, {
              id: key,
              locationName: key,
              lat: loc.lat,
              lng: loc.lng,
              count: 1,
              details: [
                {
                  label: detailLabel,
                  url: article.webUrl,
                },
              ],
            });
          }
        }

        return Array.from(byLocation.values()).sort((a, b) => b.count - a.count);
      },
      { ttlSeconds: 1800 }, // 30 min cache
    );

    return {
      markers: data,
      cached,
      fetchedAt: new Date().toISOString(),
      armed: true,
      source: "guardian",
    };
  } catch (err) {
    return {
      markers: [],
      cached: false,
      fetchedAt: new Date().toISOString(),
      armed: true,
      source: "none",
      error: err instanceof Error ? err.message : "Unknown error fetching Guardian data",
    };
  }
}
