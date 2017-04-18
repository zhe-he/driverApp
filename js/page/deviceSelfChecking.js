/**
 * Created by yangshuang on 2017/3/31.
 */
import "css/deviceSelfChecking.scss";
import Vue from "vue";
import commonTop from "common-top";
import {getN,callN} from "nativeA";
import {jsonp} from "method";
import {URL_GETINFO,URL_HEALTH} from "device";

window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('baseInfo');
    const NUMBER = getN('getAutoCheckNumber');
    var fnObj = {
        "getDetail":{
            "dtime":"",
            "plate_num":"",
            "plate_sn":"",
            "protal":"",
            "compass":"",
            "wifi":"",
            "status":""
        }

    };
    new Vue({
        el: "#deviceSelf",
        data:fnObj,
        beforeCreate(){
            var _this=this;
            if(NUMBER){
                console.log(NUMBER);
                fetch(BASEINFO.host+'/Driver/report/getReport?id=1',{
                    cache:"no-cache"
                }).then(response=>response.json()).
                then(data=>{
                    console.log(data);
                    var result=data.data;
                    if(data.code==0){
                        _this.getDetail=result.content;
                        _this.getDetail.status=result.status;
                    }


                })
            }else{
                console.log('NO');
                console.log(NUMBER);
            }
        },
        methods:{

        },
        components: {
            commonTop
        }
    });


    /*if (NUMBER) {
        fetch(BASEINFO.host+'/get/',{
            method:"post",
            headers:{
                "Content-type":"application:/x-www-form-urlencoded:charset=UTF-8"
            },
            body: `id=${NUMBER.id}&userid=${BASEINFO.userid}`
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



},false);
