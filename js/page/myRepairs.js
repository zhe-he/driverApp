/**
 * Created by yangshuang on 2017/3/30.
 */
const querystring = require('querystring');
import "css/myRepairs.scss"

import Vue from "vue";
import errcode from "errcode";
import commonTop from "common-top";
import loading from "loading";
import {callN} from "nativeA";
import {REPLIST} from "inter";

window.addEventListener("DOMContentLoaded",()=>{
    const SEARCH = window.location.search.substr(1);
    const PARAMS = querystring.parse(SEARCH);

    var fnObj = {
        "repairList":[],
        "isWaiting":true,
        "backType": (PARAMS.type || 3)  // 返回到车辆 or 我的
    };
    new Vue({
        el: "#myRepairs",
        data:fnObj,
        beforeCreate(){
            var _this=this;
            fetch(REPLIST,{
                cache:"no-cache"
            }).then(response=>response.json()).
            then(data=>{
                this.isWaiting=false;
                if(data.code==0){
                    _this.repairList=data.data.list;
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