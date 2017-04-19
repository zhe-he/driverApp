/**
 * Created by yangshuang on 2017/3/31.
 */
import "css/deviceSelfChecking.scss";
import Vue from "vue";
import commonTop from "common-top";
import {getN,callN} from "nativeA";
import msg from "msg";
import {dataFormat} from "method";
import eventHub from "eventHub";
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
            "status":"",
            "hasNumber":true
        }

    };
    Vue.filter('ymdhms',str=>{
        console.log(str);
        var data=Number(str);
        str=dataFormat(data,'YYYY-MM-dd hh:mm:ss');
        return str;
    })
    new Vue({
        el: "#deviceSelf",
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
            var ms=new Date().getTime();
            console.log(ms);
            if(NUMBER){
                // console.log(NUMBER);
                fetch(BASEINFO.host+'/Driver/report/getReport?id=1',{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                    console.log(data);
                    var result=data.data;
                    if(data.code==0){
                        _this.getDetail=result.content;
                        _this.getDetail.status=result.status;
                    }
                })
            }else{
                console.log("222");
                _this.getDetail.hasNumber=false;
                eventHub.$emit('msg-show','设备日检需要连接往返WIFI！');
            }
        },
        methods:{
            selfCheck () {
                var date=new Date(),_this=this;
                date=dataFormat(date,'YYYY-MM-dd hh:mm:ss');
                this.getDetail.dtime=date;
                //获取设备sn
                fetch(URL_GETINFO,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                    console.log(data);
                    _this.getDetail.plate_sn=data.deviceSN;
                    })
                    .then(()=>{
                        //根据sn获取车牌号
                        fetch(BASEINFO.host+'/app-dms/device/getVelByField?equ_sn='+_this.getDetail.plate_sn,{
                            cache:"no-cache"
                        }).then(response=>response.json()).
                        then(data=>{
                            console.log(data);
                            _this.getDetail.plate_num=data.data.plate_num;
                        }).catch(e=>console.log(e));
                    })
                    .catch(e=>console.log(e))
                //获取设备检测详情
                fetch(URL_HEALTH,{
                    cache:"no-cache"
                }).then(response=>response.json()).
                then(data=>{
                    console.log(data);
                    _this.getDetail.compass=data.Compass=="OK"?'1':'0';
                    _this.getDetail.wifi=data.WIFI=="OK"?'1':'0';
                    _this.getDetail.portal=data.Portal=="OK"?'1':'0';
                });
                _this.getDetail.status='';
            }
        },
        components: {
            commonTop,
            msg
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
