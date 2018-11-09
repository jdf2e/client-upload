#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const {toRegExp, parseOptionUri} = require('../lib/utils');
const ClientUpload = require('../');

program
.version(pkg.version)
.usage('<command> [options]')
.option('-v, --version', 'latest version');

program
.command('upload')
.description('use sftp to upload locale files')
.option('-s --source <source>', 'directory would be uploaded')
.option('-i --ignore <ignore>', 'ignore directory to be uploaded')
.option('-r --remote <remote>', 'remote server config')
.action(({
  source,
  ignore,
  remote = ''
}) => {
  const sftpOption = parseOptionUri(remote);
  ClientUpload({
    source,
    ignoreRegexp: ignore && toRegExp(ignore),
    sftpOption
  });
});

program.parse(process.argv);

if (program.args.length < 1) program.help();