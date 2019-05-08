const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [{ test: /\.ts$/, exclude: /node_modules/, loader: 'babel-loader' }]
    },
    output: {
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'JSONEnhancer',
        libraryExport: 'default',
        umdNamedDefine: true,
        globalObject: `(typeof self !== 'undefined' ? self : this)`,
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.ts', '.pegjs']
    }
};
