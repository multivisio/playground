const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require("fs");

const pages=[];
const files = fs.readdirSync("./src/templates");
files.forEach((f)=>{
    f = f.split(".");
    f.pop();
    pages.push(f.join("."));
});

module.exports = {
    mode: 'development',
    entry: pages.reduce((config, page) => {
        config[page] = `./src/main.js`;
        return config;
    }, {}),

    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'Css/[name].css',
        }),
    ].concat(
        pages.map(
            (page) =>
                new HtmlWebpackPlugin({
                    inject: true,
                    template: `./src/templates/${page}.html`,
                    filename: `${page}.html`,
                    chunks: [page],
                })
        )
    ),
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
        ignored: /node_modules/,
    },
    module: {
        rules: [
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.(png|gif|jpe?g|svg)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8192,
                    },
                },
                generator: {
                    filename: 'Images/[name][ext]',
                },
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8192,
                    },
                },
                generator: {
                    filename: 'Fonts/[name][ext]',
                },
            },
        ],
    },
};