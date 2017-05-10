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
        "isWaiting":true,
        "backType": (PARAMS.type || 3)-0 , // 返回到车辆 or 我的
        "isReady":false,
        "curpage":1,
        "pageCount":99
    };
    var params = {
        format: "json",
        uid: BASEINFO.uid,
        access_token: BASEINFO.access_token,
        page:this.curpage,
        size:20
    };
    Vue.filter('timeFormat',str=>{
        str=str == undefined?'':dataFormat((str*1000),'YYYY-MM-dd hh:mm:ss');
        return str;
    });
    Vue.filter('repairNum',str=>{
        str=str == undefined?'':str.slice(0,-4);
        return str;
    });
    Vue.filter('descFormat',str=>{
        console.log(str);
        let msgArr=[];
        if(!str.plate_num){
            msgArr.push('车辆信息未读取');
        }
        if(!str.plate_sn){
            msgArr.push('设备信息未读取');
        }
        if(str.wifi!=1){
            msgArr.push('wifi功能检测错误');
        }
        if(str.portal!=1){
            msgArr.push('Portal功能检测错误');
        }
        if(str.compass!=1){
            msgArr.push('北斗定位功能检测错误');
        }
        if(str._4G!=1){
            msgArr.push('4G功能检测错误');
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
                fetch(`${BASEINFO.host}${REPLIST}?${querystring.stringify(params)}`,{
                    cache:"no-cache"
                }).then(response=>response.json()).
                then(data=>{
                    this.isReady=false;
                    this.isWaiting=false;
                    if(data.code==0){
                        this.repairList=this.repairList.concat(data.data.list);
                        if (this.curpage===1) {
                            this.pagecount = Math.ceil(data.data.total/20);
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