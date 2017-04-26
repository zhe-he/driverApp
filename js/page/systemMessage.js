/**
 * Created by yangshuang on 2017/4/1.
 */
import "css/systemMessage.scss"


import Vue from "vue";
import errcode from "errcode";
import msg from "msg";
import eventHub from 'eventHub';
import loading from 'loading';
import {getN,callN} from "nativeA";
import {MESLIST} from "inter";

window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('getBase');
    var fnObj = {
        "isWaiting":true,
        "messageList":[],

    };
    new Vue({
        el: "#systemMsg",
        data:fnObj,
        created(){
            eventHub.$on('msg-confirm',msg=>{
                console.log('确定',msg);
            });
            eventHub.$on('msg-cancel',msg=>{
                console.log('取消',msg);
            });
        },
        mounted(){
            fetch(`${MESLIST}?uid=${BASEINFO.uid}`,{
                cache:"no-cache"
            })
                .then(response=>response.json())
                .then(data=>{
                    this.isWaiting=false;
                    console.log(data);
                    if(data.code==0){
                        this.messageList=data.data.list;
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
        methods: {
            test(){
                eventHub.$emit('msg-show','此处为测试弹窗');
            },
            goBack(){
                callN("close",{type:3})
            }
        },
        components: {
            msg,
            loading
        }
    });
},false);
