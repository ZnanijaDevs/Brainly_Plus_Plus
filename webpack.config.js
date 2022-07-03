/* eslint-disable */
const path = require("path");
const webpack = require("webpack");

const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const makeEntries = require("./makeEntries");
const { version } = require("./package.json");

const BUILD_DIR = "build";

const getConfigFile = (src) => path.resolve(path.join(__dirname, `src/configs/${src}`));

/** @type {webpack.Configuration} */
const config = {
  entry: {
    ...makeEntries("styles/*/index.scss", "styles", true),
    // ...makeEntries("views/Shared/*/index.t{s,sx}", "content-scripts", true),
    ...makeEntries("views/*/index.t{s,sx}", "content-scripts", true),
    ...makeEntries("views/Inject.ts", "content-scripts"),
    ...makeEntries("background/index.ts", "background"),
    ...makeEntries("popup/scripts/index.ts", "popup")
  },
  output: {
    path: path.resolve(__dirname, BUILD_DIR),
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/
    }, {
      test: /\.scss$/i,
      use: [
        MiniCssExtractPlugin.loader, 
        "css-loader", 
        "sass-loader"
      ],
      exclude: /node_modules/
    }],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
    plugins: [
      new TsConfigPathsPlugin()
    ]
  },
  target: "web",
  devtool: "inline-cheap-source-map",
  plugins: [
    new webpack.ProvidePlugin({
      MESSAGES: getConfigFile("messages.json"),
      SUBJECTS: getConfigFile("subjects.json"),
      GRADES: getConfigFile("grades.json"),
      RANKS: getConfigFile("ranks.json")
    }),
    new webpack.DefinePlugin({
      EXTENSION_VERSION: JSON.stringify(version)
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        "LICENSE.md",
        { from: "./src/icons/", to: "icons/" },
        {
          from: "manifest.json",
          transform: (_content) => {
            let newData = {
              ...JSON.parse(_content),
              version
            };
  
            return JSON.stringify(newData);
          }
        },
        { from: "./src/scripts/", to: "scripts/" },
        { from: "./src/popup/index.html", to: "popup/" }
      ]
    })
  ]
};

module.exports = config;