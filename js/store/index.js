import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';
const store = new Vuex.Store({
    state: {
        hmLoad: {
            status: 0
        },
        hmToast: {
            msg: "",
            timer: null,
            status: 0
        },
        hmPhoto: {
            isShow: false,
            type: 1, // 1驾驶证照片，2用户头像
        },
        userInfo: {
            name: "",   // 司机姓名
            license: "", // 驾驶证号
            cmp_id: "", // 公司名称id-司机注册成功后
            cmp_name: "", // 公司名称-司机注册成功后
            license_photo: "", // 驾驶证照片
            avatar: "", // 用户头像
            mobile: ""  // 用户手机
        },
        deviceInfo: {
            deviceMac: "", // 设备Mac
            deviceSN: "", // 设备SN
            all: "", // 连接wifi总人数
            now: "", // 当前连接wifi人数
            gpsList: [],    // 行驶轨迹
            timer: null     // 设备刷新时间控制器
        },
        carInfo: {
            plate_num: "", // 车牌号
            plate_num2: "", // 车牌号,用户可修改
            cmp_id: "",    // 车辆公司id
            cmp_name: "",  // 车辆公司名字
            mdriving_license_img: "",   // 驾驶证
            drive_time: ""  // 驾驶时间
        },
        driverBg: 3,
        driverTransition: {
            name: "",
            mode: ""
        }
    },
    // getters,
    actions,
    mutations,
    strict: debug
});

if(module.hot){
    module.hot.accept([
        // './getters',
        './actions',
        './mutations'
    ], () => {
        store.hotUpdate({
            // getters: require('./getters').default,
            actions: require('./actions').default,
            mutations: require('./mutations').default
        });
    });
}

export default store;