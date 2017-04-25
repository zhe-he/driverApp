/**
 * Created by yangshuang on 2017/4/24.
 */
import {getN} from "nativeA";
const BASEINFO = getN('getBase');
const ADDREP=BASEINFO.host+'/app-dms/report/add';//添加人工报修
const GETVEL=BASEINFO.host+'/app-dms/vehicle/getVelByField';//查询车辆信息
const GETREPORT=BASEINFO.host+'/app-dms/report/getReport';//查询报修单详情
const REPLIST=BASEINFO.host+'/app-dms/report/lists';//获取报修列表
const MESDET=BASEINFO.host+'/app-dms/message/detail';//查询消息详情
const MESLIST=BASEINFO.host+'/app-dms/message/lists';//获取消息列表
const USERINFO=BASEINFO.host+'/app-dms/driver/getUserInfo';//查询用户详情
const SIGNTOP=BASEINFO.host+'/app-dms/sign/top';//获取签到记录
const ADDSIGN=BASEINFO.host+'/app-dms/sign/add';//添加签到
const COMPLIST=BASEINFO.host+'/app-crm/company/lists';//获取公司列表
const EDITINFO=BASEINFO.host+'/app-dms/driver/editUserInfo';//完善个人信息

export {
    ADDREP,
    GETVEL,
    GETREPORT,
    REPLIST,
    MESDET,
    MESLIST,
    USERINFO,
    SIGNTOP,
    ADDSIGN,
    COMPLIST,
    EDITINFO

};