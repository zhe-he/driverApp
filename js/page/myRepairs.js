/**
 * Created by yangshuang on 2017/3/30.
 */
const querystring = require('querystring');
import "css/myRepairs.scss";

import Vue from "vue";
import errcode from "errcode";
import commonTop from "common-top";
import loading from "loading";
import {getN,callN} from "nativeA";
import {REPLIST} from "inter";
import {dataFormat} from "method";

window.addEventListener("DOMContentLoaded",()=>{
    const SEARCH = window.location.search.substr(1);
    const PARAMS = querystring.parse(SEARCH);
    const BASEINFO = getN('getBase');


    var fnObj = {
        "repairList":[],
        "isWaiting": true,  // 初次进入加载
        "isShow": false,    // 加载中文案是否显示
        "backType": (PARAMS.type || 3)-0 , // 返回到车辆 or 我的
        "isReady": false,   // 是否能加载下一页
        "curpage":1,        // 当前页数
        "pageCount":99,     // 总页数，只在第一次请求赋值
        "size": 10          // 每页多少条数据
    };
    
    Vue.filter('timeFormat',str=>{
        return str?dataFormat((str*1000),'YYYY-MM-dd hh:mm:ss'):'';
    });
    Vue.filter('repairNum',str=>{
        return str?str.slice(0,-4):'';
    });
    Vue.filter('descFormat',str=>{
        let msgArr=[];
        if(!str.plate_num){
            msgArr.push('车辆信息未读取');
        }
        if(!str.plate_sn){
            msgArr.push('设备信息未读取');
        }
        // 设备字符可能是小写ok,设备返回可能带有前后空格的ok
        if(str.WIFI.toString().trim().toUpperCase()!="OK"){
            msgArr.push('wifi功能检测错误');
        }
        if(str.Portal.toString().trim().toUpperCase()!="OK"){
            msgArr.push('Portal功能检测错误');
        }
        if(str.Compass.toString().trim().toUpperCase()!="OK"){
            msgArr.push('北斗定位功能检测错误');
        }
        if(str['4G'].toString().trim().toUpperCase()!="OK"){
            msgArr.push('设备4G功能检测错误');
        }
        return String(msgArr);
    });
    new Vue({
        el: "#myRepairs",
        data:fnObj,
        mounted(){
            this.getData();
            this.$nextTick(()=>{
                window.addEventListener('scroll',this.addMore.bind(this),false);
            });
        },
        methods: {
            getData(){
                var params = {
                    format: "json",
                    uid: BASEINFO.uid,
                    access_token: BASEINFO.access_token,
                    page: this.curpage,
                    size: this.size
                };
                this.isReady = true;
                fetch(`${BASEINFO.host}${REPLIST}?${querystring.stringify(params)}`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        this.isReady=false;
                        this.isWaiting=false;
                        this.isShow = false;
                        if(data.code==0){
                            this.repairList=this.repairList.concat(data.data.list);
                            if (this.curpage==1) {
                                this.pagecount = Math.ceil(data.data.total/this.size);
                            }
                            if (this.curpage++>=this.pagecount) {
                                window.removeEventListener('scroll',this.addMore,false);
                                this.isReady = true;
                            }
                        }else{
                            callN('msg',{
                                content:data.message
                            });
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.isWaiting=false;
                        this.isShow = false;
                        this.isReady=false;
                        callN('msg',{
                            content: errcode.m404
                        });
                    })
            },
            addMore(){
                var H = document.documentElement.scrollHeight || document.body.scrollHeight;
                var h = window.innerHeight;
                var t = document.documentElement.scrollTop||document.body.scrollTop;
                if (H - (h + t) < 15 && !this.isReady){
                    this.isShow = true;
                    this.getData();
                }
            }
        },
        components: {
            commonTop,
            loading
        }
    })
},false);