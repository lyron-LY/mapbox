const path = require('path');
const chalk = require("chalk");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({
    size: require('os').cpus().length
});
const isProd = process.env.NODE_ENV === "production";

module.exports = {
    //基本路径
    publicPath: './',
    //输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: 'static',
    //以多页模式构建应用程序。
    pages: undefined,
    //是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: true,
    //是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
    parallel: require('os').cpus().length > 1,
    //生产环境是否生成 sourceMap 文件，一般情况不建议打开
    productionSourceMap: true,
    // webpack配置
    //对内部的 webpack 配置进行更细粒度的修改 https://github.com/neutrinojs/webpack-chain see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: config => {

        // 以便支持 @component({ template: require("./index.html") }) 这种模版加载方式
        // 注意：写include和exclude要在use和loader之前写
        config.module.rule('html').test(/\.html$/).exclude.add(/public/).end().use('raw-loader').loader('happypack/loader?id=html');

        // 只输出src下ts文件错误
        config.plugin('fork-ts-checker').tap(args => {
            args[0].reportFiles = ['src/**/*.{ts,tsx}'];
            return args;
        });

        config.resolve.alias
            .set('@', path.join(__dirname, 'src'))

        // 修改插件配置
        config.plugin('html').tap(args => {
            return args.map(item => {
                item.title = "mapbox";
                item.minify = {
                    removeComments: true,
                    collapseWhitespace: false,
                    removeAttributeQuotes: false
                };
                return item;
            });
        });
        //关闭 webpack 的性能提示
        // config.performance.set('hints', false);
    },
    //调整 webpack 配置 https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
    configureWebpack: config => {
        let pluginsCom = [
            new HappyPack({
                id: 'html',
                threadPool: happyThreadPool,
                loaders: ['raw-loader']
            }),
        ];

        // 生产&测试环境
        let pluginsProd = [
            new ProgressBarPlugin({
                format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
                clear: false
            }),
        ];

        // 开发环境
        let pluginsDev = [
            new HardSourceWebpackPlugin({
                cachePrune: {
                    // Caches younger than `maxAge` are not considered for deletion. They must
                    // be at least this (default: 2 days) old in milliseconds.
                    maxAge: 2 * 24 * 60 * 60 * 1000,
                },
            }),
        ];

        if (isProd) {
            // 为生产环境修改配置
            config.plugins = [...config.plugins, ...pluginsCom, ...pluginsProd];
        } else {
            // 为开发环境修改配置...
            config.plugins = [...config.plugins, ...pluginsCom, ...pluginsDev];
        }
    },
    css: {
        // 启用 CSS modules
        requireModuleExtension: true,
        // 是否使用css分离插件
        extract: isProd,
        // 开启 CSS source maps，一般不建议开启
        sourceMap: !isProd,
        // css预设器配置项
        loaderOptions: {
            sass: {
                //设置css中引用文件的路径，引入通用使用的scss文件（如包含的@mixin）
                prependData: `
				$baseUrl: "/";
                @import '@/assets/styles/common/_var.scss';
                @import '@/assets/styles/common/_mixin.scss';
				`
            }
        }
    },
    // webpack-dev-server 相关配置 https://webpack.js.org/configuration/dev-server/
    devServer: {
        host: "0.0.0.0",
        port: 8000, // 端口号
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器 
        hot: true // 热更新
        // proxy: "http://192.168.101.40:8044"   // 配置跨域处理,只有一个代理
    },

    // 第三方插件配置 https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader
    pluginOptions: {
    }
};