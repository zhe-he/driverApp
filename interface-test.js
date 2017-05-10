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

const SLEEPTIME = 1500;
app.use('/api/getinfo',function (req,res){
    var data = req.query || req.body;
    var message = {
        "DMAVer":"20170414",
        "portalVer":"T_2.7.3",
        "jarSize":4005079,
        "jarModified":1492421659000,
        "deviceMac":"00:F8:F9:0A:11:F9",
        "deviceSN":"6024694", // 6015014
        "deviceType":"GD200",
        "deviceIP":"112.96.252.21",
        "userMac":"9c:4e:36:13:f9:14", //  78:4f:43:53:99:2c
        "ip":"192.168.17.27"
    };
    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});

//  设备检测
app.use('/op2/health',function (req,res){
    var data = req.query || req.body;

    var message = {
        "Compass": "OK",
        "Portal": "OK",
        "WIFI": "OK",
        "4G": "4G: service not running"
    };

    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});

// 获取设备连接人数
app.use('/op2/userstats',function (req,res){
    var data = req.query || req.body;
    let message = {"all":300, "now":10};

    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});
// 获取设备gps信息
app.use('/op2/gpsinfo',function (req,res){
    var data = req.query || req.body;
    let message =  { "lat": "30.12345", "lon": "114.12345", "sog": "20", "cog": "0","data":Date.now()/1000|0};
    
    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});
// 获取设备开机时间     
app.use('/op2/uptime',function (req,res){
    var data = req.query || req.body;
    let time = 33333;
    
    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});

// 3.2.11 获取当前版本    
app.use('/app-dms/driver/checkVersion',function (req,res){
    var data = req.query || req.body;
    var callback = req.query.callback;

    var message = {
        "code": 0,
        "data": {
            "code": "1.0.0",
            "url": "",
            "content": ""
        }
    };

    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});
// 3.5.3 查询报修详情
app.use('/app-dms/report/getReport',function (req,res){
    var data = req.query || req.body;
    var callback = req.query.callback;

	var message = {
        "code": 0,
        "message": "ok",
        "data": {
            "id": "9",
            "number": "201705091102409743",
            "uid": "4",
            "plate_num": "",
            "content": "{\"Compass\":\"ok\",\"Portal\":\"OK\",\"WIFI\":\"fail\",\"4G\":\"Fial\"}",
            "type": "1",
            "status": "2",
            "ctime": "1494298960",
            "utime": "0"

        }
    };
    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);

});
// 3.5.1 获取报修列表
app.use('/app-dms/report/lists',function (req,res){
    var data = req.query || req.body;
    var page = data.page || 1;
    var total = 32;
    var size = data.size || 20;

    var aList = [];
    
    if (page*size<total) {
        for(var i=0;i<size;i++){
            item = createList();
            item.cid = (page-1)*size+i;
            aList[i] = item;
        }
    }else{
        var len = total-(page-1)*size;
        for(var i=0;i<len;i++){
            item = createList();
            item.cid = (page-1)*size+i;
            aList[i] = item;
        }
    }

    var message = {
        "code": 0,
        "data": {
            "total": total,
            "list": aList
        }
    };
    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);

    function createList(){
        var type = Math.random()<0.5?1:2;
        var content = "";
        if (type==1) {
            content = {
                "plate_num": (Math.random()<0.5?"辽CL8765":""),
                "plate_sn": (Math.random()<0.5?"HMAPA01160700537":""),
                "WIFI": (Math.random()<0.5?"OK":""),
                "Portal": (Math.random()<0.5?"OK":""),
                "Compass": (Math.random()<0.5?"OK":""),
                "4G": (Math.random()<0.5?"OK":"")
            }
        }else{
            content = "用户提交的错误信息";
        }
        return {
            "number": "BX000001",
            "plate_num": "xxx",
            "content": content,
            "type":  type,//1-自动 2-手动
            "status": (Math.random()<0.5?1:2),//1-未修复 2-已修复
            "ctime": Date.now()/1000
        }
    }
});
// 3.5.2 添加报修
app.use('/app-dms/report/add',function (req,res){
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
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});
// 3.6.3 查询消息详情
app.use('/app-dms/message/detail',function (req,res){
    var data = req.query || req.body;

    var message = {
        "code": 0,
        "message":"ok",
        "data": {
            "id": 1,
            "title": "阿里大文娱全资收购大麦网 派高管张宇出任CEO",
            "author": "xx",
            "cover": "xxx" ,
            "description": "xxx",
            "content":"大麦网官方今日宣布正式加入阿里巴巴大家庭，阿里巴巴大文娱CEO俞永福也转发微博称，欢迎大麦同学加入阿里大家庭。",
            "status": 0,
            "ctime": "2017.01.01 10:11:11"
        }
    };

    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});
// 3.6.2 获取消息列表
app.use('/app-dms/message/lists',function (req,res){
    var data = req.query || req.body;
    var size = data.size || 10;
    var total = 34;
    var page = data.page || 1;

    var aList = [];
    if(page*size - total < 0){
        for(var i = 0;i< size;i++){
            aList[i] = {
                "id": (page-1)*size+i,
                "title": "因为现在的手机大部分都不能因为现在的手机大部分都不能因为现在的手机大部分都不能",
                "author": "xx",
                "cover": "xxx" ,
                "description": "xxx",
                "status": Math.random()>0.5?0:1,
                "ctime": Date.now()/1000
            }
        }
    }else{
        for(var i = 0; i<total-(page-1)*size;i++){
            aList[i]= {
                "id": (page-1)*size+i,
                "title": "因为现在的手机大部分都不能因为现在的手机大部分都不能因为现在的手机大部分都不能",
                "author": "xx",
                "cover": "xxx" ,
                "description": "xxx",
                "status": Math.random()>0.5?0:1,
                "ctime": Date.now()/1000
            }
        }
    }

    var message = {
        "code": 0,
        "message":'ok',
        "data": {
            "list":aList,

            "total": total
        }
    };

    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});
// 3.6.1 消息编辑
app.use('/app-dms/message/edit',function (req,res){
    var data = req.query || req.body;

    var message = {
        "code": 0,
        "message":'ok'
    }//成功;

    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});
// 3.2.5 修改用户信息
app.use('/app-dms/driver/editUserInfo',function (req,res){
    var data = req.query || req.body;

    var message = {
        "code": 0,
        "message":"ok"
    };

    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
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
            "last_sign_time": LAST_SIGN_TIME/1000|0,
            "status": t
        }
    };

    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
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
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});
// 3.3.2 查询车辆信息
app.use('/app-dms/vehicle/getVelByField',function (req,res){
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
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
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
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});

// 3.4.2 添加接口
app.use('/app-dms/sign/add',function (req,res){
    var data = req.query || req.body;
    let message = {
        "code": 0,
        "message":'ok'
    };
    res.setHeader('Access-Control-Allow-Origin','*');
    setTimeout(()=>{
        res.send(message);
    },SLEEPTIME);
});


function toDou(n){
    return n<10?'0'+n:''+n;
}
