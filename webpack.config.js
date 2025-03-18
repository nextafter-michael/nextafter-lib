const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = () => {
    const env = dotenv.config().parsed;
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});

    return [
        {
            entry: './src/index.js',
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: 'index.umd.js',
                library: env.LIBRARY_NAME,
                libraryTarget: 'umd',
                globalObject: 'this',
            },
            mode: 'production',
            plugins: [ new webpack.DefinePlugin(envKeys) ],
        },
        {
            entry: './src/index.js',
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: 'index.esm.js',
                libraryTarget: 'module',
            },
            mode: 'production',
            experiments: {
                outputModule: true,
            },
            plugins: [ new webpack.DefinePlugin(envKeys) ],
        },
    ];
};
