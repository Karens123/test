"use strict";

const path = require("path");
const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: {
        ui: ["antd/lib/button",
            "antd/lib/input",
            "antd/lib/col",
            "antd/lib/row",
            "antd/lib/select",
            "antd/lib/table",
            "antd/lib/icon",
            "antd/lib/modal",
            "antd/lib/menu"],
    },
    output: {
        path: path.resolve(__dirname, "../front-vendor/"),
        filename: "[name].dll.[chunkhash:8].js",
        library: "[name]_lib"
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, ".."),
            manifest: require(path.resolve(__dirname, "../front-vendor/react-manifest.json"))
        }),
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