import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);


// 首页、车辆、我的
const driver = require('./views/index.vue');
const driverHome = require('./views/driver.vue');
const car = require('./views/car.vue');
const home = require('./views/home.vue');


// 帮助、关于我们
const help = r => require.ensure([], () => r(require('./views/help.vue')), 'group-say');
const aboutUs = r => require.ensure([], () => r(require('./views/aboutUs.vue')), 'group-say');

// 签到
const checkIn = resolve => require(['./views/checkIn.vue'], resolve);
// 审核信息
const credentials = resolve => require(['./views/credentials.vue'], resolve);
// 车辆详情
const carDetail = resolve => require(['./views/carDetail.vue'], resolve);
// 设备自检
const deviceCheck = resolve => require(['./views/deviceCheck.vue'], resolve);
// 我的保修
const myRepairs = resolve => require(['./views/myRepairs.vue'], resolve);
// 人工保修
const manRepair = resolve => require(['./views/manRepair.vue'], resolve);
// 设置
const settings = resolve => require(['./views/settings.vue'], resolve);
// 消息列表
const sysMsg = resolve => require(['./views/sysMsg.vue'], resolve);
// 消息详情
const msgDetail = resolve => require(['./views/msgDetail.vue'], resolve);
// 个人信息
const myInfo = resolve => require(['./views/myInfo.vue'], resolve);

const test = resolve => require(['./views/test.vue'],resolve);

const routes = [
    {
        path: '/',
        redirect: '/driver'
    },
    {
        path: '/driver',
        component: driver,
        meta: {
            keepAlive: true
        },
        children: [
            { path: '', component: driverHome },
            { path: 'car', component: car },
            { path: 'home', component: home }
        ]
    },
    {
        path: '/checkIn',
        name: 'checkIn',
        component: checkIn,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/help',
        name: 'help',
        component: help,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/aboutUs',
        name: 'aboutUs',
        component: aboutUs,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/carDetail',
        name: 'carDetail',
        component: carDetail,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/deviceCheck',
        name: 'deviceCheck',
        component: deviceCheck,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/myinfo',
        name: 'myInfo',
        component: myInfo,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/settings',
        name: 'settings',
        component: settings,
        meta: {
            keepAlive: false
        }
    },
    {
        path: '/myRepairs',
        name: 'myRepairs',
        component: myRepairs,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/manRepair',
        name: 'manRepair',
        component: manRepair,
        meta: {
            keepAlive: false
        }
    },
    {
        path: '/sysMsg',
        name: 'sysMsg',
        component: sysMsg,
        meta: {
            keepAlive: false
        }
    },
    {
        path: '/msgDetail/:id?',
        name: 'msgDetail',
        component: msgDetail,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/credentials',
        name: 'credentials',
        component: credentials,
        meta: {
            keepAlive: false
        }
    },
    {
        path: '/test',
        name: 'test',
        component: test,
        meta: {
            keepAlive: true
        }
    }
];


export default new Router({
    routes
});