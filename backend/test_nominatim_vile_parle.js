const axios = require("axios");

(async () => {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: "Vile Parle, Mumbai, India",
        format: "json",
        polygon_geojson: 1,
        addressdetails: 1,
        limit: 15,
      },
      headers: { "User-Agent": "HomeWashApp/1.2" },
    });
    console.log("Found matches: ", res.data.length);
    console.log(
      res.data.map((d) => ({
        name: d.display_name,
        class: d.class,
        type: d.type,
        osm_type: d.osm_type,
        geojsonType: d.geojson?.type,
        length: JSON.stringify(d.geojson?.coordinates || []).length,
      })),
    );
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
})();
