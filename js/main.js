import Vue from 'vue';
import VueResource from "vue-resource";

import store from './store';
import router from './router';
import App from './App';

import {callN} from 'nativeA';
// import Mint from 'mint-ui';
// import 'style-loader!css-loader!mint-ui/lib/style.css';

import {isAndroid,dataFormat} from 'method';
Vue.use(VueResource);
// Vue.use(Mint);

Vue.filter('yearMonth',time=>dataFormat(time,'YYYY年MM月'));
Vue.filter('timeFormat',str=>str?dataFormat((str*1000),'YYYY-MM-dd hh:mm:ss'):'');

Vue.filter('repairNum',str=>str?str.slice(0,-4):'');
Vue.filter('descFormat',str=>{
    str=typeof (str)=='string'?JSON.parse( str ):str;
    let msgArr=[];
    if(!str.plate_num){
        msgArr.push('车辆信息未读取');
    }
    if(!str.plate_sn){
        msgArr.push('设备信息未读取');
    }
    // 设备字符可能是小写ok,设备返回可能带有前后空格的ok
    if(str.WIFI && str.WIFI.toString().trim().toUpperCase()!="OK"){
        msgArr.push('wifi功能检测错误');
    }
    if(str.Portal && str.Portal.toString().trim().toUpperCase()!="OK"){
        msgArr.push('Portal功能检测错误');
    }
    if(str.Compass && str.Compass.toString().trim().toUpperCase()!="OK"){
        msgArr.push('北斗定位功能检测错误');
    }
    if(str["4G"] && str['4G'].toString().trim().toUpperCase()!="OK"){
        msgArr.push('设备4G功能检测错误');
    }
    return String(msgArr);
});

router.beforeEach((to, from, next) => {
    var aIndex = ["/driver","/driver/home","/driver/home"];

    var index = aIndex.indexOf(to.path);
    var bg=index==-1?3:index+1;
    store.commit("changeBg",bg);

    /*
    if (index==-1 && from.path !="/") {
        store.commit("changeTransition",{
            name: "slide-fade"
        });
    }else{
        store.commit("changeTransition",{
            name: ""
        });
    }
    */

    next();
});

var appVue = new Vue({
    el: "#app",
    router,
    store,
    render: h=>h(App)
});


window.nativeCallback = function (type,param){
    if (isAndroid) {
        param = param?JSON.parse(param):{};
    }
    switch(type){
        case "upFile":
            appVue.$store.dispatch("nativeSetPhoto",param);
            appVue.$store.commit("hidePhoto");
            break;
        case "refresh":
            console.log('已移除');
            break;
        case "setDriveTime": 
            appVue.$store.commit("nativeSetDrive_time",param.drive_time);
            break;
        case "setDriveLine":
            appVue.$store.commit("setGpsList",param);
            break;
        case "showLoad": 
            appVue.$store.commit("showLoad",param.type);
            break;
        case "hideLoad":
            appVue.$store.commit("hideLoad");
            break;
        case "toast": 
            appVue.$store.dispatch("toast",param); 
            break;
        case "showToast":   
            appVue.$store.commit("showToast",param);
            break;
        case "hideToast":   
            appVue.$store.commit("hideToast");
            break;  
        case "hotUpdate": 
            appVue.$store.dispatch("setUserInfoAsync");
            appVue.$store.dispatch("setUserCar");
            appVue.$store.dispatch("setDeviceUsersAsync");
            callN('getDriveLine');
            callN('getDriveTime');
            break;
        default: 
            console.log(`没有找到${type}方法，请确保H5有此回调方法`);
            break;
    }
};