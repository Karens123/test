"use strict";

const webpack = require("webpack");
const merge = require("webpack-merge");

const config = require("./webpack");
const buildUtils = require("./buildUtils");

config.entry.main = ["webpack-hot-middleware/client"].concat(config.entry.main);

module.exports = merge(config, {
    module: {
        rules: buildUtils.styleLoaders({sourceMap: true})
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});
