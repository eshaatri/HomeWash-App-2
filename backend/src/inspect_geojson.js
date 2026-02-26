const fs = require("fs");
const JSONStream = require("JSONStream");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "india_pincodes.geojson");
const stream = fs.createReadStream(filePath);
const parser = JSONStream.parse("features.*");

let total = 0;
let withProps = 0;
parser.on("data", (f) => {
  total++;
  if (f.properties && Object.keys(f.properties).length > 0) {
    withProps++;
  }
});

parser.on("end", () => {
  console.log(`Summary: Total=${total}, WithProps=${withProps}`);
  process.exit(0);
});
