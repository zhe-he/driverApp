const querystring = require('querystring');
import "css/busDetail.scss";
import Vue from "vue";
import commonTop from "common-top";
import {getN} from "nativeA";
import {URL_GETINFO} from "device";


window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('baseInfo');
    new Vue({
        el: "#busDetail",
        data: {
            plate_num: '',  // 车牌号
            license_img: '',    // 行驶证
            equ_sn: '',         // 设备sn
            equ_mac: ''         // 设备mac
        },
        mounted(){
            this.getEqu().then(this.getBus).catch(e=>console.log(e));
        },
        methods: {
            // 获取设备信息
            getEqu(){
                return fetch(URL_GETINFO,{
                    cache: 'no-cache'
                })
                    .then(response=>response.json())
                    .then(data=>{
                        this.equ_sn = data.deviceSN;
                        this.equ_mac = data.deviceMac;
                    });
            },
            // 获取车辆信息
            getBus(){
                return fetch(BASEINFO.host+'/app-dms/vehicle/getVelByField',{
                    method: "POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: querystring.stringify({
                        equ_sn: this.equ_sn,
                        equ_mac: this.equ_mac
                    })
                })
                    .then(response=>response.json())
                    .then(message=>{
                        if (message.code===0) {
                            this.plate_num = message.data.plate_num;
                            this.license_img = message.data.mdriving_license_img;
                        }
                    })
                    .catch(e=>console.log(e));
            }
        },
        components: {
            commonTop
        }
    })
},false);