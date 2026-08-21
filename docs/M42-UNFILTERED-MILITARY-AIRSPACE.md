# M42 — Unfiltered Military Airspace

Free, no key, no OAuth — airplanes.live's `/v2/mil` endpoint, which does
not filter/anonymize military aircraft the way OpenSky does. Untested live
from the dev sandbox; parses the standard tar1090-family JSON shape shared
across most ADS-B community trackers. If it errors, the message is surfaced
directly in the UI, not swallowed silently.
