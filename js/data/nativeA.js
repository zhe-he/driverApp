import {isIos, isAndroid} from "method";

var isTest = !/(iOSApp|AndroidApp)\/wangfanDriver\s+(\d\.?)+/i.test(window.navigator.userAgent);
const isWarn = true; // 是否开启测试警告

const TESTUID = 2; // 测试uID
const TESTUNIONID = ''; // 测试集团uid
const TESTTOKEN = ''; // 测试token
const TESTACCESSTOKEN = '65e1866dbbddfc987268ab1b2e30b8b8'; // 测试token
// const TESTHOST = 'http://10.10.39.66:8083'; // 测试host地址
const TESTHOST = 'http://api.9797168.com'; // 线上
const TESTTEL = 13000000000; // 测试手机号
const PLATFORM = isAndroid?'Android':'ios'; // 测试型号

if (!isTest && typeof window.App === "undefined") {
    isWarn && console && console.error('没有在客户端找到window.App这个对象');
}
if (isTest) {
    isWarn && console.warn('正在使用本地测试数据');

    window.App = {
        getNativeParam(flag){
            switch(flag){
                case "getBase":    
                    isWarn && console.warn("获取用户基本信息");
                    return {
                        "host": TESTHOST,
                        "token": TESTTOKEN,
                        "access_token": TESTACCESSTOKEN,
                        "uid": TESTUID,
                        "userID": TESTUNIONID,
                        "tel": TESTTEL,
                        "platfrom": PLATFORM
                    }
                    break;
                case "getDriveLine":  
                    isWarn && console.warn("获取行驶轨迹");
                    return [{
                        "lng": 116.575552,
                        "lat": 40.096255,
                        "time": Date.now()
                    },{
                        "lng": 116.57636,
                        "lat": 40.087981,
                        "time": Date.now()
                    }]
                    break;
                case "getAutoCheckNumber":
                    isWarn && console.warn("获取设备自检单号");
                    return {
                        "callbackId": 1,
                        "number": "201705021516166846",
                        // "number": "",
                        "isChecked":1,//是否经过自检 1-是 0-否
                        "plate_sn":"HMAPA01160700537",
                        // "plate_sn":"6024694",
                        "ctime":1492600167
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
                isWarn && console.warn("获取wifi状态");
                    return {
                        "open":     1,  
                        "wangfan":  1,
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
                case "close":
                    isWarn && console.warn("关闭",param);
                    break;
                case "upFile":
                    isWarn && console.warn("调用客户端上传图片",param);
                    setTimeout(()=>{
                        window.nativeCallback("upFile",{"link": "http://img1.imgtn.bdimg.com/it/u=3342737063,3964532796&fm=23&gp=0.jpg"});
                    }, 2000);
                    break;
                default:
                    isWarn && console.warn(`没有找到flag:${flag},请确保有${flag}的测试数据`,param);
                    break;
            }
        }
    }
}


function getN(flag){
    // !isTest && alert('调用方法'+flag);
    if (isIos || isTest) {
        return window.App.getNativeParam(flag);
    }else{
        var a = window.App.getNativeParam(flag);
        // alert('返回数据:'+a);
        return a?JSON.parse(a):'';
    }
}
function callN(flag,param){
    param = param?param:{};
    param.callbackId = flag;
    // !isTest && alert('调用方法'+flag+',传递参数'+JSON.stringify(param));
    if(isIos || isTest){
        return window.App.callNative(flag,param);
    }else{
        return window.App.callNative(flag,JSON.stringify(param));
    }
}

export {
    getN,
    callN
};