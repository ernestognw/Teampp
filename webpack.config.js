const path = require("path");

module.exports = {
  entry: {
    index: "./dist/raw.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "node",
  mode: "production",
};
