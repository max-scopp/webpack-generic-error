const webpack = require("webpack");
const extend = require("just-extend");

const Auw = require("./auw.config");
const Config = require("./webpack.config");

Config.entry = Auw.entryPoints.server;
Config.output.path = Auw.outputServerPath;
Config.output.publicPath = "/";

Config.plugins.push(new webpack.IgnorePlugin(/\.s?css$/));

extend(true, Config, Auw.webpackServerExtend);
module.exports = Config;
