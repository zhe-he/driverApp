/*
 * 1. 获取当月签到的记录，判断用户今天是否能签到
 * 1. 点击签到后，告知客户端走自动签到逻辑
 * 1. 没有连接往返wifi无法签到
 * 1. 签到所需车牌号通过设备接口sn->后台接口获取
 */

const querystring = require('querystring');
import "css/checkIn.scss";
import Vue from "vue";
import VueResource from "vue-resource";
import errcode from "errcode";
import commonTop from "common-top";
import {getN,callN} from 'nativeA';
import {dataFormat} from 'method';
import {URL_GETINFO} from 'device';
import {USERINFO,SIGNTOP,ADDSIGN,GETVEL} from 'inter';
import loading from "loading";

Vue.use(VueResource);
Vue.filter('yearMonth',time=>dataFormat(time,'YYYY年MM月'));
window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('getBase');
    const WIFI = getN('wifi');

    new Vue({
        el: "#checkIn",
        data: {
            isWaiting: false,
            curTime: Date.now(),    // 当前选择时间
            checkInError: false,    // 签到失败
            isCheckIn: true,       // 当天是否签到
            plate_num: '',          // 车牌号 
            equ_sn: '',
            equ_mac: '',
            checkList: []   // 当月签到集合
        },
        computed: {
            tempDays(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth(),1);
                return d.getDay();
            },
            curDate(){
                let d = new Date();
                let c = new Date(this.curTime);
                if(d.getFullYear()==c.getFullYear() && d.getMonth()==c.getMonth()){
                    return d.getDate();
                }else{
                    return 99999;
                }
            }
        },
        mounted(){
            this.setCheckList();
            this.setCheckIn();

            if (WIFI.wangfan == 1) {
                this.getEqu().then(this.getBus).catch(e=>{
                    console.log(e);
                    callN("msg",{"content":errcode.m404});
                });
            }
            
        },
        methods: {
            preMonth(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth()-1,1);
                this.curTime = d.getTime();
                this.setCheckList();
            },
            nextMonth(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth()+1,1);
                this.curTime = d.getTime();
                this.setCheckList();
            },
            setDefaultCheckList(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth()+1,0);
                let monthDays = d.getDate();
                let arr = [];
                for(var i = 0; i < monthDays; i++){
                    arr[i] = {};
                }
                this.checkList = arr;
            },
            setCheckIn(){
                fetch(`${BASEINFO.host}${USERINFO}?uid=${BASEINFO.uid}&access_token=${BASEINFO.access_token}&format=json`,{
                    cache: "no-cache"
                })
                    .then(response=>response.json())
                    .then(message=>{
                        if (message.code==0) {
                            if (message.data.last_sign_time && 
                                dataFormat(message.data.last_sign_time*1000,'YYYY-MM-DD') == dataFormat(Date.now(),'YYYY-MM-DD')) {
                                this.isCheckIn = true;
                            }else{
                                this.isCheckIn = false;
                            }
                        }
                    })
            },
            setCheckList(){
                this.setDefaultCheckList();

                let json = {
                    "format": "json",
                    "uid": BASEINFO.uid,
                    "month": dataFormat(this.curTime,'YYYY-MM'),
                    "access_token": BASEINFO.access_token
                };
                this.isWaiting = true;
                const url = `${BASEINFO.host}${SIGNTOP}?${querystring.stringify(json)}`;
                fetch(url,{
                    "cache": "no-cache"
                })
                    .then(response=>response.json())
                    .then(message=>{
                        this.isWaiting = false;
                        if (message.code == 0) {
                            this.checkList = message.data;
                        }else{
                            callN("msg",{"content":message.message});
                        }
                    })
                    .catch(e=>{
                        this.isWaiting = false;
                        console.log(e);
                        callN("msg",{"content":errcode.m404});
                    });
            },
            checkInLogin(){
                if(this.isCheckIn){
                    return ;
                }
                if (WIFI.wangfan !== 1) {
                    callN("msg",{"content": errcode.checkinWiFi});
                    return ;
                }
                if (!this.plate_num) {
                    callN("msg",{"content": errcode.checkinNum});
                    return ;
                }

                callN('autoCheckIn');
                this.isWaiting = true;
                fetch(`${BASEINFO.host}${ADDSIGN}`,{
                    method: "POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: querystring.stringify({
                        format: "json",
                        token: BASEINFO.token,
                        uid: BASEINFO.uid,
                        plate_num: this.plate_num,
                        type: 2,
                        access_token: BASEINFO.access_token
                    })
                })
                    .then(response=>response.json())
                    .then(message=>{
                        this.isWaiting = false;
                        if (message.code==0) {
                            this.checkInError = false;
                            this.isCheckIn = true;

                            if (dataFormat(this.curTime,'YYYY-MM') == dataFormat(Date.now(),'YYYY-MM')) {
                                let d = new Date();
                                this.checkList[d.getDate()-1] = {
                                    data: dataFormat(d.getTime(),'YYYY-MM-DD'),
                                    type: 2
                                }
                            }

                            callN("msg",{"content": errcode.checkinManual});
                        }else{
                            this.checkInError = true;
                            callN("msg",{"content":message.message});
                        }
                    })
                    .catch(e=>{
                        this.isWaiting = false;
                        console.log(e);
                        callN("msg",{"content": errcode.m404});
                    });
            },
            // 获取车辆信息
            getBus(){
                return fetch(`${BASEINFO.host}${GETVEL}`,{
                    method: "POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: querystring.stringify({
                        format: "json",
                        equ_sn: this.equ_sn,
                        equ_mac: this.equ_mac,
                        access_token: BASEINFO.access_token
                    })
                })
                    .then(response=>response.json())
                    .then(message=>{
                        if (message.code==0) {
                            this.plate_num = message.data.plate_num;
                        }else{
                            callN("msg",{"content":message.message});
                        }
                    });
            },
            getEqu(){
                return this.$http.get(URL_GETINFO,{timeout:10000})
                    .then(response=>response.json())
                    .then(data=>{
                        this.equ_sn = data.deviceSN;
                        this.equ_mac = data.deviceMac;
                    });
            },
        },
        components: {
            commonTop,
            loading
        }
    });
},false);