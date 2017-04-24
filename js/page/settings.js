import "css/settings.scss";
import Vue from "vue";
import errcode from "errcode";
import commonTop from "common-top";
import {getN,callN} from "nativeA";
import msg from "msg";
import eventHub from "eventHub";

window.addEventListener("DOMContentLoaded",()=>{

    new Vue({
        el: "#settings",
        data:{
            cache: "",
            isCanUpdate: false
        },
        mounted(){
            this.isCanUpdate = true;
            this.cache = getN("getCache").size;

            eventHub.$on("msg-confirm",(content,type)=>{
                switch(type){
                    case 1:
                        callN('cleanCache');
                        this.cache = "0M";
                        break;
                    case 2:
                        callN('updateApp');
                        break;
                    case 3:
                        callN('signOut');
                        break;
                }
            });
        },
        methods: {
            getCanupdata(){
                fetch('',{
                    cache: "no-cache"
                })
                    .then(response=>response.json())
                    .then(message=>{
                        console.log(message);
                    })
                    .cache(e=>console.log(e));
            },
            cleanCache(){
                eventHub.$emit("msg-show","确定清除本地缓存？",1);
            },
            updateApp(){
                // 当前为最新版本
                if (this.isCanUpdate) {
                    eventHub.$emit("msg-show","检测到新版本，是否确定更新？",2);
                }else{
                    callN("msg",{"content": errcode.update});
                }
            },
            signOut(){
                eventHub.$emit("msg-show","确定注销？",3);
            }
        },
        components: {
            commonTop,
            msg
        }
    })
},false);