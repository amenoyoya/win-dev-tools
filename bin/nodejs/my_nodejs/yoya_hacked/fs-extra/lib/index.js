var assign = require('./util/assign')

var fse = {}
var gfs = require('graceful-fs')

// attach fs methods to fse
Object.keys(gfs).forEach(function (key) {
  fse[key] = gfs[key]
})

var fs = fse

assign(fs, require('./copy'))
assign(fs, require('./copy-sync'))
assign(fs, require('./mkdirs'))
assign(fs, require('./remove'))
assign(fs, require('./json'))
assign(fs, require('./move'))
assign(fs, require('./empty'))
assign(fs, require('./ensure'))
assign(fs, require('./output'))
assign(fs, require('./walk'))
assign(fs, require('./walk-sync'))

/*** <Added by yoya> ***/
var path = require('path');

/* ファイル・ディレクトリの存在判定 */
fs.isfile = function(file){
  try {
      return fs.statSync(file).isFile();
  } catch(err) {
      if(err.code === 'ENOENT') return false;
  }
};
fs.isdir = function(dir){
  try {
      return fs.statSync(file).isDirectory();
  } catch(err) {
      if(err.code === 'ENOENT') return false;
  }
};

/* pathライブラリをfsに統合 */
fs.normalize = path.normalize;
fs.join = path.join;
fs.resolve = path.resolve;
fs.dirname = path.dirname;
fs.basename = path.basename;
fs.extname = path.extname;

/* 実行スクリプトのディレクトリを取得 */
/* __dirname が使えるため不要
fs.rootdir = function(){
  return fs.dirname(process.argv[1]);
};*/

/** </Added by yoya>  **/

module.exports = fs

// maintain backwards compatibility for awhile
var jsonfile = {}
Object.defineProperty(jsonfile, 'spaces', {
  get: function () {
    return fs.spaces // found in ./json
  },
  set: function (val) {
    fs.spaces = val
  }
})

module.exports.jsonfile = jsonfile // so users of fs-extra can modify jsonFile.spaces
