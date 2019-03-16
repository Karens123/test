"use strict";

const path = require("path");
const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: {
        react: ["react", "react-redux", "react-router", "react-dom", "react-chartjs", "chart.js"],
        redux: ["redux-immutable", "redux-thunk", "redux"],
        lib: ["jquery", "superagent", "history", "moment", "md5", "lodash", "immutable", "co"]
    },
    resolve: {
        extensions: [".js", ".html"]
    },
    output: {
        path: path.resolve(__dirname, "../front-vendor/"),
        filename: "[name].dll.[chunkhash:8].js",
        library: "[name]_lib"
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: false,
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true,
                global_defs: {
                    DEBUG: false
                }
            },
            output: {
                comments: false
            }
        }),
        new webpack.DllPlugin({
            context: path.resolve(__dirname, ".."),
            path: path.resolve(__dirname, "../front-vendor/[name]-manifest.json"),
            name: "[name]_lib",
        })
    ]
};
