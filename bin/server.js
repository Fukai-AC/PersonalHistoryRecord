let path = require('path');
let webpack = require('webpack');
let config = require('../config/index.js');
let WebpackDevServer = require("webpack-dev-server");
let webpackConfig = require("../webpack.config.js");

let _config = config();
const IP = _config.runtime.origin_server.ip;
const PORT = _config.runtime.origin_server.port;

let serverConfig = {
  watchOptions:{
    aggregateTimeout: 300, //延迟时间
    poll: 1000, // 轮询间隔
  },
  hot: true,
  inline: true,
  historyApiFallback: true,
  compress: true,
  staticOptions: {
  },
  stats: { colors: true },
  contentBase: '../build/',
  publicPath: webpackConfig.output.publicPath,
  headers: {
    'X-Custom-Header': 'yes'
  },
  proxy: {
    '/**': {
      target: '/index.html',
      secure: false,
      bypass: function (req, res, proxyOptions) {
        if (req.path=='/config') {
          return res.json(_config.runtime)
        }
        return '/'
      }
    }
  },
}

// 开启Hot Module Replacement相关设置
if ( _config.buildtime.hot ) {
  webpackConfig.profile = true;
  webpackConfig.entry.index.unshift(
    "webpack-dev-server/client?http://localhost:" + PORT + "/",
    "webpack/hot/dev-server");
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  );
}

let compiler = webpack(webpackConfig);
let server = new WebpackDevServer(compiler, serverConfig);

server.listen(PORT, IP, function() {
  console.log('listening on ' + IP + ' : ' + PORT);
});
