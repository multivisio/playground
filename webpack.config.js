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
        filename: 'JavaScript/[name].js',
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
                    inject: 'body',
                    minify: false,
                    template: `./src/templates/${page}.html`,
                    filename: `${page}.html`,
                    title: page.charAt(0).toUpperCase() + page.slice(1),
                    meta: {
                        "metaCharset": {'charset': 'UTF-8'},
                        'viewport': 'width=device-width, initial-scale=1'
                    },
                    //chunks: [page],
                    xhtml: true,
                })
        )
    ),
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
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'Fonts/'
                        }
                    }
                ]
            },
        ],
    },
};