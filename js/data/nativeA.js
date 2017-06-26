import {isIos, isAndroid} from "method";

var isTest = !/(iOSApp|AndroidApp)\/wangfanDriver\s+(\d\.?)+/i.test(window.navigator.userAgent);
const isWarn = true; // 是否开启测试警告

var TESTUID,TESTUNIONID,TESTTOKEN,TESTHOST;
if (true) {
    TESTUID = 11; // 测试uID
    TESTUNIONID = '5790da7ef1f549ee98449f79624045e5'; // 测试集团uid
    TESTTOKEN = 'k2xpc6ulbmRyU6aclohsp26Tn4doklhto52ZclWrzc6XVHKiamNoanBhZGZllmpvsQ=='; // 测试token
    TESTHOST = 'http://10.10.39.66:8083'; // 测试host地址
}else{
    TESTUID = 10015;
    TESTUNIONID = '2c187ec7e0ee4a319c793c68a2c67e19';
    TESTTOKEN = "k2xpc6ulbmRyU6aclohsp26Wn4dokWZjZYWgq21rnoOmm6SeUm2da2llampqm2ZlZpSg4g==";
    TESTHOST = 'http://api.9797168.com'; // 线上
}
const TESTACCESSTOKEN = '65e1866dbbddfc987268ab1b2e30b8b8'; // 测试token
const TESTTEL = 18701112560; // 测试手机号
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
                    };
                case "getDriveLine":  
                    isWarn && console.warn("获取行驶轨迹,已移除");
                    return [{
                        "lng": 116.575552,
                        "lat": 40.096255,
                        "time": Date.now()
                    },{
                        "lng": 116.57636,
                        "lat": 40.087981,
                        "time": Date.now()
                    }];
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
                    };
                case "getCache":
                    isWarn && console.warn("获取缓存数据大小");
                    return {
                        "size": "1.23M"
                    };
                case "wifi":
                isWarn && console.warn("获取wifi状态");
                    return {
                        "open":     1,  
                        "wangfan":  1,
                    };   
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
                case "getDriveLine":
                    isWarn && console.warn("获取行驶轨迹");
                    setTimeout(()=>{
                        param = [{
                            "lat": "40.097568",
                            "lng": "116.577361"
                        },
                        {
                            "lat": "40.097568",
                            "lng": "116.577361"
                        },
                        {
                            "lat": "0",
                            "lng": "0"
                        },
                        {
                            "lat": "40.097734",
                            "lng": "116.577398"
                        },
                        {
                            "lat": "40.097734",
                            "lng": "116.577398"
                        },
                        {
                            "lat": "40.097583",
                            "lng": "116.575843"
                        },
                        {
                            "lat": "0",
                            "lng": "0"
                        },
                        {
                            "lat": "40.097583",
                            "lng": "116.575843"
                        },
                        {
                            "lat": "40.097583",
                            "lng": "116.575843"
                        },
                        {
                            "lat": "40.091512",
                            "lng": "116.581955"
                        },
                        {
                            "lat": "40.091512",
                            "lng": "116.581955"
                        },
                        {
                            "lat": "40.087887",
                            "lng": "116.576186"
                        },
                        {
                            "lat": "40.087887",
                            "lng": "116.576186"
                        },
                        {
                            "lat": "40.087875",
                            "lng": "116.576066"
                        },
                        {
                            "lat": "40.087858",
                            "lng": "116.575957"
                        },
                        {
                            "lat": "40.087832",
                            "lng": "116.575847"
                        },
                        {
                            "lat": "40.087803",
                            "lng": "116.575739"
                        },
                        {
                            "lat": "40.087780",
                            "lng": "116.575651"
                        },
                        {
                            "lat": "40.087719",
                            "lng": "116.575575"
                        },
                        {
                            "lat": "40.087656",
                            "lng": "116.575529"
                        },
                        {
                            "lat": "40.087565",
                            "lng": "116.575499"
                        },
                        {
                            "lat": "40.087492",
                            "lng": "116.575468"
                        },
                        {
                            "lat": "40.087391",
                            "lng": "116.575494"
                        },
                        {
                            "lat": "40.087302",
                            "lng": "116.575503"
                        },
                        {
                            "lat": "40.087185",
                            "lng": "116.575518"
                        },
                        {
                            "lat": "40.087081",
                            "lng": "116.575537"
                        },
                        {
                            "lat": "40.086985",
                            "lng": "116.575556"
                        },
                        {
                            "lat": "40.086877",
                            "lng": "116.575584"
                        },
                        {
                            "lat": "40.086782",
                            "lng": "116.575597"
                        },
                        {
                            "lat": "40.086682",
                            "lng": "116.575616"
                        },
                        {
                            "lat": "40.086601",
                            "lng": "116.575642"
                        },
                        {
                            "lat": "40.086494",
                            "lng": "116.575646"
                        },
                        {
                            "lat": "40.086394",
                            "lng": "116.575662"
                        },
                        {
                            "lat": "40.086279",
                            "lng": "116.575684"
                        },
                        {
                            "lat": "40.082081",
                            "lng": "116.576345"
                        },
                        {
                            "lat": "40.082081",
                            "lng": "116.576345"
                        },
                        {
                            "lat": "40.079714",
                            "lng": "116.579551"
                        },
                        {
                            "lat": "40.079714",
                            "lng": "116.579551"
                        },
                        {
                            "lat": "40.078178",
                            "lng": "116.580807"
                        },
                        {
                            "lat": "40.078178",
                            "lng": "116.580807"
                        },
                        {
                            "lat": "40.079572",
                            "lng": "116.583490"
                        },
                        {
                            "lat": "40.079572",
                            "lng": "116.583490"
                        },
                        {
                            "lat": "40.077647",
                            "lng": "116.581036"
                        },
                        {
                            "lat": "40.077647",
                            "lng": "116.581036"
                        },
                        {
                            "lat": "40.066185",
                            "lng": "116.582515"
                        },
                        {
                            "lat": "40.066185",
                            "lng": "116.582515"
                        },
                        {
                            "lat": "40.058710",
                            "lng": "116.583712"
                        },
                        {
                            "lat": "40.058710",
                            "lng": "116.583712"
                        },
                        {
                            "lat": "40.049253",
                            "lng": "116.581682"
                        },
                        {
                            "lat": "40.049253",
                            "lng": "116.581682"
                        },
                        {
                            "lat": "40.039135",
                            "lng": "116.571212"
                        },
                        {
                            "lat": "40.039135",
                            "lng": "116.571212"
                        },
                        {
                            "lat": "40.033597",
                            "lng": "116.563207"
                        },
                        {
                            "lat": "40.033597",
                            "lng": "116.563207"
                        },
                        {
                            "lat": "40.028322",
                            "lng": "116.550709"
                        },
                        {
                            "lat": "40.028322",
                            "lng": "116.550709"
                        },
                        {
                            "lat": "40.023680",
                            "lng": "116.536702"
                        }];
                        if (isAndroid) {param = JSON.stringify(param);}
                        window.nativeCallback("setDriveLine",param);
                    }, 1000);
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
                        if (param.type==2) {
                            param.link = "http://pic.58pic.com/58pic/13/60/97/48Q58PIC92r_1024.jpg";
                        }else{
                            param.link = "http://img1.imgtn.bdimg.com/it/u=3342737063,3964532796&fm=23&gp=0.jpg";
                        }
                        if (isAndroid) {param = JSON.stringify(param);}
                        window.nativeCallback("upFile",param);
                    }, 2000);
                    break;
                case "getDriveTime":
                    isWarn && console.warn("获取驾驶时间");
                    setTimeout(()=>{
                        param.drive_time = "8.88";
                        if (isAndroid) {param = JSON.stringify(param);}
                        window.nativeCallback("setDriveTime",param);
                    },2000);
                    break;
                default:
                    isWarn && console.warn(`没有找到flag:${flag},请确保有${flag}的测试数据`,param);
                    break;
            }
        }
    };
}


function getN(flag){
    if (isIos || isTest) {
        return window.App.getNativeParam(flag);
    }else{
        var a = window.App.getNativeParam(flag);
        return a?JSON.parse(a):'';
    }
}
function callN(flag,param){
    param = param?param:{};
    param.callbackId = flag;
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