const path = require('path');

module.exports = [
    {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.umd.js',
            library: 'MyLibrary', // Global variable name for UMD
            libraryTarget: 'umd',
            globalObject: 'this', // Important for browser and Node.js compatibility
        },
        mode: 'production',
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
    },
];