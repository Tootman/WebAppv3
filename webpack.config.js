const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const precss = require("precss");
const autoprefixer = require("autoprefixer");
const cleanPlugin = require("clean-webpack-plugin");
// const FontelloPlugin = require("fontello-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

//const workboxPlugin = require('workbox-webpack-plugin');

// const { InjectManifest } = require('workbox-webpack-plugin');
const { GenerateSW, InjectManifest } = require("workbox-webpack-plugin");

module.exports = {
  //devtool: "_source-map",
  devtool: "cheap-module-eval-source-map",
  entry: {
    app: "./src/app.js"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "bundle.js"
    //publicPath: '/dist/'  // changed for testing in prod
    //publicPath: '/WebAppv3/build/'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"] //
          //presets: ["env"]
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              plugins() {
                return [precss, autoprefixer];
              }
            }
          },
          { loader: "sass-loader" }
        ]
      },
      //{
      //    test: /\.css$/,
      //    loaders: ['style-loader', 'css-loader']
      //},
      //{
      // test: /\.(ttf|woff|svg|eot|woff2)$/,
      // use: [{
      //     loader: 'file-loader',
      //options: {
      //   name: "[path][name].[ext]",
      //   context: "src"
      //}
      //    }]
      //}
      // ,
      {
        test: /\.(ttf|woff|svg|eot|woff2|png|jpg|gif)$/,

        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
              context: "src"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new cleanPlugin(['build']),

    new HtmlWebpackPlugin({
      //hash: true,
      template: "./index.html",
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
    new GenerateSW({
      swDest: "sw.js",
      clientsClaim: true,
      skipWaiting: true,
      // include: [/\.html$/, /\.js$/, /\.css$/],
      globPatterns: ["/*.{png,jpg,gif,svg,css}"],
      globDirectory: "."
    }),

    //,
    //new FontelloPlugin({
    //    config: require("./src/fontello/config.json")
    //    /* ...options */
    //})
    new BundleAnalyzerPlugin()
  ]
};
