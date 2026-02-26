const fs = require("fs");
const JSONStream = require("JSONStream");
const path = require("path");

const filePath = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "india_pincodes.geojson",
);
const stream = fs.createReadStream(filePath, { encoding: "utf8" });
const parser = JSONStream.parse("features.*");

stream.pipe(parser);

let count = 0;
parser.on("data", (feature) => {
  count++;
  if (Object.keys(feature.properties).length > 0) {
    console.log("PROPERTIES:", feature.properties);
    stream.destroy();
  }
});

parser.on("end", () => {
  console.log(`Total features: ${count}`);
});
