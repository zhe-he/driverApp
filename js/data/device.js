var isTest = !/(iOSApp|AndroidApp)\/wangfanDriver\s+(\d\.?)+/i.test(window.navigator.userAgent);
const HOST = isTest?'http://localhost:8081':'http://www.wangfanwifi.com:16621';
const URL_GETINFO = HOST+'/api/getinfo';     // 获取设备SN MAC
const URL_OPENNET = HOST+'/api/userAuth';    // 开网
const URL_USERS = HOST+'/op/userstats';      // 获取开网用户数
const URL_GPS = HOST+'/op/gpsinfo';          // 获取gps
const URL_HEALTH = HOST+'/op/health';        // 设备检测

export {
    URL_GETINFO,
    URL_OPENNET,
    URL_USERS,
    URL_GPS,
    URL_HEALTH
};