import Vue from 'vue';
import vSidebar from 'components/sidebar'
import vHeader from 'components/header'
import vDemo from './demo'
// 路由部分
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// 路由器需要一个根组件。
let App = Vue.extend();

// 创建一个路由器实例
let router = new VueRouter({
    hashbang: false
});

router.map({
    '/index':{
        name:'index',
        component: {
            template: '<div>hello world!<div>'
        }
    },
    '/demo': {
        name:'demo',
        component: vDemo
    },
});
//定义全局的重定向规则。全局的重定向会在匹配当前路径之前执行。
router.redirect({
    '*':"/index"
});

// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
router.start(App, '#app');

new Vue({
    el: 'body',
    components: {
        vSidebar: vSidebar,
        vHeader : vHeader
    }
});


