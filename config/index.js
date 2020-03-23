const defaultConfig = require("./main");
const localConfig = require("./main.local");
const config = {
  ...defaultConfig,
  ...localConfig
};
// console.log(`CONFIG`, config);
module.exports.config = config;
