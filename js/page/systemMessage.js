/**
 * Created by yangshuang on 2017/4/1.
 */
const querystring = require("querystring");
import "css/systemMessage.scss"
//import msg from "msg";
// import eventHub from 'eventHub';
import Vue from "vue";
import errcode from "errcode";
import loading from 'loading';
import {dataFormat} from "method";
import commonTop from "common-top";
import {getN,callN} from "nativeA";
import {MESLIST} from "inter";


window.addEventListener("DOMContentLoaded",()=>{

    const BASEINFO = getN('getBase');
    var fnObj = {
        "messageList":[],
        "isWaiting": true,  // 初次进入加载
        "isShow": false,    // 加载中文案是否显示
        "isReady": false,   // 是否能加载下一页
        "curpage":1,        // 当前页数
        "pageCount":99,     // 总页数，只在第一次请求赋值
        "size": 10          // 每页多少条数据
    };
    Vue.filter('timeFormat',str=>{
        return str?dataFormat((str*1000),'YYYY-MM-dd hh:mm:ss'):"";
    });
    new Vue({
        el: "#systemMsg",
        data: fnObj,
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
                var params = {
                    format: "json",
                    uid: BASEINFO.uid,
                    access_token: BASEINFO.access_token,
                    page: this.curpage,
                    size: this.size,
                    type:1
                };
                this.isReady=true;
                fetch(`${BASEINFO.host}${MESLIST}?${querystring.stringify(params)}`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        this.isReady=false;
                        this.isWaiting=false;
                        this.isShow = false;
                        if(data.code==0){
                            this.messageList=this.messageList.concat(data.data.list);
                            if (this.curpage===1) {
                                this.pagecount = Math.ceil(data.data.total/this.size);
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
                        this.isShow = false;
                        this.isReady=false;
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
                    this.isShow = true;
                    this.getData();
                }
            },
            check(num,id){
                this.messageList[num].status=1;
                window.location.href = 'messageContent.html?type=0&setting=hmbrf&id='+id;
            }
        },
        components: {
            //msg,
            loading,
            commonTop
        }
    });
},false);
