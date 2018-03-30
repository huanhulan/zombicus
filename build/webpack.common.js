const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function (cssLoaderOptions, sassLoaderOptions) {
    return {
        entry: ['babel-polyfill', "./app/index.ts"],

        output: {
            filename: "bundle.js",
            path: __dirname + "/../dist"
        },

        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json", ".png", ".wav"]
        },

        module: {
            rules: [
                {
                    test: /\.ts/, loaders: ['babel-loader', 'awesome-typescript-loader'], exclude: /node_modules/
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        use: [{
                            loader: "typings-for-css-modules-loader",
                            options: cssLoaderOptions
                        }, {
                            loader: "postcss-loader", options: {
                                sourceMap: true
                            }
                        }, {
                            loader: "sass-loader",
                            options: sassLoaderOptions
                        }]
                    })
                }, {
                    test: /\.(wav|png)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 10240
                        }
                    }]
                }, {
                    test: /\.modernizrrc\.json$/,
                    use: [{
                        loader: "modernizr-loader"
                    }, {
                        loader: "json-loader"
                    }]
                }]
        },
        plugins: [
            new ExtractTextPlugin("stylesheets/main.css")
        ]
    }
};