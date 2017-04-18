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

app.use('/test',function (req,res){
	var name = req.query.name || req.body.name;
	var callback = req.query.callback;
	

	res.setHeader('Access-Control-Allow-Origin','*');
	res.send({"message":"","data":{}});
	
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
            "SN_num": "6012313" ,
            "wifi" : 1,
            "protal": 1
        }
    };


    res.setHeader('Access-Control-Allow-Origin','*');
    res.send(test);

});