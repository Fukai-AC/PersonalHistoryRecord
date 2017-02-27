let webpack = require('webpack');
let path = require('path');
let config = require('./config/index.js');
let autoprefixer = require('autoprefixer');
let HtmlwebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let WebpackMd5Hash = require('webpack-md5-hash');
let OffLinePlugin = require('offline-plugin');
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');
const NODE_MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');

let _config = config();
let is_dev = process.env.NODE_ENV === 'development';

let webpackConfig = {
  entry: {
    commons: [
      'react', 'react-dom', 'react-router',
      'redux', 'react-redux', 'redux-saga',
      'react-intl', 'lodash', 'intl',
      'classnames', 'babel-polyfill'
    ],
    index: [
      './src/index'
    ]
  },
  output: {
    path: BUILD_PATH,
    filename: is_dev ? 'js/[name].js' : 'js/[name].[chunkhash].js',
    chunkFilename: is_dev ? 'js/[name].js' : 'js/[name].[chunkhash].js'
  },
  resolve: {
    modules: [
      ROOT_PATH,
      "node_modules"
    ],
    alias: {
      "src": SRC_PATH,
    },
    extensions: ['.ts', '.tsx', '.js', '.css', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader?limit=10000&name=img/[hash].[ext]&publicPath=' + _config.buildtime.both.image_host_url,
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-withimg-loader',
        exclude: /node_modules/
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      },
      'DEBUG': _config.buildtime.both.debug,
      'config' : JSON.stringify(_config.runtime)
    }),
    new HtmlwebpackPlugin({
      favicon: './favicon.ico', //favicon路径
      filename: 'index.html',
      chunks: ['commons', 'index'],
      template: './src/index.html',
      inject: true, //所有的 javascript 资源将被放置到 body 元素的底部
      hash: false, //为静态资源生成hash值
      minify: false
    }),
    new CleanWebpackPlugin(
      ['build'],
      {
        root: ROOT_PATH, // An absolute path for the root.
        verbose: true, // Write logs to console.
        dry: false, // Use boolean 'true' to test/emulate delete. (will not remove files).
      }
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'js/[name].js',
      minChunks: Infinity
    })
  ],
}
// 编译css
if ( is_dev || _config.buildtime.both.debug ) {
  webpackConfig.module.rules.push({
    test: /\.s?css$/,
    exclude: /node_modules/,
    use: [
      'style-loader',
      'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]',
      {
        loader: 'postcss-loader',
        options: {
          plugins: function () {
            return [
              autoprefixer({ browsers: ['last 10 versions', "> 1%"] })
            ];
          }
        }
      },
      'sass-loader'
    ]
  });
} else {
  webpackConfig.module.rules.push(
    {
      test: /\.s?css$/, use: ExtractTextPlugin.extract({
      fallback: "style-loader",
      use: [
        {
          loader: "css-loader",
          options: {
            modules: true,
            localIdentName: "[name]__[local]___[hash:base64:5]"
          }
        },
        {
          loader: "postcss-loader",
          options: {
            plugins: function () {
              return [
                require("autoprefixer")
              ];
            }
          }
        },
        {
          loader: "sass-loader"
        }
      ],
      // publicPath: "/"
    })
    });
  webpackConfig.plugins.push(
    new ExtractTextPlugin({
      filename: 'css/[name].[contenthash].css',
      disable: false,
      allChunks: true
    }),
    new WebpackMd5Hash()
  );
}

// 开启sourcemap
if ( is_dev || _config.buildtime.sourcemap ) {
  webpackConfig.devtool = 'inline-source-map';
  webpackConfig.module.rules.unshift(
    {
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "source-map-loader"
    },
    {
      enforce: 'pre',
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: "source-map-loader"
    });
}

// uglify
if ( _config.buildtime.uglify ) {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress: {
      warnings: false,
      drop_console: false,
    }
  }));
}

//offline
if (_config.runtime.both.offline) {
  let offline_config = {
    publicPath: '/',
    relativePaths: false,
    ServiceWorker: {
      entry: './sw-handler.js',
      output: 'service_worker.js',
      events: true,
      publicPath: '/service_worker.js',
      navigateFallbackURL: '/index.html',
      prefetchRequest: {
        credentials: 'same-origin',
        cache: 'default'
      }
    },
    AppCache: false
  };
  webpackConfig.plugins.push(new OffLinePlugin(offline_config));
}

// analyzer
if (_config.buildtime.analyze) {
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig
