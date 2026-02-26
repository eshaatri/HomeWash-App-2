const axios = require("axios");

async function testOverpass() {
  const zip = "400064";
  const query = `[out:json][timeout:25];
    (
      rel["postal_code"="${zip}"];
      way["postal_code"="${zip}"];
      rel["boundary"="postal_code"]["postal_code"="${zip}"];
    );
    out geom;`;

  try {
    const res = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
    );
    console.log("Elements found:", res.data.elements.length);
    if (res.data.elements.length > 0) {
      console.log("Element Type:", res.data.elements[0].type);
      console.log("Tags:", res.data.elements[0].tags);
    } else {
      console.log("No elements found for this exact pincode in Overpass.");
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
}

testOverpass();
