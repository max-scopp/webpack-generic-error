const webpack = require("webpack");
const path = require("path");
const extend = require("just-extend");

const Auw = require("./auw.config");
const Config = require("./webpack.config");

Config.entry = Object.assign(
  {},
  Auw.entryPoints.client,
  Auw.entryPoints.styles
);
Config.output.path = Auw.outputPath;
Config.output.publicPath = Auw.publicPath;

extend(true, Config.optimization, {
  splitChunks: {
    cacheGroups: {
      vendor: {
        chunks: "initial",
        test: path.resolve(__dirname, "node_modules"),
        name: "vendor",
        enforce: true
      }
    }
  },

  runtimeChunk: {
    name: "manifest"
  }
});

extend(true, Config, Auw.webpackExtend);

module.exports = Config;
