此文档为示例参考文档,参数名仅为参考,具体实现已后台为准      


1. 查询开屏广告接口     
url: 'xxxx',    
type: 'get'     

return : {
    msg: '错误信息', // 没有为空
    err_code: 0, // 0 代表没错误
    data: {}
}

1. 司机登陆接口   现有接口    

1. 校验是否登陆接口     
url: 'xxx',
type: 'post',
data: {
    'userid': 'userid',
    'token': 'token'
}   

return {
    msg: '',
    err_code: '',
    data: {}
}   

1. 司机注销接口   
url: 'xxx',
type: 'post',
data: {
    'userid': 'userid',
    'token': 'token'
}

return {
    msg: '',
    err_code: '',
    data: {}
}   



1. 完善个人信息接口     
url: 'xxx',
type: 'post',
data: {
    'company': '公司名称',
    'driver_name': '司机姓名',
    'driver_number': '驾驶证号',
    'driver_tel': '司机电话',
    'driver_pic': 'base64图片'    // 如果修改个人信息也走此接口，如果司机修改没有改图片，此处传的是后台返回的图片地址。
}   
// 修改信息接口是否同一个，请后台自定义 

return {
    msg: '',
    err_code: '',
    data: {}
}

1. 读取设备对应车牌号的公司名称   
url: 'xxx',
type: 'post',
data: {
    devMac: '',
    devSN: ''
    // 看后台需要哪个？是否2个都需要
}

return {
    msg: '',
    err_code: '',
    data: {
        number: '车牌号',
        company: '公司名称',
    }
}

1. 验证码发送接口 现有接口  
1. 原手机号验证接口 现有接口  
1. 绑定手机号接口  
url: 'xxx',
type: 'post',
data: {
    old_tel: '',
    old_code: '',
    new_tel: '',
    new_code: ''
}

return {
    msg: '',
    err_code: '',
    data: {
        userid: '',
        token: ''
    }
}

1. 查询司机使用人数接口   
url: 'xxx',
type: 'get'


return {
    msg: '',
    err_code: '',
    data: {
        count: '司机使用人数'
    }
}

1. 查询司机信息接口     
url: 'xxx',
type: 'post',
data: {
    userid: '',
    token: ''
}

return {
    msg: '',
    err_code: '',
    data: {
        driver_pic: '司机头像',
        driver_bug: '故障追踪个数',
        '公司名称': '',
        '司机姓名': '',
        '联系电话': '',
        '驾驶证号': '',
        '驾驶证照片':'',
        '审核状态': ''
    }
}

1. 自动签到成功后回显数据  
url: 'xxx',
type: 'post',
data: {
    userid: '',
    token: ''
}

return {
    msg: '',
    err_code: '',
    data: {}
}

1. 驾驶时间查询接口     
url: 'xxx',
type: 'post',
data: {
    userid: '',
    token: ''
} 
return {
    msg: '',
    err_code: '',
    data: {
        driverTime: '驾驶时间'
    }
}

1. 当前设备连接用户数(设备)       
url: 'xxx',
type: 'post',
data: {
    devMac: '',
    devSN: ''
    // 看需要哪个传哪个
} 
return {
    msg: '',
    err_code: '',
    data: {
        people: '当年连接的用户数',
        today_people: '截止到现在,今日连接的总用户数'
    }
}

1. 自动签到接口   
url: 'xxx',
type: 'post',
data: {
    userid: '',
    token: '',
    driver_number: '车牌号'
} 

return {
    msg: '',
    err_code: '',
    data: {}
}

1. 手动签到接口 （同上）  

1. 获取签到条件(设备)  
url: 'xxx',
type: 'post',
data: {
    devMac: '',
    devSN: ''
    // 看需要哪个传哪个
}

return {
    msg: '',
    err_code: '',
    data: {
        lat: '纬度',
        lng: '经度'
    }
}

1. 获取签到记录接口     
url: 'xxx',
type: 'post',
data: {
    userid: '',
    token: '',
    month: '月份' // 传空或不传为查询当月
} 

return {
    msg: '',
    err_code: '',
    data: [
        {
            status: 0 // 0 无 1手动 2自动
        },{同上},{同上},... // 数组的长度为当月的天数
    ]
}

1. 查询车辆详情接口     
url: 'xxx',
type; 'post',
data: {
    driver_number: '车牌号'
}

return {
    msg: '',
    err_code: '',
    data: {
        '行驶证': '',
        'S/N': '',
        'MAC': ''
    }
}

1.设备自检提交接口  
url: 'xxx',
type: 'post',
data: {
    'userid':'',
    'token':'', 
    '车牌号':'',
    '设备SN':'',
    'wifi连接状态':'',
    'portal页面':'',
    '北斗定位设备':''
}

return {
    msg: '',
    err_code: '',
    data: {
        '流水号': ''
    }
}

1. 获取上次自检结果    
url: 'xxx',
type: 'post',
data: {
    '流水号': ''
}

return {
    msg: '',
    err_code: '', 
    data: {
        '车牌号':'',
        '设备SN':'',
        'wifi连接状态':'',
        'portal页面':'',
        '北斗定位设备':''
    }
}

1. 设备自检项获取接口（设备）    
url: 'xxx',
type: 'post',
data: {
    devMac: '',
    devSN: ''
    // 看需要哪个传哪个
}

return {
    msg: '',
    err_code: '', 
    data: {
        '车牌号':'',
        '设备SN':'',
        'wifi连接状态':'',
        'portal页面':'',
        '北斗定位设备':''
    }
}


1. 查询故障保修列表接口   
url: 'xxx',
type: 'post',
data: {
    'userid':'',
    'token':''
}

return {
    msg: '',
    err_code: '', 
    data: {
        '保修编号':'',
        '保修时间':'',
        '故障描述':'',
        '保修类型': 0 // 0自动保修, 1手动保修
        '修复状态': 0 // 0未修复，1已修复
    }
}


1. 人工报修接口   
url: 'xxx',
type: 'post',
data: {
    'userid':'',
    'token':'',
    '保修人':'', // ?? 是否需要 
    '车牌号':'',
    '故障描述':'',
    '设备SN':'',
    '运企名称':''
}

return {
    msg: '',
    err_code: '', 
    data: {}
}


1. 行驶轨迹（设备）     
url: 'xxx',
type: 'post',
data: {
    'userid':'',
    'token':''
}

return {
    msg: '',
    err_code: '', 
    data: [
        {
            lat: '',
            lng: '',
            time: ''
        },{同上},{同上},...
    ]
}

1. 上传司机头像图片接口   
url: 'xxx',
type: 'post',
data: {
    '司机图片':'',
    'userid':'',
    'token': ''
}     

return {
    msg: '',
    err_code: '', 
    data: {}
}