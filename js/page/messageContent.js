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
import {MESDET,MESEDIT} from "inter";
window.addEventListener("DOMContentLoaded",()=>{
    const SEARCH = window.location.search.substr(1);
    const PARAMS = querystring.parse(SEARCH);
    const BASEINFO = getN('getBase');
    var fnObj = {
        "isWaiting":true,
        "id":'',
        "getDetail":{
            "content":"",
            "ctime":"",
            "title":""
        },
        "backType": (PARAMS.type || 1)-0
    };
    new Vue({
        el: "#messageContent",
        data:fnObj,
        mounted(){
            var search = window.location.search.substr(1);
            var theRequest = querystring.parse(search);
            this.id=theRequest.id;
            console.log(theRequest);
            fetch(`${BASEINFO.host}${MESDET}?id=${this.id}&access_token=${BASEINFO.access_token}`,{
                cache:"no-cache"
            })
                .then(response=>response.json())
                .then(data=>{
                    this.isWaiting=false;
                    console.log(data);
                    if(data.code==0){
                        this.editMess();
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
        methods:{
            editMess(){
                var data={
                    "id":this.id,
                    "uid":BASEINFO.uid,
                    "status":1,
                    "access_token": BASEINFO.access_token
                }
                fetch(`${BASEINFO.host}${MESEDIT}?${querystring.stringify(data)}`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        console.log(data);
                        if(data.code==0){
                            console.log(data.message);
                        }else{
                            callN('msg',{
                                content:data.message
                            })
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        callN('msg',{
                            content: errcode.m404
                        })
                    })
            }
        },
        components: {
            commonTop,
            loading
        }
    });
    
},false);