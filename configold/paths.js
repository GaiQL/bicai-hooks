// 'use strict';

const path = require('path');
const fs = require('fs');
const package = require('../package.json');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);


module.exports = (type) => {
  return {
    appPath: resolveApp('.'),
    appBuild: resolveApp('build'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appIndexJs: resolveApp(`src/${type}/index.tsx`),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp(`src/${type}`),
    src: resolveApp(`src`),
    appTsConfig: resolveApp('tsconfig.json'),
    yarnLockFile: resolveApp('yarn.lock'),
    appNodeModules: resolveApp('node_modules'),
    setOrder: resolveApp('set-order.js'), // 增加 set-order 配置
    jsExclude: [resolveApp(`src/${type}`), ...[
      ...Object.keys(package.dependencies)
    ].map(x => {
      if (x == "react") {
        x = "react/index.js"
      }
      return path.resolve(appDirectory, "node_modules", x)
    })]
  }
};