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

window.addEventListener("DOMContentLoaded",()=>{
    const SEARCH = window.location.search.substr(1);
    const PARAMS = querystring.parse(SEARCH);
    const BASEINFO = getN('getBase');

    var fnObj = {
        "repairList":[],
        "isWaiting":true,
        "backType": (PARAMS.type || 3)-0  // 返回到车辆 or 我的
    };
    var params = {
        uid: BASEINFO.uid,
        access_token: BASEINFO.access_token
    }
    new Vue({
        el: "#myRepairs",
        data:fnObj,
        beforeCreate(){
            fetch(`${BASEINFO.host}${REPLIST}?${querystring.stringify(params)}`,{
                cache:"no-cache"
            }).then(response=>response.json()).
            then(data=>{
                this.isWaiting=false;
                if(data.code==0){
                    this.repairList=data.data.list;
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
        components: {
            commonTop,
            loading
        }
    })
},false);