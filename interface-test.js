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

// 设备接口
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
        "userMac":"9c:4e:36:13:f9:14",
        "ip":"192.168.17.27"
    };
    res.setHeader('Access-Control-Allow-Origin','*');
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
            "last_sign_type": 1,
            "last_sign_time": "xx",
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
app.use('/app-dms/device/getVelByField',function (req,res){
    var data = req.query || req.body;

    var message = {
        "code": 0,
        "message": "ok",
        "data": {
            "equ_sn": "xx",
            "equ_mac": "xxx",
            "plate_num": "xxx",
            "cmp_id": 2 ,
            "cmp_name": "xxx",
            "mdriving_license_img": "http://img.zcool.cn/community/01033456f114f932f875a94467912f.jpg@900w_1l_2o_100sh.jpg"
        }
    };

    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(message);
});
