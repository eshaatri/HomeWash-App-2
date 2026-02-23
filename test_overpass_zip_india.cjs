const axios = require("axios");

async function testOverpass() {
  const zip = "400064";
  // Search within India bounding box approximately [6, 68, 38, 97]
  const query = `[out:json][timeout:25];
    (
      rel["postal_code"="${zip}"]["addr:country"="IN"];
      rel["postal_code"="${zip}"]["boundary"="postal_code"];
      way["postal_code"="${zip}"]["addr:country"="IN"];
    );
    out geom;`;

  try {
    const res = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
    );
    console.log("Elements found (India Filter):", res.data.elements.length);
    if (res.data.elements.length > 0) {
      console.log("Sample Tag:", res.data.elements[0].tags);
    } else {
      console.log(
        "No elements found for this exact pincode in India in Overpass.",
      );
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
}

testOverpass();
