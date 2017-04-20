const querystring = require('querystring');

import "css/bus.scss";
import Vue from "vue";
import commonTop from "common-top";
import loading from "loading";
import {getN} from "nativeA";
import {URL_GETINFO,URL_USERS,URL_GPS} from "device";

window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('baseInfo');
    var map,CONVERTOR;
    new Vue({
        el: "#bus",
        data: {
            isWaiting: true,
            equ_sn: "",     // 设备sn
            equ_mac: "",    // 设备mac
            plate_num: "",  // 车牌号
            connect_num: " ", // 当前连接用户人数
            gpsList: []     // 行驶轨迹             
        },
        watch: {
            gpsList: {
                handler(val){
                    map.clearOverlays();
                    var point = new BMap.Point(val[0].lng, val[0].lat);
                    var marker = new BMap.Marker(point); 
                    map.addOverlay(marker);
                    map.centerAndZoom(point,14);
                },
                deep: true
            }
        },
        mounted(){
            this.getEqu().then(this.getBus).catch(e=>{
                console.log(e);
                this.isWaiting = false;
            });
            this.getUserstats();
            this.$nextTick(()=>{
                this.mapInit();

                this.getGpsList();
                setInterval(()=>{
                    this.getGpsList();
                },1000*60);
            });
        },
        methods: {
            // 获取行驶轨迹
            getGpsList(){
                fetch(URL_GPS,{
                    cache: "no-cache"
                })
                    .then(response=>response.json())
                    .then(message=>{
                        this.gpsList = [{
                            lat: message.lat,
                            lng: message.lon
                        }]
                    })
                    .catch(e=>console.log(e));
            },
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
                        this.isWaiting = false;
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
                map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
                CONVERTOR = new BMap.Convertor(); // 实际坐标转换百度坐标对象
            }
        },
        components: {
            commonTop,
            loading
        }
    })
},false);