const webpack = require("webpack");
const path = require("path");

const ManifestPlugin = require("webpack-manifest-plugin");
//const CleanWebpackPlugin = require("clean-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
//const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
//const WebpackEntryStatsPlugin = require("webpack-entry-stats-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");
const NameAllModulesPlugin = require("name-all-modules-plugin");
const { TsConfigPathsPlugin } = require("awesome-typescript-loader");

const pkg = require("./package.json");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Auw = require("./auw.config");

module.exports = [
  //new TsConfigPathsPlugin(),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  }),
  new ManifestPlugin({
    opts: {
      basePath: Auw.outputPath,
      publicPath: Auw.publicPath,
      fileName: Auw.entryStats,
      stripSrc: null,
      transformExtensions: {},
      writeToFileEmit: true,
      cache: null
    }
  }),
  new MiniCssExtractPlugin("[name].min.css", {
    filename: "styles.[hash].css",
    chunkFilename: "[id].css",
    allChunks: false
  }),
  new webpack.DefinePlugin({
    PRODUCTION: JSON.stringify(!!process.env.NODE_ENV),
    VERSION: JSON.stringify(pkg.version),
    NAME: JSON.stringify(pkg.name),
    AUTHOR: JSON.stringify(pkg.author),
    InternalError: "Error",
    /**
     * Inejct T3 API-Gateway address for future proof sheez
     */
    SERVICE_URL: JSON.stringify("http://dev.example.com")
  }),
  new DashboardPlugin(
    process.env.DASHBOARD_PORT && {
      port: process.env.DASHBOARD_PORT
    }
  ),
  new webpack.NamedModulesPlugin(),
  new NameAllModulesPlugin()
];
