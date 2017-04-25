function dataFormat(time,formatStr){
    var nowDate = new Date(time);
    var str = formatStr;

    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    str = str.replace(/yyyy|YYYY/, nowDate.getFullYear());
    str = str.replace(/yy|YY/, (nowDate.getYear() % 100) > 9 ? (nowDate.getYear() % 100).toString() : '0' + (nowDate.getYear() % 100));
    str = str.replace(/MM/, (nowDate.getMonth() + 1) > 9 ? (nowDate.getMonth() + 1).toString() : '0' + (nowDate.getMonth() + 1));
    str = str.replace(/M/g, (nowDate.getMonth() + 1));
    str = str.replace(/w|W/g, Week[nowDate.getDay()]);
    str = str.replace(/dd|DD/, nowDate.getDate() > 9 ? nowDate.getDate().toString() : '0' + nowDate.getDate());
    str = str.replace(/d|D/g, nowDate.getDate());
    str = str.replace(/hh|HH/, nowDate.getHours() > 9 ? nowDate.getHours().toString() : '0' + nowDate.getHours());
    str = str.replace(/h|H/g, nowDate.getHours());
    str = str.replace(/mm/, nowDate.getMinutes() > 9 ? nowDate.getMinutes().toString() : '0' + nowDate.getMinutes());
    str = str.replace(/m/g, nowDate.getMinutes());
    str = str.replace(/ss|SS/, nowDate.getSeconds() > 9 ? nowDate.getSeconds().toString() : '0' + nowDate.getSeconds());
    str = str.replace(/s|S/g, nowDate.getSeconds());
    return str;
}

var u = window.navigator.userAgent;
const isIos = /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(u);
const isAndroid = /(Android|Linux)/i.test(u);
const isMobile = 'ontouchstart' in window;
const isWeixin = /MicroMessenger/i.test(navigator.userAgent);
const orientation = 'onorientationchange' in window ? 'orientationchange' : 'resize';  //横竖屏
const clone = (origin) => JSON.parse(JSON.stringify(origin));

const format2Time = (time) => {
    var y = time.substr(0,4),
        M = time.substr(5,2)-1,
        d = time.substr(8,2),
        h = time.substr(11,2) || 0,
        m = time.substr(14,2) || 0,
        s = time.substr(17,2) || 0;
    var nowDate = new Date();
    nowDate.setFullYear(y,M,d);
    nowDate.setHours(h,m,s);
    return nowDate.getTime();
};

const setTime = (callback) => {
    var a = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback){
        return window.setTimeout(function (){
            callback();
        }, 16.7);
    });
    return a(callback);
};
const clearTime = (id) => {
    var a = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function (id){
        window.clearTimeout(id);
    };
    return a(id);
};


// 定位
const getPosition = (opts) => {
    opts.accuracy = opts.accuracy || true; // 精确定位
    opts.timeout = opts.timeout || 10000;
    opts.maxAge = opts.maxAge || 5000;

    if (window.navigator.geolocation) {
            var options = {
               enableHighAccuracy:  opts.accuracy,
               timeout:             opts.timeout,
               maximumAge:          opts.maxAge
            };
        window.navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
    } else {
        console.log("浏览器不支持html5来获取地理位置信息");
    }

    function handleSuccess(position){         
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        opts.success && opts.success(lat, lng);
    }

    function handleError(error){
        switch(error.code) {
            case error.TIMEOUT: // 3
                console.log("A timeout occured! Please try again!");
                opts.error && opts.error(error.code);
                break;
            case error.POSITION_UNAVAILABLE: // 2
                console.log('We can\'t detect your location. Sorry!');
                opts.error && opts.error(error.code);
                break;
            case error.PERMISSION_DENIED: // 1
                console.log('Please allow geolocation access for this to work.');
                opts.error && opts.error(error.code);
                break;
            case error.UNKNOWN_ERROR: // 4
                console.log('An unknown error occured!');
                opts.error && opts.error(error.code);
                break;
        }
    }
};
const jsonp = (json) => {
    json.data=json.data||{};
    json.timeout=json.timeout||0;
    

    var callback = json.data.jsonp || 'callback';

    //data.cb分配
    var name='jsonp_'+Math.random();
    name=name.replace('.', '');
    
    json.data[callback]=name;
    
    
    var arr=[];
    for(var i in json.data){
        arr.push(i+'='+encodeURIComponent(json.data[i]));
    }
    
    window[json.data[callback]]=function (data){
        json.success && json.success(data);
        
        //用完了
        oHead.removeChild(oS);
        window[json.data[callback]]=null;
        
        clearTimeout(timer);
    };
    
    var oS=document.createElement('script');
    oS.src=json.url+'?'+arr.join('&');
    
    var oHead=document.getElementsByTagName('head')[0];
    oHead.appendChild(oS);
    
    if(json.timeout){
        var timer=setTimeout(function (){
            oHead.removeChild(oS);
            window[json.data[callback]]=null;
            
            json.error && json.error();
        }, json.timeout);
    }
}; 

export {
    isIos,
    isAndroid,
    isMobile,
    isWeixin,
    orientation,
    clone,
    setTime,
    clearTime,
    dataFormat,
    format2Time,
    getPosition,
    jsonp
};