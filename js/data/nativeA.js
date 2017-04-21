import {isIos, isAndroid, dataFormat} from "method";

var isTest = !/(iOSApp|AndroidApp)\/wangfanDriver\s+(\d\.?)+/i.test(window.navigator.userAgent);
const isWarn = true; // 是否开启测试警告

const TESTUID = 1; // 测试uID
const TESTUNIONID = ''; // 测试集团uid
const TESTTOKEN = '65e1866dbbddfc987268ab1b2e30b8b8'; // 测试token
const TESTHOST = 'http://localhost:8081'; // host地址
const TESTTEL = 13000000000; // 测试手机号
const PLATFORM = isAndroid?'Android':'ios'; // 测试型号

if (!isTest && typeof window.DriverApp === "undefined") {
    isWarn && console && console.error('没有在客户端找到window.DriverApp这个对象');
}

if (isTest) {
    isWarn && console.warn('正在使用本地测试数据');

    window.DriverApp = {
        getNativeParam(flag){
            switch(flag){
                case "baseInfo":    
                    isWarn && console.warn("获取用户基本信息");
                    return {
                        "host": TESTHOST,
                        "token": TESTTOKEN,
                        "uid": TESTUID,
                        "union_id": TESTUNIONID,
                        "tel": TESTTEL
                    }
                    break;
                case "getDriveLine":  // 移除
                    isWarn && console.warn("获取行驶轨迹");
                    return {
                        "lat": 37,
                        "lng": 127,
                        "time": Date.now()
                    }
                    break;
                case "getAutoCheckNumber":
                    isWarn && console.warn("获取设备自检单号");
                    return {
                        "callbackId": 1,
                        "number": "",
                        "isChecked":1,//是否经过自检 1-是 0-否
                        "plate_sn":"HMAPA01160700537",
                        "dtime":1492600167612
                    }
                    break;
                case "getSystemMsg": // 移除
                    isWarn && console.warn("获取个人中心的消息列表");
                    return [
                        {
                            "id": 1,
                            "title": "标题",
                            "content": "内容",
                            "status": 0,
                            "time": Date.now()
                        },
                        {
                            "id": 2,
                            "title": "标题",
                            "content": "内容",
                            "status": 1,
                            "time": Date.now()-12*3600*1000
                        }
                    ]
                    break;
                case "getCache":
                    isWarn && console.warn("获取缓存数据大小");
                    return {
                        "size": "1.23M"
                    }
                    break;
                case "wifi":
                    isWarn && console.warn("获取网络状态");
                    return {
                        "open": 0,
                        "wangfan":1,
                    }
                    break;
                default:
                    isWarn && console.warn(`没有找到flag:${flag},请确保有${flag}的测试数据`);
                    break;
            }
        },
        callNative(flag,param){
            switch(flag){
                case "cleanCache":
                    isWarn && console.warn("清除本地缓存",param);
                    break;
                case "updateApp":
                    isWarn && console.warn("版本更新",param);
                    break;
                case "signOut":
                    isWarn && console.warn("用户注销",param);
                    break;
                case "autoCheckIn":
                    isWarn && console.warn("告知客户端自动签到",param);
                    break;
                case "sendCheckNumber":
                    isWarn && console.warn("提交设备H5自动检测单号",param);
                    break;
                case "msg":
                    isWarn && console.warn("弹窗",param);
                    break;
                case "back":
                    isWarn && console.warn("返回",param);
                    break;
                default:
                    isWarn && console.warn(`没有找到flag:${flag},请确保有${flag}的测试数据`,param);
                    break;
            }
        }
    }
}


function getN(flag){
    if (isIos || isTest) {
        return window.DriverApp.getNativeParam(flag);
    }else{
        var a = window.DriverApp.getNativeParam(flag);
        return a?JSON.parse(a):'';
    }
}
function callN(flag,param){
    param = param?param:{};
    param.callbackId = flag;
    if(isIos || isTest){
        return window.DriverApp.callNative(flag,param);
    }else{
        return window.DriverApp.callNative(flag,JSON.stringify(param));
    }
}

export {
    getN,
    callN
};