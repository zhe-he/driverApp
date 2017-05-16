/**
 * Created by yangshuang on 2017/3/31.
 * 1. 向APP获取今天是否进行过自检   
 * > 1.1 如果没有，提示errcode.deviceNoCheck  
 * > 1.2 如果有进行过自检，向APP获取是否有自检单号    
 * > 1.2.1 如果没有自检单号，向APP获取当前是否连接了往返wifi  
 * > 1.2.1.1 如果没有连接往返wifi，提示errcode.deviceCheck    
 * > 1.2.1.2 如果连接了往返wifi，通过设备接口获取设备sn，判断当前获取的sn和app上次自检返回的sn是否一致   
 * > 1.2.1.2.1 如果一致，除了车牌号其他全部打对勾，车牌号通过接口获取   
 * > 1.2.1.2.2 如果不一致，程序自动进行设备自检     
 * > 1.2.2 如果有自检单号，通过后台获取信息显示到页面上（已报修/已处理）  
 * > 1.2.2.1 如果已处理，页面显示刷新按钮，点击刷新 设备自检一次     
 * > 1.2.2.1.1 如果请求失败或服务器返回错误，可以继续点击    
 * > 1.2.2.1.2 如果请求成功，刷新按钮隐藏    
 *
 * - 只要是进行了自检，都必须传给APP->是否自检过，单号
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
    var fnObj = {
        "isWifi":WIFI.wangfan,
        // "isWaiting":false,
        "flag_num":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
        "flag_sn":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
        "flag_wifi":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
        "flag_portal":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
        "flag_compass":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
        "flag_4G":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
        "getDetail":{
            "ctime":"",
            "plate_num":"",
            "plate_sn":"",
            "protal":"",
            "compass":"",
            "wifi":"",
            "_4G":"",
            "status":"",
            "status_flag":""
        },
        "selfChecking": false // 设备自检中 

    };
    Vue.filter('ymdhms',str=>{
        str=str == undefined?'':dataFormat((str*1000),'YYYY-MM-dd hh:mm:ss');
        return str;
    });
    new Vue({
        el: "#deviceSelf",
        data:fnObj,
        mounted(){

            if(NUMBER.isChecked==1){
                if(NUMBER.number){
                    // this.isWaiting=true;
                    this.flag_num=3;this.flag_sn=3;this.flag_wifi=3;this.flag_portal=3;this.flag_compass=3;this.flag_4G=3;
                    fetch( `${BASEINFO.host}${GETREPORT}?number=${NUMBER.number}&access_token=${BASEINFO.access_token}&format=json`,{
                        cache:"no-cache"
                    })
                        .then(response=>response.json())
                        .then(data=>{
                            // this.isWaiting=false;

                            var result=data.data;
                            if(data.code==0){
                                let data=typeof (result.content)=='string'?JSON.parse( result.content ):result.content;
                                this.getDetail.compass=data.Compass.toString().trim().toUpperCase()=="OK"?'1':data.Compass;
                                this.getDetail.wifi=data.WIFI.toString().trim().toUpperCase()=="OK"?'1':data.WIFI;
                                this.getDetail.portal=data.Portal.toString().trim().toUpperCase()=="OK"?'1':data.Portal;
                                this.getDetail._4G=data['4G'].toString().trim().toUpperCase()=="OK"?'1':data['4G'];
                                this.getDetail.plate_num=data.plate_num;
                                this.getDetail.plate_sn=data.plate_sn;
                                this.getDetail.ctime=result.ctime;
                                this.flag_num=this.getDetail.plate_num?2:1;
                                this.flag_sn=this.getDetail.plate_sn?2:1;
                                this.flag_wifi=this.getDetail.wifi==1?2:1;
                                this.flag_portal=this.getDetail.portal==1?2:1;
                                this.flag_compass=this.getDetail.compass==1?2:1;
                                this.flag_4G=this.getDetail._4G==1?2:1;
                                this.getDetail.status=result.status;
                                this.getDetail.status_flag=result.status;
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
                        this.flag_num=3;this.flag_sn=3;this.flag_wifi=3;this.flag_portal=3;this.flag_compass=3;this.flag_4G=3;
                        this.getSN()
                            .then((plate_sn)=>{
                                // this.isWaiting=false;
                                if(plate_sn==NUMBER.plate_sn){
                                    // this.isWaiting=true;
                                    this.getDetail.ctime=NUMBER.ctime;
                                    this.getDetail.plate_sn=plate_sn;
                                    this.getPlateNum();
                                    this.getDetail.wifi=1;
                                    this.getDetail.portal=1;
                                    this.getDetail.compass=1;
                                    this.getDetail._4G=1;
                                    this.flag_wifi=this.getDetail.wifi==1?2:1;
                                    this.flag_portal=this.getDetail.portal==1?2:1;
                                    this.flag_compass=this.getDetail.compass==1?2:1;
                                    this.flag_4G=this.getDetail._4G==1?2:1;
                                }else{
                                    this.isIcon();
                                    this.selfCheck();
                                }
                            }).catch(e=>{
                                console.log(e);
                                // this.isWaiting=false;
                                this.isIcon();
                                callN('msg',{content: errcode.device})
                            })
                    }else{

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
                        this.getDetail.plate_sn=data.deviceSN || data.deviceID;
                        this.flag_sn=this.getDetail.plate_sn?2:1;
                        this.getDetail.plate_num='';
                        return data.deviceSN;
                    })
            },
            selfCheck(){
                if (this.selfChecking) {
                    return ;
                }
                this.selfChecking = true;
                // this.isWaiting=true;
                this.getDetail.ctime=parseInt(Date.now()/1000);
                this.flag_num=3;this.flag_sn=3;this.flag_wifi=3;this.flag_portal=3;this.flag_compass=3;this.flag_4G=3;
                this.getDetail.plate_num='';
                this.getDetail.plate_sn='';
                this.getDetail.wifi='';
                this.getDetail.portal='';
                this.getDetail.compass='';
                this.getDetail._4G='';
                this.getDetail.status='';
                
                //获取设备sn
                this.getSN().then(this.getPlateNum)
                    .then(()=>{
                        // this.isWaiting=true;
                        return this.getHealth();
                    })
                    .then(()=>{
                        this.selfChecking = false;
                        if(!this.getDetail.plate_num || !this.getDetail.plate_sn || this.getDetail.wifi!=1 || this.getDetail.portal!=1 || this.getDetail.compass!=1|| this.getDetail._4G!=1){
                            var content={
                                    "ctime":this.getDetail.ctime,
                                    "plate_num":this.getDetail.plate_num,
                                    "plate_sn":this.getDetail.plate_sn,
                                    "WIFI":this.getDetail.wifi==1?'OK':this.getDetail.wifi,
                                    "Portal":this.getDetail.portal==1?'OK':this.getDetail.portal,
                                    "4G":this.getDetail._4G==1?'OK':this.getDetail._4G,
                                    "Compass":this.getDetail.compass==1?'OK':this.getDetail.compass
                            };

                            fetch(`${BASEINFO.host}${ADDREP}`,{
                                method:"POST",
                                mode: "cors",
                                headers:{
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                body: querystring.stringify({
                                    format: "json",
                                    token: BASEINFO.token,
                                    uid: BASEINFO.uid,
                                    access_token: BASEINFO.access_token,
                                    plate_num: this.getDetail.plate_num,
                                    content: JSON.stringify(content),
                                    type: 1
                                })
                            })
                                .then(response=>response.json())
                                .then(data=>{
                                    if(data.code==0){
                                        this.getDetail.status=1;
                                        this.getDetail.status_flag=1;
                                        let param=data.data;
                                        param.isChecked=1;
                                        param.plate_sn=this.getDetail.plate_sn;
                                        callN('sendCheckNumber',param);
                                    }else{
                                        this.getDetail.status='';
                                        this.getDetail.status_flag=2;
                                    }

                                })
                                .catch(e=>{
                                    this.getDetail.status_flag=2;
                                    console.log(e);
                                    callN('msg',{content: errcode.m404});
                                });
                        }else{
                            this.getDetail.status_flag=1;
                            let param={
                                "isChecked":1,
                                "number": "",
                                "ctime": Date.now(),
                                "plate_sn":this.getDetail.plate_sn
                            };
                            callN('sendCheckNumber',param);
                        }
                    })
                    .catch(e=>{
                        this.selfChecking = false;
                        // this.getDetail.status_flag=2;
                        console.log(e);
                        // this.isWaiting=false;
                        this.isIcon();
                        callN('msg',{content: errcode.m404});
                    });

            },
            getPlateNum(){
                //根据sn获取车牌号
                return fetch(`${BASEINFO.host}${GETVEL}?equ_sn=${this.getDetail.plate_sn}&access_token=${BASEINFO.access_token}&format=json`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        // this.isWaiting=false;
                        if(data.code==0){
                            this.getDetail.plate_num=data.data.plate_num;
                            this.flag_num=this.getDetail.plate_num?2:1;
                        }else{
                            this.flag_num=1;
                            callN('msg',{
                                content:data.message
                            })
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.flag_num=1;
                        // this.getDetail.status_flag=2;
                        callN('msg',{content: errcode.m404})
                    });
            },
            getHealth(){
                //获取设备检测详情
                return this.$http.get(URL_HEALTH,{timeout:20000},{
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                    .then(response=>response.json())
                    .then(data=>{
                        // this.isWaiting=false;
                        this.getDetail.compass=data.Compass.toString().trim().toUpperCase()=="OK"?'1':data.Compass;
                        this.getDetail.wifi=data.WIFI.toString().trim().toUpperCase()=="OK"?'1':data.WIFI;
                        this.getDetail.portal=data.Portal.toString().trim().toUpperCase()=="OK"?'1':data.Portal;
                        this.getDetail._4G=data['4G'].toString().trim().toUpperCase()=="OK"?'1':data['4G'];
                        this.flag_wifi=this.getDetail.wifi==1?2:1;
                        this.flag_portal=this.getDetail.portal==1?2:1;
                        this.flag_compass=this.getDetail.compass==1?2:1;
                        this.flag_4G=this.getDetail._4G==1?2:1;
                    })
            },
            noCheck(){
                this.isIcon();
                callN('msg',{content: errcode.deviceNoCheck});
            },
            isIcon(){
                this.flag_num=0;
                this.flag_sn=0;
                this.flag_wifi=0;
                this.flag_portal=0;
                this.flag_compass=0;
                this.flag_4G=0;
            }
        },
        components: {
            commonTop,
            loading
        }
    });




},false);
