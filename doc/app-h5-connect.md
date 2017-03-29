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
window.DriverApp.callNative("cleanCatch",Object) 	

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
	},{同上},{同上},...
] 	

1. 获取当前位置 	
window.DriverApp.callNative("getPosition") 	
无论成功与否，请回传方法 	
window.DriverApp.nativeCallback("sentPosition",Object) 	
Object {
	"status": 1,    // 状态,1代表用户同意定位并定位成功,2代表同意定位并定位失败,3代表用户拒绝定位   
    "lat":39.93909242059091,  // 纬度,没有传0
    "lng":116.43035530958362 // 精度,没有传0 
} 	

1. 获取司机当前签到状态   
window.DriverApp.getNativeParam("getSign")  
return {
    "status": 0 // 0 自动签到失败， 1 自动签到成功
}   

1. 告诉客户端继续自动签到  
window.DriverApp.callNative("autoSign")     
当自动签到失败，或正在自动签到时，用户点击签到按钮，会调用此方法    

1. 获取设备自动检测单号(连接成功十分钟自检后台返回的单号)   
window.DriverApp.getNativeParam("getAutoCheckNumber") 
return {
    "number": "111111" // 没有传 ""  
}   

####### 暂定以上，有问题再后续沟通 	