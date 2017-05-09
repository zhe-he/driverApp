/**
 * 1. 获取最新版本信息，如有新版本，小红点提示
 * 1. 更新、清缓存、注销 调用客户端方法
 */

import "css/settings.scss";
import Vue from "vue";
import errcode from "errcode";
import commonTop from "common-top";
import {getN,callN} from "nativeA";
import msg from "msg";
import eventHub from "eventHub";
import {GETVER} from "inter";

window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN("getBase");
    var reVersion = /(iOSApp|AndroidApp)\/wangfanDriver\s+(\d+\.\d+\.\d+)/i.exec(window.navigator.userAgent);

    new Vue({
        el: "#settings",
        data:{
            cache: "",
            isCanUpdate: false,
            updateUrl: "",
            checkUpdate: false, 
            version: (reVersion?reVersion[2]:"1.0.0") 
        },
        mounted(){
            this.getCanupdata();
            this.cache = getN("getCache").size;

            eventHub.$on("msg-confirm",(content,type)=>{
                switch(type){
                    case 1:
                        callN('cleanCache');
                        this.cache = "0.0Byte";
                        break;
                    case 2:
                        callN('updateApp',{ "url": this.updateUrl });
                        break;
                    case 3:
                        callN('signOut');
                        break;
                }
            });
        },
        methods: {
            getCanupdata(){
                this.checkUpdate = true;
                fetch(`${BASEINFO.host}${GETVER}?access_token=${BASEINFO.access_token}&format=json`,{
                    cache: "no-cache"
                })
                    .then(response=>response.json())
                    .then(message=>{
                        this.checkUpdate = false;
                        if (message.code==0) {
                            if(this.version < message.data.code){
                                this.updateUrl = message.data.url;
                                this.isCanUpdate = true;
                            }
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.checkUpdate = false;
                    });
            },
            cleanCache(){
                eventHub.$emit("msg-show","确定清除本地缓存吗？",1);
            },
            updateApp(){
                if (this.checkUpdate) {
                    callN("msg",{"content": errcode.updateCheck});
                    return false;
                }

                // 当前为最新版本
                if (this.isCanUpdate) {
                    eventHub.$emit("msg-show","检测到新版本，确定进行版本更新吗？",2);
                }else{
                    callN("msg",{"content": errcode.update});
                }
            },
            signOut(){
                eventHub.$emit("msg-show","确定注销吗？",3);
            }
        },
        components: {
            commonTop,
            msg
        }
    })
},false);