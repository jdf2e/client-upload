const utils = require('./utils');
const ftpUpload = require('./ftp-upload');
const sftpUpload = require('./sftp-upload');

const {log, getAgrType, makeAssetsMap} = utils;

function ClientUpload({
  httpOption: h,
  sftpOption: s,
  source, 
  ignoreRegexp,
  success
}) {
  
  if([h, s].every(k => getAgrType(k) !== 'object')) {
    log.error('httpOption or sftpOption must be provided !', 'exit');
  }

  if(s) {
    let {
      username, 
      password, 
      target, 
      host,
      port = 22
    } = s;
    if([username, password, target, host].some(k => !k)) {
      log.error('some sftpOption must be provided !', 'exit');
    }
    makeAssetsMap(source, ignoreRegexp)
    .then(({assetsMap, folders}) => {
      sftpUpload({
        host,
        port,
        username,
        password,
        target
      }, assetsMap, folders, success)
    }).catch(e => log.error(e));
  } else if(h) {
    let {
      username, 
      password, 
      target, 
      host,
      port = 20
    } = h;
    if(!target || !host) {
      log.error('target, host must be provided !', 'exit');
    }
    makeAssetsMap(source, ignoreRegexp)
    .then(({assetsMap}) => {
      ftpUpload({
        host,
        port,
        username,
        password,
        target
      }, assetsMap, success)
    }).catch(e => log.error(e));
  }
  
}
// const ClientUpload = require('@nutui/client-upload');

// ClientUpload({
//   source: 'src',
//   ignoreRegexp: /node_modules/,
//   success: function() {},
//   sftpOption: {
//     host: '192.168.182.85',
//     port: 34022,
//     username: 'fe',
//     password: 'fe',
//     source: 'dist',
//     target: '/home/fe/carefree-test1'
//   }
// });

module.exports = ClientUpload;
module.exports.ftpUpload = ftpUpload;
module.exports.sftpUpload = sftpUpload;