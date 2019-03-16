"use strict";

const path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.cssLoaders = function (options) {
    options = options || {}
    var cssLoader = {
        loader: "css-loader",
        options: {
            minimize: process.env.NODE_ENV === "production",
            sourceMap: options.sourceMap
        }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        var loaders = [cssLoader]
        if (loader) {
            loaders.push({
                loader: loader + "-loader",
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: "style-loader"
            })
        } else {
            return ["style-loader"].concat(loaders)
        }
    }

    // http://vuejs.github.io/vue-loader/enlish/configurations/extract-css.html
    return {
        css: generateLoaders(),
        less: generateLoaders("less"),
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
    var output = []
    var loaders = exports.cssLoaders(options)
    for (var extension in loaders) {
        var loader = loaders[extension]
        output.push({
            test: new RegExp("\\." + extension + "$"),
            use: loader
        })
    }
    return output
}

exports.alias = () => {
	let nodeEnv = process.env.NODE_ENV;
	if (!nodeEnv) {
		nodeEnv = 'development';
	}
	return {
		root: path.resolve(__dirname, '../'),
		src: path.resolve(__dirname, '../src'),
		business: path.resolve(__dirname, '../src/components/business'),
		example: path.resolve(__dirname, '../src/components/example'),
		framework: path.resolve(__dirname, '../src/framework'),
		utils: path.resolve(__dirname, '../src/utils'),
		res: path.resolve(__dirname, '../src/res'),
		middlewares: path.resolve(__dirname, '../src/middlewares'),
		store: path.resolve(__dirname, '../src/store'),
		WenwenApiHeaders: path.resolve(__dirname,
			`../src/config/api-headers-${nodeEnv}`),
		action: './action',
	}
}
exports.isStaticRes = (path) => {
	if(path) {
		return /^[\W|\w]+\.\w{2,}$/.test(path);
	}
	return false;
}
exports.env = () => {
	let nodeEnv = process.env.NODE_ENV;
	if (!nodeEnv) {
		nodeEnv = 'development';
	}
	const isDev = nodeEnv === 'development';
	console.log('webpack env config NODE_ENV :', nodeEnv);

	let wenwenApiBaseUrl = process.env.WENWEN_API_BASE_URL;
	if (!wenwenApiBaseUrl) {
		wenwenApiBaseUrl = 'http://debug.wenwen8.com:8881';
	}

	console.log('webpack env config WENWEN_API_BASE_URL', wenwenApiBaseUrl);
	let wenwenOssUrl = process.env.WENWEN_OSS_URL;
	if (!wenwenOssUrl) {
		wenwenOssUrl = 'http://test-img-server.oss-cn-shenzhen.aliyuncs.com/';
	}
	console.log('webpack env config WENWEN_OSS_URL', wenwenOssUrl);
	const env = {
		'process.env.NODE_ENV': JSON.stringify(nodeEnv),
		'process.env.isDev': JSON.stringify(isDev),
		'process.env.WENWEN_API_BASE_URL': JSON.stringify(wenwenApiBaseUrl),
		'process.env.WENWEN_OSS_URL': JSON.stringify(wenwenOssUrl),
		'process.env.OSS_BUCKET': JSON.stringify("test-img-server"),
	}
    if(process.env.WENWEN_ENV === 'prod') {
		env['process.env.OSS_BUCKET'] = JSON.stringify("release-file-server");
    }
    return env;
}
