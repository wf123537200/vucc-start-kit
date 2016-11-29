import Vue from 'vue';
import VueRouter from 'vue-router';

// 当前页面路由配置
Vue.use(VueRouter);

const routes = [
    {
        path: '/demo',
        component: resolve => require(['./list/demo'], resolve)
    }, {
        path: '/',
        component: resolve => require(['./list/demo'], resolve)
    }
];

// 创建一个路由器实例
const router = new VueRouter({
    routes
});

// 路由器会创建一个 App 实例，并且挂载到匹配的元素上。
const app = new Vue({
    router
}).$mount('#app');

