const path = require("path");

module.exports.PROD = "production";
module.exports.DEV = "development";

const rootPath = (module.exports.rootPath = "web/typo3conf/ext/");
const isServer = (module.exports.isServer = "__server-bundle");

//#region Pre-Config

// Add here your client(s).
// Check out the `entryPoints` to define code-points using your client
const Clients = {
  None: null, // for using explixit argument expression
  Default: "Default"
};

// Add here your Resource-base-path(s)
// Check out the `entryPoints` to define entry-points using this Resource const.
// You may use `[client]` as client placeholder.
const Resource = {
  App: name => `Resources/Private/App/${name}`,
  Style: name => `Resources/Private/Styles/${name}`
};

// Add here your target groups.
// Check out `Output` const for further information
const Groups = {
  App: "app",
  Print: "print",
  Rte: "rte"
};

//#endregion

/**
 * Here, we'll merge our Pre-Conf with our Compiler Options & Compiler files.
 * I've explicitly structured it like this, so the definition of `Output`,
 * `defineEntry` and `_extends` doesn't annoy you while figuring out
 * the important things in life.
 */
module.exports = ((Output, defineEntry, _extends) => {
  const entryPoints = {
    client: {
      [Output.Default(Groups.App)]: [
        defineEntry("auw_config", Resource.App("bootstrap.js"), Clients.Default)
      ]
    },
    styles: {
      [Output.Default(Groups.Print)]: [
        defineEntry("auw_config", Resource.Style("rte.scss"), Clients.Default)
      ],
      [Output.Default(Groups.Rte)]: [
        defineEntry("auw_config", Resource.Style("print.scss"), Clients.Default)
      ]
    },
    server: {
      [Output.Default(Groups.App + isServer)]: [
        defineEntry(
          "auw_config",
          Resource.App("bootstrap-server.js"),
          Clients.Default
        )
      ]
    }
  };

  return Object.assign(
    {
      // Folder in which to work on.
      rootPath: rootPath,

      publicPath: "/typo3conf/ext/auw_config/Resources/Public/",

      // Compile-To Path for the **Browser**
      outputPath: path.resolve(
        __dirname,
        rootPath,
        "auw_config/Resources/Public"
      ),

      // Compile-To Path for the **Server**
      outputServerPath: path.resolve(
        __dirname,
        rootPath,
        "auw_config/Resources/_ServerCompiled"
      ),

      // Relative to `outputPath`, where should I place my Stats?
      entryStats: "../"

      // Default Icon for T3 instance. Be cautious, single-client use only.
      // Implement that loop ya self, yo!
      //TODO: Waiting for package migration of webpack 4
      /*appIcon: "./auw_config/Resources/Private/app-icon.png",
      appName: Object.values(Clients).filter(v => !!v)[0]*/
    },
    {
      entryPoints
    },
    _extends
  );
  /**
   * ==========================================================================
   * Anything below is just black magic. Don't recommend scrolling further.
   */
}).apply(null, [
  /**
   * Factory Helper function based on the `Clients` variable.
   * This will mirror the Client-keys on `Output` and it's value
   * will be a function that combines the value of `Client` and the given
   * `filepath` argument to create a unique client-specific public path.
   */
  (function() {
    let out = {};

    for (let key in Clients) {
      /**
       * Helper Factory-Function
       * @param {string|Groups} filename filename or Group-Name of target
       */
      out[key] = filepath => {
        return `${Clients[key]}/${filepath}`;
      };
    }

    return out;
  })(),

  /**
   * Helper function to create Typo3-Extension Paths.
   *
   * @param {string} extension The Typo3-Extension to target
   * @param {string} client Client to target
   * @param {string} resource Resource Path relative to the ext-root
   */
  function defineEntry(extension, resource, client = Clients.None) {
    return path.resolve(
      rootPath,
      `${extension}/${resource.replace(
        /\[client\](\/)?/gi,
        client ? `${client}$1` : ""
      )}`
    );
  },

  {
    webpackExtend: {},
    webpackServerExtend: {
      target: "node",
      node: {
        global: true
      }
    }
  }
]);
