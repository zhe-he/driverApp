/**
 * Created by yangshuang on 2017/4/13.
 */
const querystring = require("querystring");
import "css/messageContent.scss";

import Vue from "vue";
import errcode from "errcode";
import commonTop from "common-top";
import loading from "loading";
import {getN,callN} from "nativeA";
import {dataFormat} from "method";
import {MESDET} from "inter";
window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('getBase');
    var fnObj = {
        "isWaiting":true,
        "getDetail":{
            "content":"",
            "ctime":"",
            "title":""
        }

    };
    new Vue({
        el: "#messageContent",
        data:fnObj,
        mounted(){
            var url = decodeURIComponent(location.search),_this=this;
            var search = window.location.search.substr(1);
            var theRequest = querystring.parse(search);
            console.log(theRequest);
            fetch(`${MESDET}?id${theRequest.id}`,{
                cache:"no-cache"
            })
                .then(response=>response.json())
                .then(data=>{
                    _this.isWaiting=false;
                    console.log(data);
                    if(data.code==0){
                        _this.getDetail.content=data.data.content;
                        _this.getDetail.ctime=data.data.ctime;
                        _this.getDetail.title=data.data.title;
                    }else{
                        callN('msg',{
                            content:data.message
                        })
                    }
                })
                .catch(e=>{
                    console.log(e);
                    this.isWaiting=false;
                    callN('msg',{
                        content: errcode.m404
                    })
                })
        },
        components: {
            commonTop,
            loading
        }
    });
    
},false);