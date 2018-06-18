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
  },
  {
    test: /\.s?[ac]ss$/,
    //fallback: "style-loader!css-loader!sass-loader!postcss-loader",
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          sourceMap: true,
          url: true,

          alias: {
            T3: path.resolve(__dirname, rootPath)
          }
          //for later
          /*
            importLoaders: 1,
            modules: 1,
            namedExport: true,
            localIdentName: "[name]__[local]---[hash:base64:5]"*/
        }
      },
      {
        loader: "postcss-loader",
        options: {
          sourceMap: true,
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            autoprefixer({
              browsers: [
                ">2%",
                "last 4 versions",
                "Firefox ESR",
                "not ie < 9" // React doesn't support IE8 anyway
              ],
              flexbox: "no-2009"
            })
          ]
        }
      },
      {
        loader: "sass-loader", // compiles Sass to CSS
        options: {
          sourceMap: true,
          cache: true,
          debug: true,
          "output-pathinfo": true,
          includePaths: [
            path.resolve(__dirname, "./node_modules"),
            path.resolve(__dirname, "./typo3conf/ext/")
          ],
          importer: [require("node-sass-globbing")]
        }
      }
    ]
  },

  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      {
        loader: "file-loader",
        options: {
          //emitFile: false
        }
      }
    ]
  },

  // Fonts Loading
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    exclude: /PubStatic/,
    use: ["file-loader"]
  },

  //TODO: Remove in near future
  {
    test: /\.hbs/,
    loader: "handlebars-loader"
  }
];
