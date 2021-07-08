
const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    chainWebpack: (config) => {
        config.resolve.alias
            .set("@", resolve("/src"));
        config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js');

    },
    devServer: {
        open: false,      // 是否打开浏览器;

        https: false,
        overlay: {
            warnings: false,
            errors: true
        },
        //以上的ip和端口是我们本机的;下面为需要跨域的   
        //由于camunda比较奇葩,所以由proxy跳转监听到nginx, nginx端口为8081,nginx的监听跳转到8080端口
        proxy: {//配置跨域
            '/camunda': {
                // nginx 反向代理，端口为nginx端口
                target: 'http://localhost:8888',//这里后台的地址模拟的;应该填写你们真实的后台接口
                ws: false, // 是否启用  websockets;
                changOrigin: true,//开启代理,允许跨域
                pathRewrite: {
                    '^/camunda': ''//请求的时候使用这个api就可以
                }
            }
        }
    }

};