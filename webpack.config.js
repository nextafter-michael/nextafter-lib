const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const fs = require("fs");

module.exports = () => {
  const env = dotenv.config().parsed;
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

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

  const cssModuleConfig = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
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
        library: "[name]",
        libraryTarget: "umd",
        globalObject: "this",
      },
      mode: "production",
      ...cssModuleConfig,
      plugins: [new webpack.DefinePlugin(envKeys)],
    };
    webpackEntries.push(webpackEntry);
    webpackEntry = {
      entry: entries,
      output: {
        path: path.resolve(__dirname, "dist", "esm", subdir),
        filename: "[name].js",
        libraryTarget: "module",
      },
      experiments: {
        outputModule: true,
      },
      mode: "production",
      ...cssModuleConfig,
      plugins: [new webpack.DefinePlugin(envKeys)],
    };
    webpackEntries.push(webpackEntry);
  });

  return [
    {
      entry: "./src/index.js",
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.umd.js",
        library: env.LIBRARY_NAME,
        libraryTarget: "umd",
        globalObject: "this",
      },
      mode: "production",
      ...cssModuleConfig,
      plugins: [new webpack.DefinePlugin(envKeys)],
    },
    {
      entry: "./src/index.js",
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.esm.js",
        libraryTarget: "module",
      },
      mode: "production",
      experiments: {
        outputModule: true,
      },
      ...cssModuleConfig,
      plugins: [new webpack.DefinePlugin(envKeys)],
    },
    {
      entry: "./src/index.js",
      output: {
        path: path.resolve(__dirname, "dist", "umd"),
        filename: "index.js",
        library: env.LIBRARY_NAME,
        libraryTarget: "umd",
        globalObject: "this",
      },
      mode: "production",
      ...cssModuleConfig,
      plugins: [new webpack.DefinePlugin(envKeys)],
    },
    {
      entry: "./src/index.js",
      output: {
        path: path.resolve(__dirname, "dist", "esm"),
        filename: "index.js",
        libraryTarget: "module",
      },
      mode: "production",
      experiments: {
        outputModule: true,
      },
      ...cssModuleConfig,
      plugins: [new webpack.DefinePlugin(envKeys)],
    },
    ...webpackEntries,
  ];
};
