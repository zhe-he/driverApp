/**
 * Created by yangshuang on 2017/4/1.
 */
import "css/systemMessage.scss"


import Vue from "vue";
import msg from "msg";
import eventHub from 'eventHub';
import {getN,callN} from "nativeA";
import {dataFormat} from "method";

window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('baseInfo');
    var fnObj = {
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
            var _this=this;
            fetch(BASEINFO.host+'/app-dms/message/lists?uid='+BASEINFO.uid,{
                cache:"no-cache"
            })
                .then(response=>response.json())
                .then(data=>{
                    console.log(data);
                    _this.messageList=data.data.list;

                })
        },
        methods: {
            test(){
                eventHub.$emit('msg-show','此处为测试弹窗');
            }
        },
        components: {
            msg
        }
    });
},false);
