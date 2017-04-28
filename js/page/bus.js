/**
 * 1. 检测是否处在往返wifi下，如果不是，弹窗提示
 * 1. 获取设备sn，通过sn获取当前车牌号
 * 1. 获取目前车内上网用户
 * 1. 每分钟获取设备的经纬度，转换成百度坐标打点地图
 */


const querystring = require('querystring');

import "css/bus.scss";
import Vue from "vue";
import VueResource from "vue-resource";
import errcode from "errcode";
import commonTop from "common-top";
import loading from "loading";
import {getN,callN} from "nativeA";
import {URL_GETINFO,URL_USERS,URL_GPS} from "device";
import {GETVEL} from "inter";

Vue.use(VueResource);
window.addEventListener("DOMContentLoaded",()=>{
    var map,CONVERTOR;
    const WIFI = getN('wifi');
    new Vue({
        el: "#bus",
        data: {
            isWaiting: false,
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
                    let ggPoint = new BMap.Point(val[0].lng, val[0].lat);
                    let pointArr = [];
                    pointArr.push(ggPoint);
                    CONVERTOR.translate(pointArr,1,5,data=>{
                        
                        if (data.status==0) {
                            ggPoint = data.points[0];
                        }
                        let marker = new BMap.Marker(ggPoint);
                        map.addOverlay(marker);
                        // map.setCenter(ggPoint,14);
                        map.centerAndZoom(ggPoint,14);
                    });
                },
                deep: true
            }
        },
        mounted(){

            if (WIFI.wangfan != 1) {
                callN("msg", {"content": errcode.device});
                this.$nextTick(this.mapInit);
                return false;
            }
            this.isWaiting = true;
            this.getEqu().then(this.getBus).catch(e=>{
                this.isWaiting = false;
                console.log(e);
                callN("msg",{"content":errcode.m404});
            });
            
            this.getUserstats();
            this.$nextTick(()=>{
                this.mapInit();

                this.getGpsList();
                setInterval(()=>{
                    this.getGpsList();
                    this.getUserstats();
                },1000*60);
            });
        },
        methods: {
            // 获取行驶轨迹 经纬度
            getGpsList(){
                this.$http.get(URL_GPS,{timeout: 10000},{
                    headers: {
                        "cache-control": "no-cache"
                    }
                })
                    .then(response=>response.json())
                    .then(data=>{
                        // 暂不支持多点
                        if (!data.lat || !data.lon) {
                            callN("msg",{"content":errcode.deviceGPS});
                        }else{
                            this.gpsList = [{
                                lat: data.lat,
                                lng: data.lon
                            }];
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        callN("msg",{"content":errcode.deviceGPS+'.'});
                    });
            },
            // 获取当前连接用户
            getUserstats(){
                this.$http.get(URL_USERS,{timeout:10000},{
                    headers: {
                        "cache-control": "no-cache"
                    }
                })
                    .then(response=>response.json())
                    .then(data=>{
                        this.connect_num = data.now;
                    })
                    .catch(e=>{
                        console.log(e);
                        if (this.connect_num==" ") {
                            callN("msg",{"content": errcode.deviceUser});
                        }
                    });
            },
            // 获取设备信息
            getEqu(){
                return this.$http.get(URL_GETINFO,{timeout:10000})
                    .then(response=>response.json())
                    .then(data=>{
                        this.equ_sn = data.deviceSN;
                        this.equ_mac = data.deviceMac;
                    });
            },
            // 获取车辆信息
            getBus(){
                return fetch(GETVEL,{
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
                        this.isWaiting = false;
                        if (message.code===0) {
                            this.plate_num = message.data.plate_num;
                        }else{
                            callN("msg",{"content":message.message});
                        }
                    })
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