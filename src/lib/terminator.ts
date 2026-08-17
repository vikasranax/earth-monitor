// Day/night terminator computation, ported from the widely-used, MIT-licensed
// Leaflet.Terminator plugin (Joerg Dietrich, github.com/joergdietrich/Leaflet.Terminator).
// Reimplemented directly rather than derived from scratch, since solar-position
// astronomy is easy to get subtly wrong — this uses a well-established algorithm.

function sunEclipticPosition(julianDay: number) {
  const n = julianDay - 2451545.0;
  let L = 280.46 + 0.9856474 * n;
  L %= 360;
  let g = 357.528 + 0.9856003 * n;
  g %= 360;
  const rad = Math.PI / 180;
  const lambda = L + 1.915 * Math.sin(g * rad) + 0.02 * Math.sin(2 * g * rad);
  return { lambda };
}

function eclipticObliquity(julianDay: number): number {
  const n = julianDay - 2451545.0;
  const T = n / 36525;
  return (
    23.43929111 -
    T * (46.836769 / 3600 - T * (0.0001831 / 3600 + T * (0.0020034 / 3600 - T * (0.576e-6 / 3600 - (T * 4.34e-8) / 3600))))
  );
}

function sunEquatorialPosition(sunEclLng: number, eclObliq: number) {
  const rad = Math.PI / 180;
  let alpha = Math.atan(Math.cos(eclObliq * rad) * Math.tan(sunEclLng * rad)) * (180 / Math.PI);
  const delta = Math.asin(Math.sin(eclObliq * rad) * Math.sin(sunEclLng * rad)) * (180 / Math.PI);

  const lQuadrant = Math.floor(sunEclLng / 90) * 90;
  const raQuadrant = Math.floor(alpha / 90) * 90;
  alpha = alpha + (lQuadrant - raQuadrant);

  return { alpha, delta };
}

function hourAngle(lng: number, alpha: number, gst: number): number {
  const lst = gst + lng / 15;
  return lst * 15 - alpha;
}

function terminatorLatitude(lng: number, sunPos: { alpha: number; delta: number }, gst: number): number {
  const rad = Math.PI / 180;
  const ha = hourAngle(lng, sunPos.alpha, gst);
  return Math.atan(-Math.cos(ha * rad) / Math.tan(sunPos.delta * rad)) * (180 / Math.PI);
}

function julianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function gmst(julianDay: number): number {
  const d = julianDay - 2451545.0;
  const T = d / 36525;
  const g = 280.46061837 + 360.98564736629 * d + 0.000387933 * T * T - (T * T * T) / 38710000;
  return ((g % 360) + 360) % 360;
}

/**
 * Computes the day/night terminator as a closed polygon (lat/lng pairs)
 * covering the night hemisphere at the given time. Resolution is the
 * longitude step in degrees — lower is smoother but more points.
 */
export function computeTerminatorPolygon(date: Date, resolution = 2): [number, number][] {
  const jd = julianDate(date);
  const sunEcl = sunEclipticPosition(jd);
  const eclObliq = eclipticObliquity(jd);
  const sunEq = sunEquatorialPosition(sunEcl.lambda, eclObliq);
  const gst = gmst(jd);

  const points: [number, number][] = [];
  const steps = Math.round(720 / resolution);

  for (let i = 0; i <= steps; i++) {
    const lng = -360 + i * resolution;
    const lat = terminatorLatitude(lng, sunEq, gst);
    points.push([lat, lng]);
  }

  // Close the polygon at the correct pole depending on which hemisphere
  // is currently tilted toward the sun.
  if (sunEq.delta < 0) {
    points.unshift([90, -360]);
    points.push([90, 360]);
  } else {
    points.unshift([-90, -360]);
    points.push([-90, 360]);
  }

  return points;
}
