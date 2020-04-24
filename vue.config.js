module.exports = {
    lintOnSave: false,
    devServer: {
        host: 'localhost',
        port: '8080',
        https: false,
        open: true,
        proxy: {
            '/admin': {
                target: 'http://ceshi5.dishait.cn/admin/',
                ws: true, //proxy websockets
                changeOrigin: true,
                pathRewrite: {
                    '^/admin': ''
                }
            },
        }
    }
}