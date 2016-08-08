const path = require('path');
const webpack = require('webpack');

const PATHS = {
    images: (__dirname, 'app/assets/img'),
    style: [
        path.join(__dirname, 'node_modules/bootstrap/dist/css/', 'bootstrap.min.css'),
        path.join(__dirname, 'client/assets/css/', 'main.css'),
        path.join(__dirname, 'client/assets/css/', 'cart.css'),
        path.join(__dirname, 'client/assets/css/', 'best-sellers.css')
    ]
};

const config = {
    entry: ["./app.js"],
    output: {
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'jshint-loader'

            }
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'] 
                }
            },
             //CSS
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
                include: PATHS.style
            },

            // Fonts
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader'
            },

            // Images
            {
                test: /\.(jpg|png)$/,
                loader: 'file?name=[path][name].[hash].[ext]',
                include: PATHS.images
            }
        ]
    },
    watch: true,
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: [
          'node_modules'
        ]  
    },
    devtool: 'eval-source-map',
    devServer: {
        historyApiFallback: true,

        hot: true,
        inline: true,

        status: 'normal',

        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 4000,

        proxy: {
            '/api/*': {
                target: 'http://localhost:9000/',
                secure: false
            }
        }
    }
};

module.exports = config;