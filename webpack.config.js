const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const workboxPlugin = require('workbox-webpack-plugin');


module.exports = {
    devtool: '_source-map',
    entry: {
        app: './src/app.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js',
        publicPath: '/build/'
    },
    module: {
        rules: [{
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
            } //,
            //  {
            //      test: /\.css$/,
            //      use: ['style-loader', 'css-loader']
            //  }
            ,
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins() {
                                return [
                                    precss,
                                    autoprefixer,
                                ];
                            },
                        },
                    },
                    { loader: 'sass-loader' },

                ],
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: './index.html',
            title: 'ORCL Mapping WebApp',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                minifyCSS: true
            }
        }),
        new workboxPlugin.GenerateSW({
            swDest: 'sw.js',
           // globDirectory: './build/',
           // globPatterns: ['**/*.{html,js,png,css}'],
            clientsClaim: true,
            skipWaiting: true,
        })
    ]
}