/**
 * Created by yangshuang on 2017/3/30.
 */
import "css/myRepairs.scss"

import Vue from "vue";
import commonTop from "common-top";
import {getN,callN} from "nativeA";

window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('baseInfo');
    var fnObj = {
        "repairList":[]
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
                console.log(data);
                if(data.code==0){
                    _this.repairList=data.data.list;
                }
            })
        },
        components: {
            commonTop
        }
    })
},false);