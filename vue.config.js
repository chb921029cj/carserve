// 运行配置 -模块开发路径管理
const runConfig = require("./vue.run.config");
// 引入node模块
const path = require("path");
// 引入雪碧图插件
const SpritesmithPlugin = require("webpack-spritesmith");
const webpack = require("webpack");
// 雪碧图自定义模板
var templateFun = function (data) {
    if (data.sprites.length > 0) {
        var shared = ".icon { background-image: url(I); background-size: Wpx Hpx;}"
            .replace("I", data.sprites[0].image)
            .replace("W", data.spritesheet.width)
            .replace("H", data.spritesheet.height);
        var perSprite = data.sprites
            .map(function (sprite) {
                return ".icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }"
                    .replace("N", sprite.name)
                    .replace("W", sprite.width)
                    .replace("H", sprite.height)
                    .replace("X", sprite.offset_x)
                    .replace("Y", sprite.offset_y);
            })
            .join("\n");
        return shared + "\n" + perSprite;
    } else {
        return "";
    }
};

module.exports = {
    lintOnSave: false,
    publicPath: "./", //修改为相对路径，解决静态资源文件打开问题
    productionSourceMap: false, //去除build后的.map文件
    outputDir: "../ElecMobilePlat20150113/assets/project/" + runConfig.modulePath, //修改build文件输出地址
    devServer: {
        open: true,
        proxy: {
            "/metrology-service": {
                target: "http://101.132.174.86:8081",
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/metrology-service": ""
                }
            },
            "/tgmanage-center": {
                target: "http://20.46.109.107:10003",
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/tgmanage-center": ""
                }
            },
            "/wfw2-service": {
                target: "http://26.47.129.198:8088",
                // target: "http://26.47.130.72:10003",
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/wfw2-service": ""
                }
            },
            "/ftf/mobileInterface": {
                target: "http://10.134.78.169:5100",
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/ftf/mobileInterface": ""
                }
            }
        }
    },
    pages: {
        index: runConfig.index
    },
    configureWebpack: config => {
        config.externals = {
            'AMap': 'AMap',
            'AMapUI': 'AMapUI',
            // 'QRCode':'QRCode'
        }
        config.resolve.modules = [
            "node_modules",
            "./src/" + runConfig.modulePath + "/assets/images"
        ];
        const Plugins = [
            new SpritesmithPlugin({
                src: {
                    cwd: path.resolve(
                        __dirname,
                        "./src/" + runConfig.modulePath + "/assets/img"
                    ),
                    glob: "*.png"
                },
                target: {
                    image: path.resolve(
                        __dirname,
                        "./src/" + runConfig.modulePath + "/assets/images/sprite.png"
                    ),
                    css: [
                        [
                            path.resolve(
                                __dirname,
                                "./src/" + runConfig.modulePath + "/assets/css/sprite.scss"
                            ),
                            {
                                format: "function_based_template"
                            }
                        ]
                    ]
                },
                customTemplates: {
                    function_based_template: templateFun
                },
                apiOptions: {
                    cssImageRef: "~sprite.png"
                },
                spritesmithOptions: {
                    padding: 20
                }
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    VUE_ENV: JSON.stringify(process.env.VUE_ENV)
                }
            })
        ];
        config.plugins = [...config.plugins, ...Plugins];
    }
};