const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        faq: "./src/script/index_faq.tsx",
        about: "./src/script/index_about.tsx",
        reg: "./src/script/index_reg.tsx"
    },
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "./script/[name].js",
        clean: true
    },
    resolve: {
        extensions : [".tsx", ".ts  ", ".jsx", ".js", ".json"]
    },
    devServer: {
        stats: {
            contentBase: path.resolve(__dirname, './src'), // нет эффекта
            assets: false,
            children: false,
            moduleAssets: false,
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "./styles/[name].css"
        }),
        new HtmlWebpackPlugin({
            filename: "faq.html",
            template: "./faq.html"
        }),
        new HtmlWebpackPlugin({
            filename: "about.html",
            template: "./about.html"
        }),
        new HtmlWebpackPlugin({
            filename: "reg.html",
            template: "./reg.html"
        }),
    ],
    module: {
        rules: [{
            test: /\.(scss)$/,
            exclude: "/node_modules",
            use: [{
                loader: MiniCssExtractPlugin.loader,
                options: { 
                    esModule: true,
                    // publicPath: path.resolve(__dirname, "./build/")
                },
                },
                "css-loader",
                "postcss-loader",
                {
                loader: "resolve-url-loader",
                options: {
                    sourceMap: true,
                }
                },
                {
                loader: "sass-loader",
                options: {
                    sourceMap: true,
                    implementation: require("sass")
                },
                
                }
            ]
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/,
            loader: "file-loader",
            // loader: "url-loader",
            options : {
                publicPath: path.resolve(__dirname, "./build/"),
                name: "[name].[ext]",
                outputPath: "./images",
                esModule: false
            }
            ,
            // type: 'asset/resource',
            // generator: {
            //     filename: './images/[hash][ext][query]'
            // }
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            loader: "file-loader",
            options: {
                name: "[name].[ext]",
                // publicPath: path.resolve(__dirname, "./fonts/"),
                publicPath: url => `../fonts/${url}`,
                outputPath: "./fonts/",
                esModule: false,
            }
        },
        {
            test: /\.(tsx|ts)$/,
            exclude: "/node_modules",
            // use: "eslint-loader"
            use: "awesome-typescript-loader"
        },
        {
            test: /\.(jsx|js)$/,
            exclude: "/node_modules",
            use: "babel-loader"
        }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            '...',
            new CssMinimizerPlugin(),
        ]
    }
};