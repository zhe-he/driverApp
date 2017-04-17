/**
 * Created by yangshuang on 2017/4/1.
 */
import "css/systemMessage.scss"


import Vue from "vue";
import msg from "msg";
import eventHub from 'eventHub';

window.addEventListener("DOMContentLoaded",()=>{
    new Vue({
        el: "#systemMsg",
        created(){
            eventHub.$on('msg-confirm',msg=>{
                console.log('确定',msg);
            });
            eventHub.$on('msg-cancel',msg=>{
                console.log('取消',msg);
            });
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
