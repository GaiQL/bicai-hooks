const paths = require("./paths");
const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rootDir = path.dirname(__dirname);
const Config = require('./index')
/**
 * 重写 react-scripts 默认配置
 */
module.exports = (config, env, type) => {
    config.entry = `${paths(type).appSrc}/index.js`
    config.devtool = false;
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.json', '.jsx'];
    config.resolve.plugins.push(
        new TsconfigPathsPlugin({
            configFile: paths(type).appTsConfig
        })
    );
    config.resolve.plugins.shift()
    config.resolve.alias = {
        "Common": path.resolve(rootDir, 'src', 'Common'),
        "src": path.resolve(rootDir, 'src'),
        "public": path.resolve(rootDir, 'public'),
        "scripts": path.resolve(rootDir, 'scripts'),
        ...Config.aliasConfig
    }
    config.module.rules = [{
        oneOf: [{
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]'
            },
        },
        {
            test: /\.js$/,
            include: paths(type).jsInclude,
            exclude: paths(type).jsExclude,
            use: [
                'cache-loader',
                {
                    loader: "babel-loader",
                    options: {
                        inputSourceMap: false,
                        sourceMap: false,
                        // compact: true,
                        presets: ['@babel/preset-env']
                    }
                }
            ],
        },
        {
            test: /\.(tsx|ts|js|jsx)$/,
            include: paths(type).src,
            loader: 'awesome-typescript-loader',
            options: {
                useCache: true,
                transpileOnly: true,
                errorsAsWarnings: true,
                // usePrecompiledFiles: true,
                sourceMap: false,
            }
        },
        {
            test: /\.(scss|css)$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../../'
                    }
                },
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        sourceMap: false,
                    },
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        // https://github.com/facebookincubator/create-react-app/issues/2677
                        ident: 'postcss',
                        sourceMap: false,
                        plugins: () => [
                            require('postcss-flexbugs-fixes'),
                            require('autoprefixer')
                        ],
                    },
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false,
                        javascriptEnabled: true,
                    },
                }
            ],
        },
        {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: 'file-loader',
            options: {
                name: 'static/media/[name].[hash:8].[ext]',
            },
        },
        ],
    }]
    return config
}
