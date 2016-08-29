/**
 * 系统的公共配置
 */
let GE = window.GE || {};
// 超时时间
GE.timeOut = 60000;
// 菜单映射关系,后台的menuNum对应前台的路由
GE.menu = {
    //我的工作台
    '06': '#workplace',
    //数据开发--全局工作流
    '010201': '#workflow',
    //数据开发--数据交互
    '010202': '#ide',
    //数据开发--机器学习
    '010203': '#ml',
    //元数据--库表管理
    '010301': '#dbmanage',
    //元数据--数据血缘
    '010302': '#meta',
    //元数据--基础文件管理
    '010303': '#basefs',
    //运营管理--任务运行管理
    '010401': '#taskManage',
    //运营管理--监控
    '010402': '#monitor',
    //运营管理--诊断
    '010403': '#diagnosis',
    //运营管理--告警
    '010404': '#alerts',
    //运营管理--备份
    '010405': '#backup',
    //运营管理--上传文件管理
    '010406': '#file',
    //数据分析-自助报表
    '0201': '#report',

    '0202' : '#olap',
    //多维分析-可视化分析
    '020201' : '#olap/query',
    //多维分析-分析模型
    '020202' : '#olap/models',
    //多维分析-执行明细
    '020203' : '#olap/jobs',

    //系统管理-系统设置
    '0301': '#system',
    '0303' : '#overview',

    //系统管理-系统运维-组件部署
    '030201': '#stepindex',
    //系统管理-系统运维-资源管理
    '030202': '#resource',
    //系统管理-系统运维-访问管理
    '030203': '#accesscontrol',
    //组织项目-组织信息
    '0401': '#organization',
    //组织项目-项目管理
    '0402': '#project',
    //组织项目-用户管理
    '0403': '#usermanage'
};

//菜单栏的icon,节点id对应样式class
GE.iconClass = {
    //我的工作台
    '06' : 'gui-fi-person',
    //数据开发
    '0102' : 'gui-fi-chart-pie',
    //元数据
    '0103' : 'gui-fi-chart',
    //运营管理
    '0104' : 'gui-fi-toolbar',
    //自助报表
    '0201' : 'gui-fi-report',
    //多维分析
    '0202' : 'gui-fi-analysis',
    //组织管理
    '0301' : 'gui-fi-group',
    //项目管理
    '0302' : 'gui-fi-report-setting',
    //用户管理
    '0303' : 'gui-fi-person-setting',
    //系统设置
    '0401' : 'gui-fi-setting',
    //组件部署
    '0402' : 'gui-fi-deploy'
};

GE.API_PATH = '/api/';
/**
 * 接口配置
 */
let ajax = {
    /**
     * 全局
     */
    // 用户有权限的项目
    QUERY_CURRENT_PROJECTS: 'project/queryCurrentProjects',
    // 根据用户id请求函数?
    FIND_FUNCTION_BY_USER: 'function/findFunctionByUser',
    QUERY_USER_BY_PROJECT: 'project/queryUserByProject',

    /**
     * 工作流
     */
    // 获取任务模版功能模块，任务类型列表
    GET_TASK_TYPE_INFO: 'dataexploit/tasktype/all',
    // 获取任务信息
    GET_TASK_INFO: 'dataexploit/task/info',
    // 获取任务列表，支持不同的条件。支持分页
    GET_TASK_LIST: 'dataexploit/task/list',
    // 冻结任务，只有已发布的任务才能冻结，其实也就是停止任务。支持批量
    FREEZE_TASK: 'dataexploit/task/freeze',
    // 解冻任务，只有已冻结的任务才能解冻，其实也就是把已停止的任务重新运行。
    UN_FREEZE_TASK: 'dataexploit/task/unfreeze',
    // 保存工作流:支持创建工作流，更新工作流
    SAVE_WORKFLOW: 'dataexploit/flow/save',
    // 保存工作流概要信息
    SAVE_PRO_FILE: 'dataexploit/flow/saveprofile',
    // 删除工作流
    DELETE_WORKFLOW: 'dataexploit/flow/delete',
    // 获取工作流列表
    GET_WORKFLOW_LIST: 'dataexploit/flow/list',
    // 根据id获取某个工作流详细信息
    GET_WORKFLOW: 'dataexploit/flow/info',
    // 置顶工作流
    TOP_WORKFLOW: 'dataexploit/flow/top',
    // 取消置顶工作流
    CANCAL_TOP_WORKFLOW: 'dataexploit/flow/canceltop',
    // 复制画布
    COPY_CANVAS: 'dataexploit/flow/copy',
    // 新建任务、保存任务
    SAVE_TASK: 'dataexploit/task/save',
    // 运行任务
    RUN_TASK: 'dataexploit/task/deploy',
    // 获取server的列表
    GET_SERVER_LIST: 'dataexploit/server/list',
    // 新建server
    CREATE_SERVER: 'dataexploit/server/create',
    // 更新server
    UPDATE_SERVER: 'dataexploit/server/update',
    // 删除server
    DELETE_SERVER: 'dataexploit/server/delete',
    // 获取某个server详细信息
    GET_SERVER_INFO: 'dataexploit/server/info',
    // 获取上传文件的信息
    GET_FILE: 'files/findFiles',
    // 检查用户是否有工作流或者任务的权限
    CHECK_AUTH: 'dataexploit/authority/check',
    // 获取所有服务器类型
    GET_SERVER_TYPE_ALL: 'dataexploit/servertype/all',
    // 获取服务器属性
    GET_SERVER_PROPERTY: 'dataexploit/servertype/property'
};

// 增加前缀
let INTERFACE = {};
for(let key in ajax) {
    INTERFACE[key] = GE.API_PATH + ajax[key];
}

export {
    GE,
    INTERFACE
}
