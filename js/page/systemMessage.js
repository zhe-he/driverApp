/**
 * Created by yangshuang on 2017/4/1.
 */
import "css/systemMessage.scss"


import Vue from "vue";
import errcode from "errcode";
//import msg from "msg";
// import eventHub from 'eventHub';
import loading from 'loading';
import {dataFormat} from "method";
import commonTop from "common-top";
import {getN,callN} from "nativeA";
import {MESLIST} from "inter";


window.addEventListener("DOMContentLoaded",()=>{

    const BASEINFO = getN('getBase');
    var fnObj = {
        "isWaiting":true,
        "messageList":[],
        "isReady":false,
        "curpage":1,
        "pageCount":99

    };
    Vue.filter('timeFormat',str=>{
        str=str == undefined?'':dataFormat((str*1000),'YYYY-MM-dd hh:mm:ss');
        return str;
    });
    new Vue({
        el: "#systemMsg",
        data:fnObj,
        /*created(){
            eventHub.$on('msg-confirm',msg=>{
                console.log('确定',msg);
            });
            eventHub.$on('msg-cancel',msg=>{
                console.log('取消',msg);
            });
        },*/
        mounted(){
            this.getData();
            this.$nextTick(()=>{
                window.addEventListener('scroll',this.addMore.bind(this),false);
            });
        },
        methods: {
            getData(){
                this.isReady=true;
                fetch(`${BASEINFO.host}${MESLIST}?uid=${BASEINFO.uid}&access_token=${BASEINFO.access_token}&format=json&page=${this.curpage}&size=10`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        this.isReady=false;
                        this.isWaiting=false;
                        if(data.code==0){
                            this.messageList=this.messageList.concat(data.data.list);
                            if (this.curpage===1) {
                                this.pagecount = Math.ceil(data.data.total/10);
                            }

                            if (this.curpage++>=this.pagecount) {
                                window.removeEventListener('scroll',this.addMore,false);
                                this.isReady = true;
                            }

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
            addMore(){
                var H = document.documentElement.scrollHeight || document.body.scrollHeight;
                var h = window.innerHeight;
                var t = document.documentElement.scrollTop||document.body.scrollTop;
                if (H - (h + t) < 15 && !this.isReady){
                    this.getData();
                }
            }
        },
        components: {
            //msg,
            loading,
            commonTop
        }
    });
},false);
