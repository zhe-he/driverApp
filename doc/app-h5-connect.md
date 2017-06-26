## app-h5-connect 	
v1.1.3版 	

### 特别说明，字符串一律用双引号 	

#### userAgent标识(x.x.x为版本号)    
ios: iOSApp/wangfanDriver x.x.x     
android: AndroidApp/wangfanDriver x.x.x     

#### H5调native方法 	
获取app数据，window.App.getNativeParam("标志名") 	
调用app方法，window.App.callNative("标志名",Object) 	
Object {    
    "callbackId": "标志名",     // 一定会有
    ...
} 

##### native调用h5方法 	
window.nativeCallback("名字"[,"参数"]) 	

##### 全局方法（*.html）  
1. 获取用户基本信息(login module)     
window.App.getNativeParam("getBase")     
return {    
    "host": "",      
    "token": "",    
    "uid": "",  // id   
    "userID": "",  // 集团id      
    "tel": 15000000000,  
    "platform": "",  // 来源 ios、Android   
    "access_token": ""  
}  
1. 通知前台内部刷新   
window.nativeCallback("hotUpdate")
1. 显示加载蒙层   
window.nativeCallback("showLoad",Object)    
Object {    
    "type": 1   // 1,2,3,4,5 对应5种不同样式   
}   
1. 关闭加载蒙层   
window.nativeCallback("hideLoad")   
1. 弹窗   
window.nativeCallback("toast",Object|String)   
Object {    
    "msg":  "弹窗文字",  
    "time": 2000 // 多长时间自动消失，不传默认为2s    
}   
String "弹窗文字"   // 只传String会走默认2秒后关闭    

1. 永久显示弹窗   
window.nativeCallback("showToast",String)   
String "弹窗文字"   
1. 立即关闭弹窗     
window.nativeCallback("hideToast")    

1. 获取驾驶时间   
window.App.callNative("getDriveTime",Object)   
当获取后，客户端调用 window.nativeCallback("setDriveTime",Object)回传  
1. native设置驾驶时间     
window.nativeCallback("setDriveTime",Object)    
Object {    
    "drive_time": 1.33  
}   

1. ~~打点(Analysis cs -VZ)~~     
window.App.callNative("dot", Object)  
Object {    
    "callbackId": "dot",    
    "dotId": "xxx"      
}   

1. ~~文案提示(移除)~~     
window.App.callNative("msg", Object)  
Object {    
    "callbackId": "msg",    
    "content": "加载失败..."      
}   
1. ~~关闭当前页面(移除)~~     
window.App.callNative("close", Object)     
Object {    
    "callbackId": "close",   
    "type": 1   // 1-首页，3-个人中心      
}   
1. 获取网络状态   
window.App.getNativeParam("wifi")     
return {    
    "open":     0,  // wifi 是否打开  0关1开  
    "wangfan":  0,  // 是否为往返wifi 0否1是   
}   

##### 签到（checkin.html）    
1. 告诉客户端继续自动签到  
window.App.callNative("autoCheckIn")     
当自动签到失败，或正在自动签到时，用户点击签到按钮，会调用此方法 

##### 车辆（bus.html busDetail.html）   
1. 获取本次行驶轨迹          
window.App.callNative("getDriveLine",Object)     
当获取后，客户端调用 window.nativeCallback("setDriveLine",Object)回传   
1. 客户端更新本次行驶轨迹(用户第一次进来开启定位获取到经纬度)     
window.nativeCallback("setDriveLine",Object)    
Object {    
    {   
        "lat": 37,  
        "lng": 127,     
        "time": 1490934526117  // 暂时不需要，单位 /ms   
    },{同上},{同上},...
}   

1. ~~获取当前位置(GPS,移除)~~   
window.App.callNative("getLocation",Object)   
客户端回传  sendLocation   
window.nativeCallback("sendLocation", Object)    
Object {    
    "status": 1,    // 状态,1代表用户同意定位并定位成功,2代表同意定位并定位失败,3代表用户拒绝定位   
    "lat":39.93909242059091,  // 纬度,没有传0
    "lng":116.43035530958362 // 精度,没有传0  
}   
##### 设备日检

1. 获取设备自动检测单号(连接成功十分钟app自检后台返回的单号,health check)   
window.App.getNativeParam("getAutoCheckNumber") 
return {    
    "number": "111111" // 没有传 ""    
    "plate_sn":"xxxx",//设备SN    
    "isChecked":1,//当日用户是否自检过 1-是 0-否   
    "ctime":1488728377 //检测时间   
}   

1. 提交设备H5自动检测单号(连接十分钟之内进入自检页面H5自检后台返回的单号,health check)   
window.App.callNative("sendCheckNumber",Object) 
Object {    
    "callbackId": "sendCheckNumber",    
    "number": "111111",     
    "id":1,     
    "ctime":"xxx", // \s    
    "plate_sn":"xxx"    
} 
    "plate_num":"xxx",//车牌号
    "plate_sn":"xxx",//设备SN
    "WIFI": "OK",//wifi链接 
    "Portal": "OK",//Portal页面 
    "Compass": "OK",//北斗定位 
    "4G": "OK" // 4G
}   
##### 消息（systemMessage.html）    
1. ~~获取个人中心的消息列表(news feed,移除)~~  
window.App.getNativeParam('getSystemMsg')   
return [{   
    "id": 1,    
    "title": "标题",  
    "content": "内容",  // 可能获取不到？？？      
    "status": 0 // 0 未读 1 已读    
    "time": 1490934526117       
},{同上},{同上}]    
1. ~~消息详情返回到消息列表(移除)~~  
window.nativeCallback("refresh",Object)    
Object {    
    "link": "systemMessage.html?setting=hmbrf&id=1"    
}   


##### 设置（settings.html）     
1. 清除本地缓存(clean cache)  
window.App.callNative("cleanCache",Object)    

1. 获取本地缓存大小     
window.App.getNativeParam("getCache")    
return {    
    "size": "1.34M"    // 没有传"0M"     
}   

1. 版本更新(update)     
window.App.callNative("updateApp",Object)     
Object {    
    "callbackId": "updateApp",    
    "url": "http://ihangmei.com" // 更新的URL地址    
}   
        
1. 用户注销     
window.App.callNative("signOut",Object)   

1. 上传图片     
window.App.callNative("upFile",Obeject)     
Object  {   
    "type": 1,  // 1 驾驶证照片 2 用户头像
    "method": 1, // 1 拍照 2 从相册选择照片
    "msg": "拍照-驾驶证" // 说明信息，仅供查看，'拍照-用户头像'.'相册选择-驾驶证'等     
}   
成功后App回调    
window.nativeCallback("upFile",Object)  
Object {    
    "type": 1,  // 1 驾驶证照片 2 用户头像   
    "link": 'http://www.baidu.com'    
}   

#### 二期  
##### 消息    
1. ~~客户端向H5推送消息(news feed -VZ)~~   
window.nativeCallback("sendSystemMsg", Array)  
Array [     
    {   
        "title": "标题",  
        "id": 1,    
        "content": "内容",    
        "time": 1490934526117   
    },  
    {同上},{同上},...
]   

