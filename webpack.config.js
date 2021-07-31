const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    // Set debugging source maps to be "inline" for
    // simplicity and ease of use
    devtool: "inline-source-map",

    // The application entry point
    entry: "./src/index.tsx",

    target: "web",

    // Where to compile the bundle
    // By default the output directory is `dist`
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "build"),
        clean: true
    },

    devServer: {
        contentBase: './dist'
    },

    // Supported file loaders
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                use: {
                    loader: "babel-loader",
                },
                exclude: /node_modules/,
            },
            // {
            //     test: /\.css$/i,
            //     use: ['style-loader', 'css-loader'],
            // },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
        }),
    ],

    // File extensions to support resolving
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
};
