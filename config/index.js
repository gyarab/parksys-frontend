const defaultConfig = require("./main");
const localConfig = require("./main.local");
const config = {
  ...defaultConfig,
  ...localConfig
};
module.exports.config = config;
