/**
 * Created by yangshuang on 2017/3/31.
 */
const querystring = require('querystring');
import "css/deviceSelfChecking.scss";
import Vue from "vue";
import errcode from "errcode";
import VueResource from "vue-resource";
import commonTop from "common-top";
import {getN,callN} from "nativeA";
import loading from "loading";
import {dataFormat} from "method";
import {URL_GETINFO,URL_HEALTH} from "device";
import {GETREPORT,ADDREP,GETVEL} from "inter";
Vue.use(VueResource);
window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('getBase');
    const NUMBER = getN('getAutoCheckNumber');
    const WIFI = getN('wifi');
    // WIFI.wangfan=0;
    // NUMBER.number='111';
    var fnObj = {
        "isWifi":WIFI.wangfan,
        // "isWaiting":false,
        "flag_num":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
        "flag_sn":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
        "flag_wifi":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
        "flag_portal":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
        "flag_compass":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
        "getDetail":{
            "ctime":"",
            "plate_num":"",
            "plate_sn":"",
            "protal":"",
            "compass":"",
            "wifi":"",
            "status":"",
            // "hasNumber":false
        }

    };
    Vue.filter('ymdhms',str=>{
        str=str == undefined?'':dataFormat((str*1000),'YYYY-MM-dd hh:mm:ss');
        return str;
    });
    new Vue({
        el: "#deviceSelf",
        data:fnObj,
        mounted(){
            // var _this=this,plate_sn='';
            // NUMBER.isChecked=1;
            ////////////////////////////////////////////////////////////////////////////

           /* var content_1={
                "type":2,
                "ctime":1493696554278,
                "plate_num":"湘LA4211",
                "plate_sn":'604694',
                "wifi":1,
                "portal":0,
                "compass":0
            };
            fetch(`${BASEINFO.host}${ADDREP}`,{
                method:"POST",
                mode: "cors",
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: querystring.stringify({
                    uid: 1,
                    access_token: BASEINFO.access_token,
                    plate_num: '湘LA4211',
                    content: JSON.stringify(content_1),
                    type: 2
                })
            })
                .then(response=>response.json())
                .then(data=>{
                    console.log(data);
                    // console.log('send');

                })
                .catch(e=>console.log(e));*/
            //////////////////////////////////////////////////////////////




            if(NUMBER.isChecked==1){
                if(NUMBER.number){
                    // this.isWaiting=true;
                    this.flag_num=3;this.flag_sn=3;this.flag_wifi=3;this.flag_portal=3;this.flag_compass=3;
                    fetch( `${BASEINFO.host}${GETREPORT}?number=${NUMBER.number}&access_token=${BASEINFO.access_token}`,{
                        cache:"no-cache"
                    })
                        .then(response=>response.json())
                        .then(data=>{
                            // this.isWaiting=false;

                            var result=data.data;
                            if(data.code==0){
                                this.getDetail= JSON.parse( result.content );
                                this.getDetail.ctime=result.ctime;
                                // this.getDetail.hasNumber=true;
                                this.flag_num=this.getDetail.plate_num?2:1;
                                this.flag_sn=this.getDetail.plate_sn?2:1;
                                this.flag_wifi=this.getDetail.wifi?2:1;
                                this.flag_portal=this.getDetail.portal?2:1;
                                this.flag_compass=this.getDetail.compass?2:1;
                                this.getDetail.status=result.status;
                            }else{
                                this.isIcon();
                                callN('msg',{
                                    content:data.message
                                })
                            }
                        })
                        .catch(e=>{
                            console.log(e);
                            // this.isWaiting=false;
                            this.isIcon();
                            callN('msg',{
                                content: errcode.m404
                            })
                        })
                }else{
                    if(this.isWifi==1){
                        // this.isWaiting=true;
                        // this.getDetail.hasNumber=false; // 1改
                        this.flag_num=3;this.flag_sn=3;this.flag_wifi=3;this.flag_portal=3;this.flag_compass=3;
                        this.getSN()
                            .then((plate_sn)=>{
                                // this.isWaiting=false;
                                // this.getDetail.hasNumber=true;// 1改
                                // NUMBER.plate_sn='6010306';
                                if(plate_sn==NUMBER.plate_sn){
                                    // NUMBER.ctime=1492600167612;
                                    // this.isWaiting=true;
                                    this.getDetail.ctime=NUMBER.ctime;
                                    this.getDetail.plate_sn=plate_sn;
                                    this.getPlateNum();
                                    this.getDetail.wifi=1;
                                    this.getDetail.portal=1;
                                    this.getDetail.compass=1;
                                    this.flag_wifi=this.getDetail.wifi?2:1;
                                    this.flag_portal=this.getDetail.portal?2:1;
                                    this.flag_compass=this.getDetail.compass?2:1;
                                }else{
                                    this.getDetail.plate_sn='';
                                    this.getDetail.ctime='';
                                    this.noCheck();
                                }
                            }).catch(e=>{
                                console.log(e);
                                // this.isWaiting=false;
                                this.isIcon();
                                callN('msg',{
                                    content: errcode.device
                                })
                            })
                    }else{

                        // this.getDetail.hasNumber=false;
                        callN('msg',{
                            content: errcode.deviceCheck
                        })
                    }

                }
            }else{
                this.noCheck();
            }
        },
        methods:{
            getSN(){
                return this.$http.get(URL_GETINFO,{timeout:10000})
                    .then(response=>response.json())
                    .then(data=>{
                        this.getDetail.plate_sn=data.deviceSN;
                        this.flag_sn=this.getDetail.plate_sn?2:1;
                        this.getDetail.plate_num='';
                        // this.getDetail.ctime=parseInt(Date.now()/1000);
                        return data.deviceSN;
                    })
            },
            selfCheck(){
                // this.isWaiting=true;
                //html页面有判断
                /*if(this.isWifi==0){
                    callN('msg',{content:errcode.deviceCheck});
                    this.isWaiting=false;
                    return
                }*/
                this.getDetail.ctime=parseInt(Date.now()/1000);
                this.flag_num=3;this.flag_sn=3;this.flag_wifi=3;this.flag_portal=3;this.flag_compass=3;
                this.getDetail.plate_num='';
                this.getDetail.plate_sn='';
                this.getDetail.wifi='';
                this.getDetail.portal='';
                this.getDetail.compass='';
                //获取设备sn
                this.getSN().then(this.getPlateNum)
                    .then(()=>{
                        // this.isWaiting=true;
                        return this.getHealth();
                    })
                    .then(()=>{
                    // this.getDetail.hasNumber=true;
                    if(!this.getDetail.plate_num || !this.getDetail.plate_sn || this.getDetail.wifi!=1 || this.getDetail.portal!=1 || this.getDetail.compass!=1){
                            var content={
                                    "ctime":this.getDetail.ctime,
                                    "plate_num":this.getDetail.plate_num,
                                    "plate_sn":this.getDetail.plate_sn,
                                    "wifi":this.getDetail.wifi,
                                    "portal":this.getDetail.portal,
                                    "compass":this.getDetail.compass
                            };
                            fetch(`${BASEINFO.host}${ADDREP}`,{
                                method:"POST",
                                mode: "cors",
                                headers:{
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                body: querystring.stringify({
                                    uid: BASEINFO.uid,
                                    access_token: BASEINFO.access_token,
                                    plate_num: this.getDetail.plate_num,
                                    content: JSON.stringify(content),
                                    type: 1
                                })
                            })
                                .then(response=>response.json())
                                .then(data=>{
                                    var param=data.data;
                                    callN('sendCheckNumber',param);
                                })
                                .catch(e=>console.log(e));
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        // this.isWaiting=false;
                        this.isIcon();
                        callN('msg',{
                            content: errcode.m404
                        })
                    });

                this.getDetail.status='';
            },
            getPlateNum(){
                //根据sn获取车牌号
                return fetch(`${BASEINFO.host}${GETVEL}?equ_sn=${this.getDetail.plate_sn}&access_token=${BASEINFO.access_token}`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        // this.isWaiting=false;
                        if(data.code==0){
                            this.getDetail.plate_num=data.data.plate_num;
                            this.flag_num=this.getDetail.plate_num?2:1;
                        }else{
                            this.flag_num=this.getDetail.plate_num?2:1;
                            callN('msg',{
                                content:data.message
                            })
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.flag_num=this.getDetail.plate_num?2:1;
                        callN('msg',{
                            content: errcode.m404
                        })
                    })
            },
            getHealth(){
                //获取设备检测详情
                return this.$http.get(URL_HEALTH,{timeout:10000},{
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                    .then(response=>response.json())
                    .then(data=>{
                        // callN('msg',{content:data});
                        // this.isWaiting=false;
                        this.getDetail.compass=data.Compass=="OK"?'1':'0';
                        this.getDetail.wifi=data.WIFI=="OK"?'1':'0';
                        this.getDetail.portal=data.Portal=="OK"?'1':'0';
                        this.flag_wifi=this.getDetail.wifi?2:1;
                        this.flag_portal=this.getDetail.portal?2:1;
                        this.flag_compass=this.getDetail.compass?2:1;
                    })
            },
            noCheck(){
                // this.getDetail.hasNumber=false;//置空
                // this.flag_num=0;
                // this.flag_sn=0;
                // this.flag_wifi=0;
                // this.flag_portal=0;
                // this.flag_compass=0;
                this.isIcon();
                // this.getDetail.ctime=new Date().getTime();
                callN('msg',{content: errcode.deviceNoCheck});
            },
            isIcon(){
                this.flag_num=0;
                this.flag_sn=0;
                this.flag_wifi=0;
                this.flag_portal=0;
                this.flag_compass=0;
            }
        },
        components: {
            commonTop,
            // msg,
            loading
        }
    });




},false);
