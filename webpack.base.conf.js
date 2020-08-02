module.exports = {
    module: {
        rules: [{
            //增加less配置支持
            test: /\.less$/,
            loader: "style-loader!css-loader!less-loader",
        }]
    }
}