## app-h5-connect 	
v1.1版 	

### 特别说明，字符串一律用双引号 	

#### H5调native方法 	
获取app数据，window.DriverApp.getNativeParam("标志名") 	
调用app方法，window.DriverApp.callNative("标志名",Object) 	
Object {
    "callbackId": "标志名",     // 一定会有
    ...
} 

##### native调用h5方法 	
window.nativeCallback("名字"[,"参数"]) 	

##### native->h5 	
 	

##### h5->native 	
1. 获取用户基本信息     
window.DriverApp.getNativeParam("baseInfo")     
return {
    "token": "",
    "userid": "",
    "tel": 15000000000
}   

1. 清除本地缓存 	
window.DriverApp.callNative("cleanCache",Object) 	

1. 版本更新 	
window.DriverApp.callNative("updateApp",Object) 	
		
1. 用户注销     
window.DriverApp.callNative("signOut",Object)

1. 获取本次行驶轨迹(本期可能不做,可能后续添加) 	
window.DriverApp.getNativeParam("getDriveLine") 	
return [
	{
		"lat": 37, 	
		"lng": 127, 	
        "time": 1490934526117   
	},{同上},{同上},...
] 	



1. 告诉客户端继续自动签到  
window.DriverApp.callNative("autoSign")     
当自动签到失败，或正在自动签到时，用户点击签到按钮，会调用此方法    

1. 获取设备自动检测单号(连接成功十分钟app自检后台返回的单号)   
window.DriverApp.getNativeParam("getAutoCheckNumber") 
return {
    "number": "111111" // 没有传 ""  
}   

1. 提交设备H5自动检测单号(连接十分钟之内进入自检页面H5自检后台返回的单号)   
window.DriverApp.callNative("sendCheckNumber",Object) 
Object {
    "callbackId": "sendCheckNumber",
    "number": "111111" 
}   

1. 获取个人中心的消息列表  
window.DriverApp.getNativeParam('getSystemMsg')   
return [{
    "id": 1,
    "title": "标题",
    "content": "内容",  // 可能获取不到？？？ 
    "status": 0 // 0 未读 1 已读
    "time": 1490934526117   
},{同上},{同上}]   

####### 暂定以上，有问题再后续沟通 	