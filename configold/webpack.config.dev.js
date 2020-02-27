const paths = require("./paths");
const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rootDir = path.dirname(__dirname);
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const setTitle = require('node-bash-title');
const Config = require('./index')
/**
 * 重写 react-scripts 默认配置
 */
module.exports = (config, env, type) => {

    config.plugins.push()
    config.plugins.push()
    config.resolve.plugins.shift()
    config.resolve.alias = {
        "Common": path.resolve(rootDir, 'src', 'Common'),
        "src": path.resolve(rootDir, 'src'),
        "public": path.resolve(rootDir, 'public'),
        "scripts": path.resolve(rootDir, 'scripts'),
        ...Config.aliasConfig
    }


    cssloader = [{
            loader: 'css-loader',
            options: {
                importLoaders: 1,
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                // https://github.com/facebookincubator/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('autoprefixer')
                ],
            },
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: true,
                javascriptEnabled: true,
            },
        }
    ]
    config.module.rules = [{
        oneOf: [{
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[ext]',
                },
            },
            {
                test: /\.js$/,
                include: paths(type).appNodeModules,
                exclude: paths(type).jsExclude,
                use: [
                    'cache-loader',
                    {
                        loader: "babel-loader",
                        options: {
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
                    usePrecompiledFiles: true,
                    plugins: [
                        'react-hot-loader/babel',
                        ['@babel/plugin-proposal-decorators', {
                            "legacy": true
                        }]
                    ]
                }
            },
            {
                test: /\.(scss|css)$/,
                include: paths(type).src,
                use: [
                    'style-loader',
                    ...cssloader
                ],
            },
            {
                test: /\.(scss|css)$/,
                include: paths(type).appNodeModules,
                exclude: paths(type).src,
                use: [
                    MiniCssExtractPlugin.loader,
                    ...cssloader
                ],
            },
            {
                exclude: [/\.(js|ts|tsx|jsx|mjs)$/, /\.html$/, /\.json$/],
                loader: 'file-loader',
                options: {
                    name: 'static/media/[name].[ext]',
                },
            },
        ]
    }, ]
    return config
}
