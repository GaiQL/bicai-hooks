const path = require('path');
const fs = require('fs');
const url = require('url');
const package = require('../package.json');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

module.exports = (type) => {

  let bankIdPaths = {};
  if( type ){

    bankIdPaths = {
      appIndexJs: resolveApp(`src/${type}/index.js`),
      appSrc: resolveApp(`src/${type}`),
      jsExclude: [resolveApp(`src/${type}`), ...[
        ...Object.keys(package.dependencies)
      ].map(x => {
        if (x == "react") {
          x = "react/index.js"
        }
        return path.resolve(appDirectory, "node_modules", x)
      })],
    }
    
  }

  return {
    appPath: resolveApp('.'),
    appBuild: resolveApp('build'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appPackageJson: resolveApp('package.json'),
    src: resolveApp(`src`),
    appTsConfig: resolveApp('tsconfig.json'),
    yarnLockFile: resolveApp('yarn.lock'),
    appNodeModules: resolveApp('node_modules'),
    setOrder: resolveApp('set-order.js'), // 增加 set-order 配置
    dotenv: resolveApp('.env'),
    appPublic: resolveApp('public'),
    testsSetup: resolveApp('src/setupTests.js'),
    proxySetup: resolveApp('src/setupProxy.js'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: getServedPath(resolveApp('package.json')),
    ...bankIdPaths
  }
};