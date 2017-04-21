/**
 * Created by yangshuang on 2017/4/13.
 */
import "css/messageContent.scss"

import Vue from "vue";
import commonTop from "common-top";
import loading from "loading";
import {getN,callN} from "nativeA";
import {dataFormat} from "method";
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
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var theRequest = new Object();
                var strs = str.split("&");
                for(var i = 0; i < strs.length; i ++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            console.log(theRequest);
            fetch(BASEINFO.host+'/app-dms/message/detail?id'+theRequest.id,{
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
                        content:'网络错误，请稍后再试！'
                    })
                })
        },
        components: {
            commonTop,
            loading
        }
    });
    
},false);