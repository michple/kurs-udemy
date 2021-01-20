const path = require('path')

const postCSSPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-hexrgba'),
    require('autoprefixer')
]

module.exports = {

    entry: './app/assets/scripts/app.js',
    output: {
        filename: 'bundled.js',
        path: path.resolve(__dirname, 'app')
    },
    devServer: { //ustawienie autoodświeżania
        historyApiFallback: true,
        compress: true,
        before: function(app, server) {
            server._watch('./app/**/*.html')
        },
        contentBase: path.join(__dirname, 'app'), // jaki folder ma być sprawdzany
        hot: true,
        port: 3000,
        host: '192.168.0.103' // widoczność strony w sieci lan
    },

    mode: 'development',
    module: {
        rules: [{
            test: /\.css$/i,
            use: [
                'style-loader', 'css-loader?url=false', { loader: "postcss-loader", options: { postcssOptions: { plugins: postCSSPlugins } } }
            ]
        }]
    },

}

/*
{loader: 'postcss-loader', options: {plugins: postCSSPlugins}}

Must now be this instead:

{loader: "postcss-loader", options: {postcssOptions: {plugins: postCSSPlugins}}}
*/