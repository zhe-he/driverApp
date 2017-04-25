const querystring = require('querystring');
import "css/checkIn.scss";
import Vue from "vue";
import errcode from "errcode";
import commonTop from "common-top";
import {getN,callN} from 'nativeA';
import {dataFormat} from 'method';
import {USERINFO,SIGNTOP,ADDSIGN} from 'inter';
import loading from "loading";

Vue.filter('yearMonth',time=>dataFormat(time,'YYYY年MM月'));
window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('getBase');

    new Vue({
        el: "#checkIn",
        data: {
            isWaiting: false,
            curTime: Date.now(),    // 当前选择时间
            checkInError: false,    // 签到失败
            isCheckIn: true,       // 当天是否签到
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
                fetch(`${USERINFO}?uid=${BASEINFO.uid}`,{
                    cache: "no-cache"
                })
                    .then(response=>response.json())
                    .then(message=>{
                        if (message.code==0) {

                            if (message.data.last_sign_time && 
                                dataFormat(message.data.last_sign_time,'YYYY-MM-DD') == dataFormat(Date.now(),'YYYY-MM-DD')) {
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
                    "uid": BASEINFO.uid,
                    "month": dataFormat(this.curTime,'YYYY-MM')
                };
                this.isWaiting = true;
                const url = `${SIGNTOP}?${querystring.stringify(json)}`;
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
                callN('autoCheckIn');
                this.isWaiting = true;
                fetch(ADDSIGN,{
                    method: "POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: querystring.stringify({
                        uid: BASEINFO.uid,
                        type: 2
                    })
                })
                    .then(response=>response.json())
                    .then(message=>{
                        this.isWaiting = false;
                        if (message.code==0) {
                            callN("msg",{"content": errcode.manual});
                            this.checkInError = false;
                            this.isCheckIn = true;
                            let d = new Date();

                            this.checkList[d.getDate()-1] = {
                                data: dataFormat(d.getTime(),'YYYY-MM-DD'),
                                type: 2
                            }
                        }else{
                            callN("msg",{"content":message.message});
                            this.checkInError = true;
                        }
                    })
                    .catch(e=>{
                        this.isWaiting = false;
                        console.log(e);
                        callN("msg",{"content": errcode.m404});
                    });
            }
        },
        components: {
            commonTop,
            loading
        }
    });
},false);