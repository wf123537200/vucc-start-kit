/**
 * 系统的公共配置
 */
let conf = window.conf || {};

conf.API_PATH = '/api/';
/**
 * 接口配置
 */
let ajax = {
    /**
     * 全局
     */
    // 用户有权限的项目
    GLOBAL_XX: 'xx',

    /**
     * 功能模块 xx
     */
    // 获取任务模版功能模块，任务类型列表
    MODULE_XX: 'xx',
};

// 增加前缀,应对接口有一样的前缀时可以使用,类似例子中的'/api/'
let INTERFACE = {};
for(let key in ajax) {
    INTERFACE[key] = conf.API_PATH + ajax[key];
}

export {
    conf,
    INTERFACE
}
