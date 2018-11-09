const request = require('request');
const chalk = require('chalk');

function ftpUpload(ftpOptions, assetMap, fn) {
	
	let formData = {};
	let { username, password, target, host, port } = ftpOptions;
	let authStr = username && password? `${username}:${password}@` :'';

	assetMap.forEach(file => {
		formData[normalizePath(target + file.locPath)] = file.assetSource;
	});
	console.log('Start uploading');
	request.post({ url: `http://${authStr}${host}:${port}`, formData }, (error, res) => {
		console.log(chalk.bold.green('\n-----------------------------------------------'));
		console.log(chalk.green(`Upload file list:`));
		console.log(assetMap.map(asset => normalizePath(asset.locPath)));
		if (error) {
			console.log('Upload failed', error);
		} else if (res.statusCode !== 200) {
			console.log('Upload failed');
		} else {
			console.log(chalk.green(`Upload success!!!`));
			fn && fn();
		}
	});
};

function normalizePath(source) {
	return source.replace(/\\/g, "/").replace(/\/+/g, "/");
}

module.exports = ftpUpload;
