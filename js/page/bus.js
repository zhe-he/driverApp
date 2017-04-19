const querystring = require('querystring');

import "css/bus.scss";
import Vue from "vue";
import commonTop from "common-top";
import {getN} from "nativeA";
import {URL_GETINFO,URL_USERS,URL_GPS} from "device";

window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('baseInfo');
    var map;
    new Vue({
        el: "#bus",
        data: {
            equ_sn: "",     // 设备sn
            equ_mac: "",    // 设备mac
            plate_num: "",  // 车牌号
            connect_num: " ", // 当前连接用户人数
            gpsList: []     // 行驶轨迹             
        },
        mounted(){
            this.getEqu().then(this.getBus).catch(e=>console.log(e));
            this.getUserstats();
            this.$nextTick(()=>{
                this.mapInit();
            });
        },
        methods: {
            // 获取当前连接用户
            getUserstats(){
                fetch(URL_USERS,{
                    cache: 'no-cache'
                })
                    .then(response=>response.json())
                    .then(data=>{
                        this.connect_num = data.now;
                    })
                    .catch(e=>console.log(e));
            },
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
                        }
                    })
                    .catch(e=>console.log(e));
            },
            // 获取经纬度
            getGps(){
                fetch(URL_GPS,{
                    cache: "no-cache"
                })
                    .then(response=>response.json)
                    .then(message=>{

                    })
                    .catch(e=>console.log(e));
            },
            mapInit(){
                map = new BMap.Map("car-map");    // 创建Map实例
                map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
                map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
                map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
                map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            }
        },
        components: {
            commonTop
        }
    })
},false);