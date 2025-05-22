const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const fs = require("fs");
const TerserPlugin = require("terser-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const resolveAliases = {
  alias: {
    '@experiments': path.resolve(__dirname, 'src/experiments'),
    '@src': path.resolve(__dirname, 'src'),
    '@classes': path.resolve(__dirname, 'src/classes'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@dist': path.resolve(__dirname, 'dist'),
  }
};

const cssModuleConfig = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [ "style-loader", "css-loader", "sass-loader" ],
      },
    ],
  },
};

const optimizationConfig = {
  optimization: { // Added this optimization block
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            reserved: [
              "main", // Do not mangle the main function
              "init", // Do not mangle the init function
              "defaultOptions", // Do not mangle the defaultOptions property
            ],
          },
          format: {
            comments: false, // Remove comments
          },
        },
        extractComments: false, // Do not extract comments to a separate file
        parallel: true, // Use multi-process parallel running to improve build speed
      }),
    ],
  }
};

module.exports = () => {
  const env = dotenv.config().parsed;
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  const output = {
    esm: {
      libraryTarget: "module",
    },
    umd: {
      library: env.LIBRARY_NAME,
      libraryTarget: "umd",
      globalObject: "this",
    },
  };

  const getEntryPoints = (directory) => {
    const files = fs
      .readdirSync(directory)
      .filter((file) => file.endsWith(".js"));
    const entries = files.reduce((acc, file) => {
      const name = path.basename(file, ".js");
      acc[name] = path.join(directory, file);
      return acc;
    }, {});
    return entries;
  };

  const webpackEntries = [];
  const srcSubdirectories = fs.readdirSync(path.resolve(__dirname, "src")).filter((file) => fs.statSync(path.join(__dirname, "src", file)).isDirectory());
  srcSubdirectories.forEach((subdir) => {
    const subdirPath = path.resolve(__dirname, "src", subdir);
    const entries = getEntryPoints(subdirPath);
    let webpackEntry;
    webpackEntry = {
      entry: entries,
      output: {
        path: path.resolve(__dirname, "dist", "umd", subdir),
        filename: "[name].js",
        ...output.umd,
        library: "[name]",
      },
      mode: "production",
      ...cssModuleConfig,
      plugins: [new webpack.DefinePlugin(envKeys)],
      resolve: {
        ...resolveAliases,
      },
    };
    webpackEntries.push(webpackEntry);
    webpackEntry = {
      entry: entries,
      output: {
        path: path.resolve(__dirname, "dist", "esm", subdir),
        filename: "[name].js",
        ...output.esm,
      },
      experiments: {
        outputModule: true,
      },
      mode: "production",
      ...cssModuleConfig,
      plugins: [new webpack.DefinePlugin(envKeys)],
      resolve: {
        ...resolveAliases,
      },
    };
    webpackEntries.push(webpackEntry);
  });

  const experimentsBaseDir = path.resolve(__dirname, "src", "experiments");
  const experimentNames = fs.readdirSync(experimentsBaseDir)
    .filter(file => fs.statSync(path.join(experimentsBaseDir, file)).isDirectory());

  experimentNames.forEach((experimentName) => {
    const experimentDir = path.join(experimentsBaseDir, experimentName);
    const variantNames = fs.readdirSync(experimentDir)
      .filter(file => fs.statSync(path.join(experimentDir, file)).isDirectory());

    variantNames.forEach((variantName) => {
      const variantDir = path.join(experimentDir, variantName);
      const entries = getEntryPoints(variantDir); // getEntryPoints returns { filenameWithoutExt: fullpath }

      if (Object.keys(entries).length > 0) {
        // UMD entry for experiment variant
        let umdWebpackEntry = {
          entry: entries,
          output: {
            path: path.resolve(__dirname, "dist", "umd", "experiments", experimentName, variantName),
            filename: "[name].js",
            ...output.umd,
            library: "[name]", // Uses the filename as library name
          },
          mode: "production",
          ...cssModuleConfig,
          plugins: [new webpack.DefinePlugin(envKeys)],
          resolve: { ...resolveAliases },
          ...optimizationConfig
        };
        webpackEntries.push(umdWebpackEntry);

        // ESM entry for experiment variant
        let esmWebpackEntry = {
          entry: entries,
          output: {
            path: path.resolve(__dirname, "dist", "esm", "experiments", experimentName, variantName),
            filename: "[name].js",
            ...output.esm,
          },
          experiments: { outputModule: true },
          mode: "production",
          ...cssModuleConfig,
          plugins: [new webpack.DefinePlugin(envKeys)],
          resolve: { ...resolveAliases },
          ...optimizationConfig
        };
        webpackEntries.push(esmWebpackEntry);
        
        // JS entry for experiment variant
        let jsWebpackEntry = {
          entry: entries,
          output: {
            path: path.resolve(__dirname, "dist", "js", "experiments", experimentName, variantName),
            filename: "[name].js",
            libraryTarget: "var", // Plain variable assignment, no module system
            library: "main", // Uses the 'main' as library name (alternatively, you can use the filename, but you would have to detect that in the code)
            // code will be defined in 'var main = { ... }'
          },
          mode: "production",
          ...cssModuleConfig,
          plugins: [new webpack.DefinePlugin(envKeys)],
          resolve: { ...resolveAliases },
          ...optimizationConfig
        };
        webpackEntries.push(jsWebpackEntry);

        // JS entry for experiment variant
        let jsDevWebpackEntry = {
          ...jsWebpackEntry,
          output: {
            ...jsWebpackEntry.output,
            path: path.resolve(__dirname, "dist", "js-dev", "experiments", experimentName, variantName),
            filename: "[name].js",
          },
          mode: "development",
        };
        webpackEntries.push(jsDevWebpackEntry);
      }
    });
  });

  return [
    {
      entry: "./src/index.js",
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.umd.js",
        ...output.umd,
      },
      mode: "production",
      ...cssModuleConfig,
      plugins: [new webpack.DefinePlugin(envKeys)],
      resolve: {
        ...resolveAliases,
      },
    },
    {
      entry: "./src/index.js",
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.esm.js",
        ...output.esm,
      },
      mode: "production",
      experiments: {
        outputModule: true,
      },
      ...cssModuleConfig,
      plugins: [new webpack.DefinePlugin(envKeys)],
      resolve: {
        ...resolveAliases,
      },
    },
    {
      entry: "./src/index.js",
      output: {
        path: path.resolve(__dirname, "dist", "umd"),
        filename: "index.js",
        ...output.umd,
      },
      mode: "production",
      ...cssModuleConfig,
      plugins: [new webpack.DefinePlugin(envKeys)],
      resolve: {
        ...resolveAliases,
      },
    },
    {
      entry: "./src/index.js",
      output: {
        path: path.resolve(__dirname, "dist", "esm"),
        filename: "index.js",
        ...output.esm,
      },
      mode: "production",
      experiments: {
        outputModule: true,
      },
      ...cssModuleConfig,
      plugins: [new webpack.DefinePlugin(envKeys)],
      resolve: {
        ...resolveAliases,
      },
    },
    ...webpackEntries,
  ];
};
