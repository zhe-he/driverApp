const querystring = require('querystring');
import "css/checkIn.scss";
import Vue from "vue";
import commonTop from "common-top";
import {getN,callN} from 'nativeA';
import {dataFormat} from 'method';

Vue.filter('yearMonth',time=>dataFormat(time,'YYYY年MM月'));
window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('getBase');

    new Vue({
        el: "#checkIn",
        data: {
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
            /*monthDays(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth()+1,0);
                return d.getDate();
            },*/
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
            setCheckIn(){
                fetch(`${BASEINFO.host}/app-dms/driver/getUserInfo?uid=${BASEINFO.uid}`,{
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
                let json = {
                    "uid": BASEINFO.uid,
                    "month": dataFormat(this.curTime,'YYYY-MM')
                };
                const url = `${BASEINFO.host}/app-dms/sign/top?${querystring.stringify(json)}`;
                fetch(url,{
                    "cache": "no-cache"
                })
                    .then(response=>response.json())
                    .then(message=>{
                        if (message.code == 0) {
                            this.checkList = message.data;
                        }
                    })
                    .catch(e=>console.log(e));
            },
            checkInLogin(){
                if(this.isCheckIn){
                    return ;
                }
                callN('autoCheckIn');
                fetch(`${BASEINFO.host}/app-dms/sign/add`,{
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
                        if (message.code==0) {
                            this.checkInError = false;
                            this.isCheckIn = true;
                            let d = new Date();

                            this.checkList[d.getDate()-1] = {
                                data: dataFormat(d.getTime(),'YYYY-MM-DD'),
                                type: 2,
                            }
                        }else{
                            this.checkInError = true;
                        }
                    })
                    .catch(e=>console.log(e));
            }
        },
        components: {
            commonTop
        }
    });
},false);