require('events').EventEmitter.defaultMaxListeners = 0;
const Client = require('ssh2-sftp-client');
const chalk = require('chalk');
const utils = require('./utils');

const {log} = utils;

function sshUpload(sshOptions, assetsMap, folders = [], fn) {
	const sftp = new Client();
	let { username, password, target, host, port } = sshOptions;
	log.info(chalk.green('ready to connect to sftp.\n'));
	sftp.connect({
		host,
		port,
		username,
		password
	})
	.then(() => {
		log.info(chalk.green(`connected to ${username}@${host} successful !`));
		
		if(folders.length) {
      log.info(chalk.green('\ninit directories ...\n'));
			const folderPromises = folders.map(folder => {
				return new Promise((rs, rj) => {
					const rfolder = normalizePath(target + folder);
					sftp.mkdir(rfolder).then(_ => rs(), _ => rs());
				});
			});
			Promise.all(folderPromises).then(res => {
				let promises = assetsMap.map(item => {
					return new Promise(function(rs, rj) {
						sftp.put(item.assetSource, normalizePath(target + item.locPath), {encoding: 'utf8'})
						.then(function() {
              const uploaded = normalizePath(item.locPath);
              console.log('uploaded ', uploaded)
							rs(uploaded);
						})
						.catch(function(err) {
              rj(err);
						});
					});
				});
				return Promise.all(promises)
						.then(res => {
              log.info('uploaded all.');
              fn && fn();
              sftp.end();
            })
						.catch(_ => {
              log.info(_);
              sftp.end();
            });
			});
		}
	})
	
}

function normalizePath(source) {
	return source.replace(/\\/g, "/").replace(/\/+/g, "/");
}

module.exports = sshUpload;
