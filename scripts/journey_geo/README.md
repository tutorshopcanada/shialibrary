# Map data for the home page journey

`site/journey/geo.json` is generated, not hand-made. Two scripts build it from public Natural Earth data (no AI, no network needed once the inputs are downloaded).

1. Download the inputs into a scratch folder `dl/`:
   - `countries-50m.json` and `countries-110m.json` from the npm package `world-atlas@2.0.2` (jsDelivr: `https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json`, same for `110m`), saved as `dl/world50.json` and `dl/world110.json`.
   - `ne_50m_lakes.geojson` from `nvkelso/natural-earth-vector` (tag `v5.1.2`), saved as `dl/lakes50.json`.
2. From the scratch folder run:
   ```bash
   mkdir -p map
   python3 -I build_middle_east.py 0.9      # writes map/geo.json (Saudi Arabia, Iraq, Iran and neighbours, in detail)
   cp map/geo.json map/geo.me.json
   python3 -I build_world.py                # adds the world, North America and the Great Lakes; rewrites map/geo.json
   ```
3. Copy `map/geo.json` to `site/journey/geo.json`.

Add a stop by adding its latitude and longitude to the `cities` table in `build_middle_east.py` (and `build_world.py` for stops outside the Middle East), rebuilding, and adding the stop to `STOPS` in `site/js/journey.js`.
