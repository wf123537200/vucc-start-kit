import VueRouter from 'vue-router';
import Vue from 'vue';
import vHeader from 'components/header'
import vSidebar from 'components/sidebar'

let isInit = true;

// 生产环境去掉警告
Vue.config.silent = !/localhost/i.test(location.href);
// 当前页面路由配置
Vue.use(VueRouter);

// 路由器需要一个根组件。
let App = Vue.extend({});

// 创建一个路由器实例
const router = new VueRouter({
    hashbang: false
});

// 对外暴露router实例,可能会使用到
window.__vueRouter = router;

// 路由map
const routerMap = {
    '/demo': {
        component: function (done) {
            require(['./list/demo'], done)
        }
    },
    '/': {
        component: function (done) {
            require(['./list/demo'], done)
        }
    }
};

// 用于配置一些路由的特殊映射需求,主要用于加载common.js
const commonjsMap = {
    // 这里会将 /addproject/** 匹配到的路由加载/project目录下config.json配置打包出来的common.js
    demo: '/list',
};

// 预处理函数
window.__vueRouter.beforeEach(function ({to, next}) {
    let path = to.path;

    if(path.indexOf('?') > 0) {
        path = path.substr(0, path.indexOf('?'))
    }
    var action = path.match(/(\S+)/)[1];
    console.log(action + ' is loading...');

    let isInVue = false;
    for(let key in routerMap) {
        if(action.indexOf(routerMap[key].path.replace(/\/[\:\*]\w*/, '')) >= 0) isInVue = true;
    }

    // 判断是不是routerMap中配置的路径,如果不是配置路径,可以跳转出去
    if(!isInVue) {
        console.log('we will going 2 ' + location.host + '#' + action);
        // 跳转地址自定义
        window.location.href = 'http://' + location.host + '/index.html#' + action;
        return;
    }

    // action 映射处理
    const actionArray = action.match(/([a-zA-Z]+)(?=(?:\/))/g);
    const mapName = actionArray ? actionArray[0] : '';

    action = mapName && commonjsMap[mapName] ? commonjsMap[mapName] : action;

    // 公用脚本加入
    var commonScript = document.createElement('script');
    commonScript.src = window.__env + '/dist' + action + '/common.js';

    commonScript.onerror = commonScript.onload = function () {
        if(isInit) {
            new Vue({
                el: 'body',
                components: {
                    vSidebar,
                    vHeader
                }
            });

            isInit = false;
        }

        next();
    };

    document.body.appendChild(commonScript);
});

router.map(routerMap);

// 路由器会创建一个 App 实例，并且挂载到匹配的元素上。
router.start(App, '#app');
