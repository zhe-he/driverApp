import "css/checkIn.scss";
import Vue from "vue";
import commonTop from "common-top";
import {dataFormat} from 'method';

Vue.filter('yearMonth',time=>dataFormat(time,'YYYY年MM月'));
Vue.filter('plus',number=>number>0?number:'');
window.addEventListener("DOMContentLoaded",()=>{

    new Vue({
        el: "#checkIn",
        data: {
            curTime: Date.now(),
            checkInError: false,
            isCheckIn: false
        },
        computed: {
            tempDays(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth(),1);
                return d.getDay();
            },
            monthDays(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth()+1,0);
                return d.getDate();
            },
            curDate(){
                let d = new Date();
                return d.getDate();
            }
        },
        methods: {
            preMonth(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth()-1,1);
                this.curTime = d.getTime();
            },
            nextMonth(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth()+1,1);
                this.curTime = d.getTime();
            },
            checkInLogin(){
                if(this.isCheckIn){
                    return ;
                }
                if (Math.random()<0.5) {
                    this.checkInError = true;
                }else{
                    this.checkInError = false;
                    this.isCheckIn = true;
                }
            }
        },
        components: {
            commonTop
        }
    });
},false);