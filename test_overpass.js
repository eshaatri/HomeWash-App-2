async function testOverpass() {
  const zipcode = "400601";
  const query = `
        [out:json][timeout:25];
        (
          relation["boundary"="postal_code"]["postal_code"="${zipcode}"];
          way["boundary"="postal_code"]["postal_code"="${zipcode}"];
        );
        out geom;
    `;
  const url = "https://overpass-api.de/api/interpreter";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: query,
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

testOverpass();
