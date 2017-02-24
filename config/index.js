"use strict";
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var cfg_dir = path.join(__dirname);
var cfg_env_var = 'WHITEPAW_CFG';

function generate_cfg() {
  var default_config_path = path.join(cfg_dir, 'default.json');
  var local_config_path = path.join(cfg_dir, 'local.json');
  var local_config = {};

  if (file_exists(local_config_path)) {
    local_config = require(local_config_path);
  }

  var default_config = require(default_config_path);
  var mixed_config = _.defaultsDeep({}, local_config, default_config);

  return mixed_config;
}

function file_exists(path) {
  try {
    fs.lstatSync(path);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = generate_cfg;
