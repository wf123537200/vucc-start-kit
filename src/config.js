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

// 增加前缀
let INTERFACE = {};
for(let key in ajax) {
    INTERFACE[key] = conf.API_PATH + ajax[key];
}

export {
    conf,
    INTERFACE
}
