const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { dir, assert } = require('console');
const { cache } = require('webpack');
const getMultiEntry = (param) => {
    const entry = {};
    const HtmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/pages/*/index.js'));
    entryFiles.forEach((entryFile) => {
        const pageName = entryFile.match(/src\/pages\/(.*)\/index\.js/)[1];
        entry[pageName] = (param && param.files) ? param.files.slice() : [];
        entry[pageName].push(entryFile);
        entry[pageName].push(`./src/pages/${pageName}/index.css`)
        entry[pageName].push(`./src/pages/${pageName}/index.js`)
        HtmlWebpackPlugins.push(new HtmlWebpackPlugin({
            template: `./src/pages/${pageName}/index.html`,
            filename: `${pageName}.html`,
            chunks: [pageName], // 将该chunks的文件注入到html中
            minify: true,
            inject: 'body',
        }));
    });
    return {entry, HtmlWebpackPlugins};
}

const {entry, HtmlWebpackPlugins} = getMultiEntry({
    files:[
        // 需要打包在一起的文件
        './src/assets/css/common.css',
    ]
});

module.exports = {
    entry,
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        devMiddleware: {
            writeToDisk: true,
        },
        compress:true,
        port:3000,
        hot:true,
        open:false
    },
    output: {
        filename: 'script/[contenthash]_bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true,
        assetModuleFilename: 'assets/[contenthash][ext]',
    },
    module: {
        rules: [
            // 处理html
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            // 处理css
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            // 处理图片
            {
                test: /\.(png|svg|jpe?g|gif|ttf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name].[contenthash][ext][query]',
                },
            }
        ]
    },
    plugins: [
        ...HtmlWebpackPlugins,
        new MiniCssExtractPlugin({filename: 'styles/[contenthash].css'}),
        new MonacoWebpackPlugin({
            languages: ['javascript','typescript','css','html','json'],
            features: ['coreCommands','find','suggest'],
            publicPath: '/',
            filename: 'monaco-editor/[name].worker.js',
        })
    ],
    optimization:{
        splitChunks: {
            chunks:'all',
            minSize: 20000,
            maxSize: 100000,
            minChunks: 1,
            maxAsyncRequests: 20,
            maxInitialRequests: 20,
            automaticNameDelimiter: '~',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@img': path.resolve(__dirname, 'src/assets/images'),
            '@css': path.resolve(__dirname, 'src/assets/css'),
            '@js': path.resolve(__dirname, 'src/assets/js'),
            '@modules': path.resolve(__dirname, 'node_modules'),
        },
        extensions: ['.js', '.json'],
    },
}