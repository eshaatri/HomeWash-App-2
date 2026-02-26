import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";

const router = express.Router();

let cachedMumbaiPincodes: any = null;
const getMumbaiPincodes = () => {
  if (cachedMumbaiPincodes) return cachedMumbaiPincodes;
  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "mumbai_pincodes.geojson",
    );
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      cachedMumbaiPincodes = JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Failed to load local pincodes dataset:", err);
  }
  return cachedMumbaiPincodes;
};

// Proxy for Administrative Boundaries
router.get("/boundary", async (req, res) => {
  const { zipcode, city, name } = req.query;
  const GOOGLE_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;

  try {
    const headers = { "User-Agent": "HomeWashApp/1.2 (sudeep@homewash.com)" };

    // 1. Get Details from Google Geocoding (Most accurate for names/pincodes)
    let resolvedName = name as string;
    let resolvedCity = city as string;
    let location: any = null;
    let viewport: any = null;

    if (zipcode || (name && city)) {
      try {
        const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json`;
        const gRes = await axios.get(googleUrl, {
          params: {
            address: zipcode ? `${zipcode}, India` : `${name}, ${city}, India`,
            key: GOOGLE_KEY,
          },
        });

        if (gRes.data.status === "OK") {
          const result = gRes.data.results[0];
          location = result.geometry.location;
          viewport = result.geometry.viewport;

          const localityComp = result.address_components.find((c: any) =>
            c.types.includes("locality"),
          )?.long_name;
          const sublocalityComp = result.address_components.find((c: any) =>
            c.types.includes("sublocality_level_1"),
          )?.long_name;

          if (!resolvedName) {
            if (sublocalityComp) resolvedName = sublocalityComp;
            else if (localityComp) resolvedName = localityComp;
          }
        } else {
          console.warn(
            "Google Geocoding failed with status:",
            gRes.data.status,
            gRes.data.error_message || "",
          );
          // Fallback to Nominatim for basic geocoding (to get coordinates and locality name)
          const nominatimUrl = `https://nominatim.openstreetmap.org/search`;
          const nGeoRes = await axios.get(nominatimUrl, {
            params: {
              q: zipcode ? `${zipcode}, India` : `${name}, ${city}, India`,
              format: "json",
              limit: 1,
              addressdetails: 1,
            },
            headers,
          });

          if (nGeoRes.data && nGeoRes.data.length > 0) {
            const result = nGeoRes.data[0];
            location = {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon),
            };
            if (result.boundingbox) {
              viewport = {
                northeast: {
                  lat: parseFloat(result.boundingbox[1]),
                  lng: parseFloat(result.boundingbox[3]),
                },
                southwest: {
                  lat: parseFloat(result.boundingbox[0]),
                  lng: parseFloat(result.boundingbox[2]),
                },
              };
            }
            if (!resolvedName) {
              resolvedName =
                result.address.suburb ||
                result.address.neighbourhood ||
                result.address.city_district ||
                result.address.locality ||
                resolvedName;
            }
          }
        }
      } catch (e) {
        console.warn(
          "Google Geocoding fallback chain failed:",
          (e as any).message,
        );
      }
    }

    // 2. Check local dataset (Fastest & most accurate for known India Pincodes)
    if (zipcode) {
      try {
        const localData = getMumbaiPincodes();
        if (localData && localData.features) {
          const feature = localData.features.find(
            (f: any) =>
              String(f.properties?.pin_code) === String(zipcode) ||
              String(f.properties?.Name) === String(zipcode) ||
              String(f.properties?.pincode) === String(zipcode),
          );

          if (feature && feature.geometry) {
            return res.json({
              source: "local-dataset",
              geojson: feature.geometry,
              lat: location?.lat,
              lon: location?.lng,
              display_name: resolvedName || zipcode,
            });
          }
        }
      } catch (err) {
        console.warn("Error accessing local dataset:", err);
      }
    }

    // 2. Try Overpass API (Specifically for jagged administrative/postal boundaries)
    const overpassSearch = async (query: string) => {
      const url = `https://overpass-api.de/api/interpreter`;
      const zipQueries = zipcode
        ? `
          rel["postal_code"="${zipcode}"];
          way["postal_code"="${zipcode}"];
      `
        : "";

      const searchName = query || resolvedName;
      const nameQueries = searchName
        ? `
          rel["name"~"${searchName}",i]["boundary"="administrative"]["admin_level"~"^(8|9|10)$"];
          rel["name"~"${searchName}",i]["boundary"="postal_code"];
          rel["name"~"${searchName}",i]["place"~"^(suburb|neighbourhood|locality)$"];
      `
        : "";

      // Search for relation or way with the name or postal code
      const body = `[out:json][timeout:25];
        (
${zipQueries}
${nameQueries}
        );
        out geom;`;

      const res = await axios.post(url, body, { timeout: 10000 });
      if (res.data && res.data.elements) {
        // Filter elements that have geometry and are somewhat large
        const elementsWithGeom = res.data.elements.filter(
          (e: any) => e.geometry && e.geometry.length > 5,
        );
        if (elementsWithGeom.length > 0) {
          // Pick the most complex one
          const element = elementsWithGeom.sort(
            (a: any, b: any) =>
              (b.geometry?.length || 0) - (a.geometry?.length || 0),
          )[0];
          const coordinates = element.geometry.map((p: any) => [p.lon, p.lat]);
          // Ensure first and last are same for Polygon
          if (
            coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
            coordinates[0][1] !== coordinates[coordinates.length - 1][1]
          ) {
            coordinates.push(coordinates[0]);
          }
          return { type: "Polygon", coordinates: [coordinates] };
        }
      }
      return null;
    };

    let overpassGeo = null;
    if (zipcode || resolvedName) {
      try {
        overpassGeo = await overpassSearch(resolvedName);
      } catch (e) {
        console.warn(
          "Overpass search failed or timed out:",
          (e as any).message,
        );
      }
    }

    if (overpassGeo) {
      return res.json({
        source: "overpass",
        geojson: overpassGeo,
        lat: location?.lat,
        lon: location?.lng,
        display_name: resolvedName || zipcode,
      });
    }

    // 3. Fallback to Nominatim (Standard jagged boundary search)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search`;
    const searchQueries = [];
    if (zipcode) searchQueries.push(`${zipcode}, India`);
    if (resolvedName)
      searchQueries.push(`${resolvedName}, ${city || ""}, India`);

    for (const q of searchQueries) {
      try {
        const nRes = await axios.get(nominatimUrl, {
          params: {
            q: q,
            format: "json",
            polygon_geojson: "1",
            limit: 15,
            addressdetails: 1,
          },
          headers,
        });

        const bestMatch = nRes.data.find(
          (r: any) =>
            r.geojson &&
            (r.geojson.type === "Polygon" ||
              r.geojson.type === "MultiPolygon") &&
            JSON.stringify(r.geojson.coordinates).length > 200,
        );

        if (bestMatch) {
          return res.json({
            source: "nominatim",
            geojson: bestMatch.geojson,
            display_name: bestMatch.display_name,
            lat: bestMatch.lat || location?.lat,
            lon: bestMatch.lon || location?.lng,
          });
        }
      } catch (e) {
        continue;
      }
    }

    // 4. Last Resort: Return the point so the map can pan, but don't draw a fake rectangle
    if (location) {
      return res.json({
        source: "google-point",
        geojson: null, // No fake boundary
        lat: location.lat,
        lon: location.lng,
        display_name: resolvedName || zipcode,
      });
    }

    res.status(404).json({ message: "No boundary found even with fallbacks" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
