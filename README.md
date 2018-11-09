### @nutui/upload
---
可以非常方便的使用该模块同步本地文件到服务器，支持`http`与`sftp`两种上传方式，
推荐首选`sftp`上传：
* 在`Linux`里开启`ssh`就默认启用了`sftp`，一般不需要单独配置
* `sftp`会加密传输认证信息和数据，相对来说更安全
* 注意服务器里目录的权限问题

### 安装
---
```js
npm i -D @nutui/upload
```

### 配置使用
---
```js
const ClientUpload = require('@nutui/upload');

ClientUpload({
  source: 'src',
  ignoreRegexp: /node_modules/,
  success: function() {},
  sftpOption: {
    host: '0.0.0.0',
    port: 1234,
    username: 'user',
    password: 'user',
    target: '/home'
  }
});
```

### 支持 webpack
---

```js
const WebpackUploadPlugin = require('@nutui/upload/webpackUploadPlugin');

// webpack.config.js
// 相关配置同上
{
  plugins: [
    ...
    new WebpackUploadPlugin(options)
  ]
}
```

### 支持命令行操作（nut）
---
通过命令来上传文件到服务器，仅支持`sftp`
```js
npm i -g @nutui/upload

nut upload <option>
```
* **-s --source** 待上传的文件目录
* **-i --ignore** 忽略的目录
* **-r --remote** 接收文件的服务器相关配置 `user:pass@ip:port/target`

### 参数说明
---
| 属性 | 说明 | 默认值 | 是否必填
|----- | ----- | ----- | -----
| source | 待上传的文件目录 | - | 是
| ignoreRegexp | 忽略文件的匹配模式 | - | 否
| success | 上传成功的回调 | - | 否
| sftpOption.host | 服务器地址 | - | 是
| sftpOption.port | 服务器端口 | 22 | 否
| sftpOption.username | 用户名 | - | 是
| sftpOption.password | 密码 | - | 是
| sftpOption.target | 接收文件的目录 | - | 是
| httpOption[option] | 参考 sftpOption | - | 是