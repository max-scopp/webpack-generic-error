const webpack = require("webpack");
const path = require("path");
const extend = require("just-extend");

const Auw = require("./auw.config");
const Config = require("./webpack.config");

const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const AssetsPlugin = require("assets-webpack-plugin");

//const CriticalPlugin = require("webpack-plugin-critical").CriticalPlugin;

Config.entry = Object.assign(
  {},
  Auw.entryPoints.client,
  Auw.entryPoints.styles
);
Config.output.path = Auw.outputPath;
Config.output.publicPath = Auw.publicPath;

/*
Config.plugins
  .push
  new FaviconsWebpackPlugin({
    prefix: "icons-[hash]/",
    emitStats: false,
    persistentCache: true,
    inject: false,
    background: "#fff",
    logo: Auw.appIcon,
    title: Auw.appName,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: true,
      coast: false,
      favicons: true,
      firefox: true,
      opengraph: false,
      twitter: false,
      yandex: false,
      windows: false
    }
  })
  ();
 */
Config.plugins.push(
  new AssetsPlugin({
    filename: "_auw-compiler-state.json",
    //includeManifest: "manifest",
    path: path.join(Auw.outputPath, Auw.entryStats)
  })
);

if (Config.mode === Auw.PROD) {
  Config.plugins.push(
    new webpack.optimize.AggressiveSplittingPlugin({
      options: {
        minSize: 512000,
        maxSize: 1000000,
        chunkOverhead: 0,
        entryChunkMultiplicator: 1
      }
    })
  );
}

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

  //pathinfo: true
});

extend(true, Config, Auw.webpackExtend);

module.exports = Config;
