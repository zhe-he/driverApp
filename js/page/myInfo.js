import "css/credentials.scss";

import Vue from "vue";

window.addEventListener("DOMContentLoaded",()=>{
    new Vue({
        el: "#myInfo",
        data: {
            company: '宇通客车',
            driverName: '张三',
            driverTel: '15000000000',
            driverNumber: '111111',
            driverPic: '../images/tmp/zhengjian4.png'
        },
        mounted(){

        },
        methods: {
        }
    })
},false);
