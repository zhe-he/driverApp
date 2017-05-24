/**
 * 1. 检测是否处在往返wifi下，如果不是，弹窗提示(弹窗移除)
 * 1. 获取设备sn，通过sn获取当前车牌号
 * 1. 每分钟获取车内上网用户
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
    const BASEINFO = getN('getBase');
    var map,CONVERTOR;
    const WIFI = getN('wifi');
    new Vue({
        el: "#bus",
        data: {
            isWaiting: false,
            equ_sn: "",     // 设备id/sn
            plate_num: "",  // 车牌号
            connect_num: " ", // 当前连接用户人数
            gpsList: []     // 行驶轨迹             
        },
        mounted(){

            if (WIFI.wangfan != 1) {
                // callN("msg", {"content": errcode.device});
                this.$nextTick(this.mapInit);
                return false;
            }
            // this.isWaiting = true;
            this.getEqu().then(this.getBus).catch(e=>{
                // this.isWaiting = false;
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
                let line = getN('getDriveLine') || [];
                // 第一次进入的时候可能没有数据
                if (line.length==0) {
                    setTimeout(()=>{
                        this.getGpsList();
                    },3000);
                }else{
                    this.gpsList = line;
                    this.drawLine(line);
                }
            },             
            drawLine(line){ 
                if (line.length==0) {return }       
                let pointArr = [];                     
                for (var i = 0; i < line.length; i++) { 
                    let ggPoint = new BMap.Point(line[i].lng, line[i].lat); 
                    pointArr.push(ggPoint); 
                }
                CONVERTOR.translate(pointArr,1,5,data=>{ 
                    if (data.status==0) {
                        map.clearOverlays(); 
                        let aPolyline = []; 
                        for (var i = 0; i < data.points.length; i++) { 
                            aPolyline.push(data.points[i]);                             
                        } 
                        var lastPoint = data.points[data.points.length-1];
                        let polyline = new BMap.Polyline(aPolyline,{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});                             
                        let marker = new BMap.Marker(lastPoint); 
                        map.addOverlay(polyline);
                        map.addOverlay(marker);
                        if (map.getZoom()<12) {
                            map.centerAndZoom(lastPoint,13); 
                        }else{ 
                            map.setCenter(lastPoint);
                        } 
                    }
                });
            },
            // 获取当前连接用户
            getUserstats(){
                this.$http.get(URL_USERS,{timeout:15000},{
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
			this.connect_num = 0;
                    });
            },
            // 获取设备信息
            getEqu(){
                return this.$http.get(URL_GETINFO,{timeout:10000})
                    .then(response=>response.json())
                    .then(data=>{
                        this.equ_sn = data.deviceID || data.deviceSN;
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
                        access_token:BASEINFO.access_token
                    })
                })
                    .then(response=>response.json())
                    .then(message=>{
                        // this.isWaiting = false;
                        if (message.code==0) {
                            this.plate_num = message.data.plate_num;
                        }else{
                            callN("msg",{"content":message.message});
                        }
                    });
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