async function testMappls() {
  const key = "tcvuzbxvvfgfhdfbdznvptlquaytcmrtbcey";
  const pincode = "400601";
  const url = `https://apis.mappls.com/advancedmaps/v1/${key}/geoanalytics/layers/pincode?filter=pincode:${pincode}`;

  try {
    const response = await fetch(url);
    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Response:", text);
  } catch (e) {
    console.error(e);
  }
}

testMappls();
