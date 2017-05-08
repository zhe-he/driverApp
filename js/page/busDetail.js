const querystring = require('querystring');
import "css/busDetail.scss";
import Vue from "vue";
import VueResource from "vue-resource";
import errcode from "errcode";
import commonTop from "common-top";
import {getN, callN} from "nativeA";
import {URL_GETINFO} from "device";
import {GETVEL} from "inter";
import loading from "loading";

Vue.use(VueResource);
window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('getBase');
    const WIFI = getN('wifi');
    new Vue({
        el: "#busDetail",
        data: {
            isWaiting: false,
            plate_num: '',  // 车牌号
            license_img: '',    // 行驶证
            equ_sn: '',         // 设备sn
            equ_mac: ''         // 设备mac
        },
        mounted(){
            if (WIFI.wangfan != 1) {
                callN("msg",{"content": errcode.device});
                return false;
            }

            this.isWaiting = true;
            this.getEqu().then(this.getBus).catch(e=>{
                this.isWaiting = false;
                console.log(e);
                callN("msg",{"content":errcode.m404});
            });
        },
        methods: {
            // 获取设备信息
            getEqu(){
                return this.$http.get(URL_GETINFO,{timeout: 10000})
                    .then(response=>response.json())
                    .then(data=>{
                        this.equ_sn = data.deviceSN;
                        this.equ_mac = data.deviceMac;
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
                        access_token:BASEINFO.access_token
                    })
                })
                    .then(response=>response.json())
                    .then(message=>{
                        this.isWaiting = false;
                        if (message.code==0) {
                            this.plate_num = message.data.plate_num;
                            this.license_img = message.data.mdriving_license_img;
                        }else{
                            callN("msg",{"content":message.message});
                        }
                    });
            }
        },
        components: {
            commonTop,
            loading
        }
    })
},false);