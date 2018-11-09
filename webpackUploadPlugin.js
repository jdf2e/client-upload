const ClientUpload = require('./');

function WebpackUploadPlugin(options) {

    const apply = compiler => {

        let handleAfterEmit = function (compilation, callback) {
            ClientUpload.call(this, options);
            callback();
        };
        compiler.plugin('after-emit', handleAfterEmit);
    }

    WebpackUploadPlugin.prototype.apply = apply;
}

module.exports = WebpackUploadPlugin;
