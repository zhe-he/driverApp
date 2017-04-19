/**
 * Created by zhe-he.
 */
const fs = require('fs');
const express=require('express');
const bodyParser=require('body-parser');
const multerLib=require('multer');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const consolidate=require('consolidate');
var multer=multerLib({dest:'upload'});
var app=express();
var port = process.argv[2]?process.argv[2].replace('--',''):8081;
app.listen(port);

//使用中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(multer.any());
app.use(cookieParser());
app.use(cookieSession({
    name:'test-session',
    keys:['dev','test'],
    maxAge:20*60*1000
}));

// 接口
// get post file cookie session
// console.log(req.query,req.body,req.files,req.cookies,req.session);

//  设备接口
//  获取设备SN、MAC

app.use('/api/getinfo',function (req,res){
    var data = req.query || req.body;
    var message = {
        "DMAVer":"20170414",
        "portalVer":"T_2.7.3",
        "jarSize":4005079,
        "jarModified":1492421659000,
        "deviceMac":"00:F8:F9:0A:11:F9",
        "deviceSN":"GD200A161004601",
        "deviceType":"GD200",
        "deviceIP":"112.96.252.21",
        "userMac":"9c:4e:36:13:f9:14", //  78:4f:43:53:99:2c
        "ip":"192.168.17.27"
    };
    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(message);
});

//  设备检测
app.use('/op/health',function (req,res){
    var data = req.query || req.body;

    var message = {
        "Compass": "OK",
        "Portal": "OK",
        "WIFI": "OK",
        "4G": "4G: service not running"
    };

    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(message);
});

// 获取设备连接人数
app.use('/op/userstats',function (req,res){
    var data = req.query || req.body;
    let message = {"all":300, "now":10};

    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(message);
});
// 获取设备gps信息
app.use('/op/userstats',function (req,res){
    var data = req.query || req.body;
    let message =  { "lat": "30.12345", "lon": "114.12345", "sog": "20", "cog": "0" };
    
    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(message);
});

// 3.5.3 查询报修详情
app.use('/Driver/report/getReport',function (req,res){
    var data = req.query || req.body;
    var callback = req.query.callback;

	var test = {
        "code": 0,
        "message":"ok",
        "data": {
            "id": 111,
            "number": "44223",
            "plate_num": "辽C·L8765",
            "content": {
                "dtime":"2017-01-11 12:23:10",//检测时间
                "plate_num":"辽C·L8765",//车牌号
                "plate_sn":"HMAPA01160700537",//设备SN
                "wifi":0,//wifi链接 0-异常 1-正常
                "portal":1,//Portal页面 0-异常 1-正常
                "compass":1,//北斗定位 0-异常 1-正常
            },
            "type": 1,
            "status": 2,//1-已报修 2-已处理
            "ctime": 'xxx',
            "utime": "xxx"

        }
    };
    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(test);

});
// 3.5.1 获取报修列表
app.use('/Driver/report/lists',function (req,res){
    var data = req.query || req.body;
    var message = {
        "code": 0,
        "data": {
            "total": 12,
            "list": [{
                "id": 1,
                "number": "BX000001",
                "plate_num": "xxx",
                "content":{
                    "type":2,
                    "describe":"设备无法连接WIFI"
                },
                "type": 1 ,//1-自动 2-手动
                "status": 1,//1-未修复 2-已修复
                "ctime": "2017-04-17 11:36:54"
            },{
                "id": 2,
                "number": "BX000002",
                "plate_num": "xxx",
                "content": "xxx",
                "type": 2 ,
                "status": 2,
                "ctime": "2017-04-11"
            }]
        }
    };
    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(message);
});
// 3.5.2 添加报修
app.use('/Driver/report/add',function (req,res){
    var data = req.query || req.body;
    var callback = data.callback;
    var message = {
        "code": 0,
        "message": "ok",
        "data":{
            "id":1,
            "number":"xxx",
            "ctime":"xxx"
        }
    };
    res.setHeader('Access-Control-Allow-Origin','*');
    // res.setHeader('charset','UTF-8');
    if(callback){
        message = `${callback}(${JSON.stringify(message)})`;
    }
    res.send(message);
});
// 3.2.5 修改用户信息
app.use('/app-dms/driver/editUserInfo',function (req,res){
    var data = req.query || req.body;

    var message = {
        "code": 0,
        "message":"ok"
    };

    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(message);
});

const LAST_SIGN_TYPE = Math.random()*2|0+1;
const LAST_SIGN_TIME = Math.random()>1?Date.now():Date.now()-24*3600*1000;
// 3.2.7 查询用户详情
app.use('/app-dms/driver/getUserInfo',function (req,res){
    var data = req.query || req.body;

    var t = Math.random()*4|0;
    var message = {
        "code": 0,
        "message":"ok",
        "data": {
            "uid": 1,
            "union_id": "xxx",
            "mobile": 18888888888 ,
            "name": "xxx",
            "cmp_id": 1,
            "cmp_name": "xxx",
            "license": "xxx",
            "license_photo": "http://imgsrc.baidu.com/forum/pic/item/e5ff0081cb237db138012f73.jpg",
            "avatar": "xxx",
            "audit_reason": 1,
            "audit_status": 1,
            "last_sign_type": LAST_SIGN_TYPE,
            "last_sign_time": LAST_SIGN_TIME,
            "status": t
        }
    };

    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(message);
});

// 3.3.1 获取公司列表
app.use('/app-crm/company/lists',function (req,res){
    var data = req.body;
    var {cmp_name,page=1,size=20} = data;

    let number = (Math.random()*size+1)|0;
    let list = [];
    for (var i = 0; i < number; i++) {
        list[i] = {"id": i+1, "cmp_name": cmp_name+'-'+(i+1)}
    }
    var message = {
        "code": "0",
        "message": "ok",
        "data": {
            "list": list,
            "total": number
        }
    };
    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(message);
});
// 3.3.2 查询车辆信息
app.use('app-dms/vehicle/getVelByField',function (req,res){
    var data = req.query || req.body;

    var message = {
        "code": 0,
        "message": "ok",
        "data": {
            "equ_sn": "xx",
            "equ_mac": "xxx",
            "plate_num": "豫A12345",
            "cmp_id": 2 ,
            "cmp_name": "xxx",
            "mdriving_license_img": "http://img.zcool.cn/community/01033456f114f932f875a94467912f.jpg@900w_1l_2o_100sh.jpg"
        }
    };

    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(message);
});

// 3.4.1 获取签到列表
app.use('/app-dms/sign/top',function (req,res){
    var data = req.query || req.body;
    let yearMonth = data.month.split('-');
    let date = new Date(yearMonth[0],yearMonth[1],0);
    let days = date.getDate();
    let d = [];
    let today = new Date();
    let cur = 999999;
    let isCheck = false;
    if (yearMonth[0]==today.getFullYear() && yearMonth[1]==today.getMonth()+1) {
        cur = today.getDate();

        let lt = new Date(LAST_SIGN_TIME);
        if (lt.getDate()==cur) {
            isCheck = true;
        }
    }

    for (var i = 0; i < days; i++) {
        let y = date.getFullYear();
        let m = date.getMonth()+1;
        let t = Math.random()*3|0;
        if (i+1>=cur) {
            t = 0;
        }
        if (isCheck && i+1==cur) {
            t = LAST_SIGN_TYPE;
        }
        d[i] = {
            date: `${y}-${toDou(m)}-${toDou(i+1)}`,
            type: t
        };
    }
    let message = {
        "code": 0,
        "message":'ok',
        "data": d
    };
    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(message);
});

// 3.4.2 添加接口
app.use('/app-dms/sign/add',function (req,res){
    var data = req.query || req.body;
    let message = {
        "code": 0,
        "message":'ok'
    };
    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(message);
});


function toDou(n){
    return n<10?'0'+n:''+n;
}
