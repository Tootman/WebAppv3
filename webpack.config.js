const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const { workboxPlugin, InjectManifest } = require('workbox-webpack-plugin');
// const { InjectManifest } = require('workbox-webpack-plugin');


module.exports = {
    devtool: '_source-map',
    entry: {
        app: './src/app.js'
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/dist/'
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
            //hash: true,
            template: './index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                minifyCSS: true
            }
        }),
        // following https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
        new workboxPlugin.GenerateSW({
            swDest: 'sw.js',
            clientsClaim: true,
            skipWaiting: true,
            // include: [/\.html$/, /\.js$/, /\.css$/],
            // globPatterns: ['dist/*.{js,png,jpg,gif,svg,html,css}'],
            // globDirectory: '.'
        }),
        // new InjectManifest({
        //     swSrc: './src/sw.js',
        //  })
    ]
}