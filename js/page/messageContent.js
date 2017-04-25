/**
 * Created by yangshuang on 2017/4/13.
 */
const querystring = require("querystring");
import "css/messageContent.scss";

import Vue from "vue";
import errcode from "errcode";
import commonTop from "common-top";
import loading from "loading";
import {callN} from "nativeA";
import {MESDET} from "inter";
window.addEventListener("DOMContentLoaded",()=>{
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
            var search = window.location.search.substr(1);
            var theRequest = querystring.parse(search);
            console.log(theRequest);
            fetch(`${MESDET}?id=${theRequest.id}`,{
                cache:"no-cache"
            })
                .then(response=>response.json())
                .then(data=>{
                    this.isWaiting=false;
                    console.log(data);
                    if(data.code==0){
                        this.getDetail.content=data.data.content;
                        this.getDetail.ctime=data.data.ctime;
                        this.getDetail.title=data.data.title;
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