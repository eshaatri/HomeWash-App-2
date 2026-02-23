async function testOverpass() {
  const zipcode = "400601";
  const queries = [
    `[out:json];relation["postal_code"="${zipcode}"];out geom;`,
    `[out:json];relation["addr:postcode"="${zipcode}"];out geom;`,
    `[out:json];way["postal_code"="${zipcode}"];out geom;`,
    `[out:json];way["addr:postcode"="${zipcode}"];out geom;`,
  ];

  const url = "https://overpass-api.de/api/interpreter";

  for (const query of queries) {
    console.log(`Testing query: ${query}`);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: query,
      });
      const data = await response.json();
      if (data.elements && data.elements.length > 0) {
        console.log(`Success with query: ${query}`);
        console.log(JSON.stringify(data, null, 2));
        return;
      }
    } catch (e) {
      console.error(e);
    }
  }
  console.log("No results found in Overpass.");
}

testOverpass();
