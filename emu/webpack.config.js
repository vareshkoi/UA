"use strict";

var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

require("es6-promise").polyfill();

module.exports = {
  entry: "./src/main.js",

  output: {
    path: __dirname,
    filename: "js/app.js"
  },

  plugins: [
    // Specify the resulting CSS filename
    new ExtractTextPlugin({
      filename: "css/app.css",
      allChunks: true,
      disable: true
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "postcss-loader", "sass-loader"]
        })
      }
    ]
  },

  stats: {
    // Colored output
    colors: true
  },

  devtool: "hidden-source-map"
};
