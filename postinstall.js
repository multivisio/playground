'use strict'
var gentlyCopy = require("gently-copy");
const fs = require("fs");

gentlyCopy(
  ["src", "webpack.config.js"],
  process.env.INIT_CWD
);

const json = require(process.env.INIT_CWD + "/package.json");

if (!json.hasOwnProperty("scripts")) {
  json.scripts = {};
}

if (!json.scripts.hasOwnProperty("watch")) {
  json.scripts.watch = "webpack --watch";
}

if (!json.scripts.hasOwnProperty("serve")) {
  json.scripts.serve = "webpack serve --open";
}

if (!json.scripts.hasOwnProperty("build")) {
  json.scripts.build = "webpack";
}

fs.writeFileSync(process.env.INIT_CWD + "/package.json", JSON.stringify(json, null, 2));