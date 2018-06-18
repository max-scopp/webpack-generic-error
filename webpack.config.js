const webpack = require("webpack");
const path = require("path");

const rules = require("./webpack.loaders");
const plugins = require("./webpack.plugins");

const rootPath = require(path.resolve(__dirname, "auw.config")).rootPath;

module.exports = {
  output: {},
  context: path.resolve(__dirname, rootPath),
  mode:
    (process.env.NODE_ENV === "production" && process.env.NODE_ENV) ||
    "development",
  entry: null,
  optimization: {},
  devtool: "source-map",
  module: {
    rules: rules
  },
  plugins: plugins,
  target: "web",
  resolve: {
    // Define some alias for better code clearance
    alias: {
      "~T3": path.resolve(__dirname, rootPath),
      "old-framework": path.resolve(
        __dirname,
        rootPath + "auw_config/Resources/Private/App/deprecated/"
      )
      //"~": path.resolve(__dirname),
      //"@auw$": path.resolve(__dirname, "./auw-framework/index.js")
    },
    extensions: [".ts", ".tsx", ".jsx", ".js", ".vue", ".scss", ".hbs"]
  }
};
