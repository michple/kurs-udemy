const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')

const postCSSPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-hexrgba'),
    require('autoprefixer'),
    require('cssnano') //kompresja css
]
class RunAfterCompile {
    apply(compiler) {
        compiler.hooks.done.tap('copy Images', function() {
            fse.copySync('./app/assets/images', './docs/assets/images')
        })
    }
}
// new HtmlWebpackPlugin({ // stworzenie wyściowego htmla razem z importami plików w folderze dist
//        filename:'index.html',
//        template:'./app/index.html'
//    }),

let pages = fse.readdirSync('./app').filter(function(file) {
    return file.endsWith('.html')
}).map(function(page) {
    return new HtmlWebpackPlugin({
        filename: page,
        template: `./app/${page}`
    })
});
pages.push(new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ // wyciągnięcie css z js
        filename: 'style.[chunkhash].css'
    }),
    new RunAfterCompile())

module.exports = {

    entry: './app/assets/scripts/app.js',

    output: {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'docs')
    },
    optimization: {
        splitChunks: { chunks: 'all' }
    },
    plugins: pages,
    mode: 'production',
    module: {
        rules: [{
            test: /\.css$/i,
            use: [
                MiniCssExtractPlugin.loader, 'css-loader?url=false', { loader: "postcss-loader", options: { postcssOptions: { plugins: postCSSPlugins } } }
            ]
        }, {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },

}
// module.rules.push({
//     test: /\.js$/,
//     exclude: /(node_modules)/,
//     use: {
//         loader: 'babel-loader',
//         options: {
//             presets: ['@babel/preset-env']
//         }
//     }
// })

// devServer:{ //ustawienie autoodświeżania
//     historyApiFallback: true,
//     compress: true,
//     before: function(app,server) {
//         server._watch('./app/**/*.html')
//     },
//     contentBase: path.join(__dirname,'app'), // jaki folder ma być sprawdzany
//     hot:true,
//     port:3000,
//     host: '192.168.0.103' // widoczność strony w sieci lan
// },
/*
{loader: 'postcss-loader', options: {plugins: postCSSPlugins}}

Must now be this instead:

{loader: "postcss-loader", options: {postcssOptions: {plugins: postCSSPlugins}}}
*/