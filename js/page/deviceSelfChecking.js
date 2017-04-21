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
    const BASEINFO = getN('getBase');
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
            var _this=this,plate_sn='';
            var ms=new Date().getTime();
            console.log(ms);
            if(NUMBER.isChecked==1){
                if(NUMBER.callbackId){
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
                    fetch(URL_GETINFO,{
                        cache:"no-cache"
                    })
                        .then(response=>response.json())
                        .then(data=>{
                            console.log(data);
                            plate_sn=data.deviceSN;
                            // plate_sn='HMAPA01160700537';
                        })
                        .then(()=>{
                            if(plate_sn==NUMBER.plate_sn){
                                _this.getDetail.dtime=NUMBER.dtime;
                                _this.getDetail.plate_sn=plate_sn;
                                _this.getPlateNum();
                                _this.getDetail.wifi=1;
                                _this.getDetail.portal=1;
                                _this.getDetail.compass=1;
                            }else{
                                _this.noCheck();
                            }
                        })
                }
            }else{
                _this.noCheck();
            }
        },
        methods:{
            selfCheck (){
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
                    _this.getDetail.dtime=new Date().getTime();
                    })
                    .then(()=>{_this.getPlateNum();})
                    .then(()=>{_this.getHealth();})
                    .then(()=>{
                        if(!_this.getDetail.plate_num || !_this.getDetail.plate_sn || _this.getDetail.wifi!=1 || _this.getDetail.portal!=1 || _this.getDetail.compass!=1){
                            var content={
                                "type" : 2,
                                    "dtime":_this.getDetail.dtime,
                                    "plate_num":_this.getDetail.plate_num,
                                    "plate_sn":_this.getDetail.plate_sn,
                                    "wifi":_this.getDetail.wifi,
                                    "portal":_this.getDetail.portal,
                                    "compass":_this.getDetail.compass
                            };

                            fetch(BASEINFO.host+'/Driver/report/add',{
                                method:"POST",
                                mode: "cors",
                                headers:{
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                body: `userid=${BASEINFO.userid}&plate_num=${_this.getDetail.plate_num}&content=${JSON.stringify(content)}&type=2`
                            })
                                .then(response=>response.json())
                                .then(data=>{
                                    console.log(data);
                                })
                                .catch(e=>console.log(e));
                        }
                    })
                    .catch(e=>console.log(e));

                _this.getDetail.status='';
            },
            getPlateNum(){
                var _this=this;
                //根据sn获取车牌号
                fetch(`${BASEINFO.host}/app-dms/vehicle/getVelByField?equ_sn='${_this.getDetail.plate_sn}'`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        console.log(data);
                        _this.getDetail.plate_num=data.data.plate_num;
                    }).catch(e=>console.log(e));
            },
            getHealth(){
                var _this=this;
                //获取设备检测详情
                fetch(URL_HEALTH,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                    console.log(data);
                    _this.getDetail.compass=data.Compass=="OK"?'1':'0';
                    _this.getDetail.wifi=data.WIFI=="OK"?'1':'0';
                    _this.getDetail.portal=data.Portal=="OK"?'1':'0';
                })
                    .catch(e=>console.log(e));
            },
            noCheck(){
                this.getDetail.hasNumber=false;//置空
                // this.getDetail.dtime=new Date().getTime();
                callN('msg',{content:"设备日检需要连接往返WIFI！"});
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
