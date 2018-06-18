const path = require("path");
var autoprefixer = require("autoprefixer");

const rootPath = require("./auw.config").rootPath;

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = [
  // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`

  {
    test: /\.jsx?$/,
    // only match "typo3conf", anything else sucks
    exclude: /(node_modules(?!\/auw-framework)|bower_components|Public|typo3(?!(conf))\w*|sysext).*/,
    use: [
      {
        loader: "babel-loader",
        options: {
          babelrc: true
        }
      }
    ]
  },

  {
    test: /\.tsx?$/,
    exclude: /(node_modules|bower_components|Public|typo3|sysext)/,
    use: ["babel-loader", "awesome-typescript-loader"]
  }
];
