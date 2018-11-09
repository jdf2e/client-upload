const glob = require('glob');
const c = require('chalk');
const fs = require('fs');
const url = require('url');

const libName = require('../package.json').name;

function log() {
  console.log.apply(console, arguments);
}

log.error = function(msg, exit) {
  log(c.gray('\n['+libName+']: ') + c.red(msg));
  exit && process.exit(0);
}

log.info = function(msg) {
  log(c.greenBright(msg));
}

function makeAssetsMap(dir, ignoreRegexp) {
  if(!dir || !dir.replace(/^\//, '').length) log.error('invalid params of directory name', 'exit');
  
  return new Promise((rs, rj) => {
    try{
      log.info('making assets map\n');
      const folders = [];
      const assetsMap = glob.sync(`${dir}/**`, {
        dot: true
      }).filter(file => {
        let test = true;
        if(getAgrType(ignoreRegexp) === 'regexp') test = !ignoreRegexp.test(file);
        const stat = fs.statSync(file);
        if(stat.isDirectory()) {
          folders.push(file.replace(dir, ''));
        }
        return test && stat.isFile();
      }).map(file => {
        return {
          locPath: file.replace(dir, ''),
          assetSource: fs.readFileSync(file)
        }
      });
      rs({assetsMap, folders});
    }catch(e) {
      rj(e);
    }
  });
}

function getAgrType(agr) {
  return Object.prototype.toString.call(agr).split(/\s/)[1].slice(0, -1).toLowerCase();
}
 
function toRegExp(str){
	str = getAgrType(str) === 'string'? str: JSON.stringify(str);
	return str === '*'? (/.+/gi): new RegExp(str.replace(/[\$\?\.\/\-\*\\]/g, '\\$&'), 'gi');
}

function parseOptionUri(uri) {
  // user:pass@host:port/target
  const {protocol: u, auth: a, port = 22, hostname: h, pathname: n} = url.parse(uri);
  if([u, a, h, n].every(v => !!v)) {
    return {
      host: h,
      port,
      username: u.slice(0, -1),
      password: a,
      target: n
    }
  }
  log.error('invalid params of remote uri[-r --remote uri].', 'exit');
}

const utils = {
  log,
  toRegExp,
  getAgrType,
  makeAssetsMap,
  parseOptionUri
}
module.exports = utils;