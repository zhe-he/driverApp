/**
 * Created by yangshuang on 2017/3/31.
 */
import "css/deviceSelfChecking.scss";
import Vue from "vue";
import commonTop from "common-top";
import {getN,callN} from "nativeA";
import {jsonp} from "method";

window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('baseInfo');
    const NUMBER = getN('getAutoCheckNumber').number;
    /*if (NUMBER) {
        fetch(BASEINFO.host+'/get/',{
            method:"post",
            headers:{
                "Content-type":"application:/x-www-form-urlencoded:charset=UTF-8"
            },
            body: `number=${NUMBER}&userid=${BASEINFO.userid}`
        }).
            then(response=>response.json()).
            then(data=>{
                console.log(data);
            });

        jsonp({
            url: 'url',
            data: {
                // jsonp: 'cb'
            },
            timeout: 3000,
            success: function (data){

            },
            error: function (){

            }
        })
    }
*/
    new Vue({
        el: "#deviceSelf",
        components: {
            commonTop
        }
    });
},false);
