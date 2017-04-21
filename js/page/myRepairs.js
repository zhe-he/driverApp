/**
 * Created by yangshuang on 2017/3/30.
 */
import "css/myRepairs.scss"

import Vue from "vue";
import commonTop from "common-top";
import loading from "loading";
import {getN,callN} from "nativeA";

window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('getBase');
    var fnObj = {
        "repairList":[],
        "isWaiting":true
    };
    new Vue({
        el: "#myRepairs",
        data:fnObj,
        beforeCreate(){
            var _this=this;
            fetch(BASEINFO.host+'/Driver/report/lists',{
                cache:"no-cache"
            }).then(response=>response.json()).
            then(data=>{
                this.isWaiting=false;
                console.log(data);
                if(data.code==0){
                    _this.repairList=data.data.list;
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
    })
},false);