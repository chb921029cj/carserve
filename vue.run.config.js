let modules = [{
    index: 0,
    title: "权益用户",
    entryPath: "carServe"
}];

let config = module => {
    return {
        entry: "src/" + module.entryPath + "/main.js",
        filename: "index.html",
        title: module.title
    };
};

// 此处修改维护的功能模块
let currModule = modules[0];

module.exports = {
    modulePath: currModule.entryPath,
    index: config(currModule)
};