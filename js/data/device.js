// var isTest = !/(iOSApp|AndroidApp)\/wangfanDriver\s+(\d\.?)+/i.test(window.navigator.userAgent);
// const HOST = isTest?'http://localhost:8081':'http://www.wangfanwifi.com:16621';
const HOST = 'http://www.wangfanwifi.com:16621';
const URL_GETINFO = HOST+'/api/getinfo';     // 获取设备SN MAC
const URL_OPENNET = HOST+'/api/userAuth';    // 开网
const URL_USERS = HOST+'/op2/userstats';      // 获取开网用户数
const URL_GPS = HOST+'/op2/gpsinfo';          // 获取gps
const URL_HEALTH = HOST+'/op2/health';        // 设备检测

export {
    URL_GETINFO,
    URL_OPENNET,
    URL_USERS,
    URL_GPS,
    URL_HEALTH
};