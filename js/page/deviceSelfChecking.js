/**
 * Created by yangshuang on 2017/3/31.
 */
import "css/deviceSelfChecking.scss";
import Vue from "vue";
import VueResource from "vue-resource";
import commonTop from "common-top";
import {getN,callN} from "nativeA";
import msg from "msg";
import loading from "loading";
import {dataFormat} from "method";
import eventHub from "eventHub";
import {URL_GETINFO,URL_HEALTH} from "device";
Vue.use(VueResource);
window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('getBase');
    const NUMBER = getN('getAutoCheckNumber');
    const WIFI = getN('wifi');
    var fnObj = {
        "isWifi":WIFI.wangfan,
        "isWaiting":true,
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
            if(NUMBER.isChecked==1){
                if(NUMBER.callbackId){
                    fetch(BASEINFO.host+'/Driver/report/getReport?id=1',{
                        cache:"no-cache"
                    })
                        .then(response=>response.json())
                        .then(data=>{
                            _this.isWaiting=false;
                            console.log(data);
                            var result=data.data;
                            if(data.code==0){
                                _this.getDetail=result.content;
                                _this.getDetail.status=result.status;
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
                }else{
                    if(_this.isWifi==1){
                        this.$http.get(URL_GETINFO,{timeout:10000},{
                            headers: {
                                'Cache-Control': 'no-cache'
                            }
                        })
                            .then(data=>{
                                _this.isWaiting=false;
                                console.log(data);
                                return data.body.deviceSN;
                                // return 'HMAPA01160700537';
                            })
                            .then((plate_sn)=>{
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
                            }).catch(e=>{
                                console.log(e)
                                this.isWaiting=false;
                                callN('msg',{
                                    content:'网络错误，请稍后再试！'
                                })
                            })
                    }else{
                        _this.noCheck();
                    }

                }
            }else{
                _this.noCheck();
            }
        },
        methods:{
            selfCheck (){
                this.isWaiting=true;
                var date=new Date(),_this=this;
                date=dataFormat(date,'YYYY-MM-dd hh:mm:ss');
                this.getDetail.dtime=date;
                //获取设备sn
                this.$http.get(URL_GETINFO,{timeout:10000},{
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                    .then(response=>response.json())
                    .then(data=>{
                    console.log(data);
                    _this.getDetail.plate_sn=data.deviceSN;
                    _this.getDetail.plate_num='';
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
                    .catch(e=>{
                        console.log(e);
                        this.isWaiting=false;
                        callN('msg',{
                            content:'网络错误，请稍后再试！'
                        })
                    });

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
                        if(data.code==0){
                            _this.getDetail.plate_num=data.data.plate_num;
                        }else{
                            callN('msg',{
                                content:data.message
                            })
                        }
                    }).catch(e=>{
                        console.log(e);
                        callN('msg',{
                            content:'网络错误，请稍后再试！'
                        })
                    });
            },
            getHealth(){
                var _this=this;
                //获取设备检测详情
                this.$http.get(URL_HEALTH,{timeout:10000},{
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                    .then(response=>response.json())
                    .then(data=>{
                    console.log(data);
                    _this.isWaiting=false;
                    _this.getDetail.compass=data.Compass=="OK"?'1':'0';
                    _this.getDetail.wifi=data.WIFI=="OK"?'1':'0';
                    _this.getDetail.portal=data.Portal=="OK"?'1':'0';
                })
                    .catch(e=>{
                        console.log(e);
                        callN('msg',{
                            content:'网络错误，请稍后再试！'
                        })
                    });
            },
            noCheck(){
                this.getDetail.hasNumber=false;//置空
                // this.getDetail.dtime=new Date().getTime();
                callN('msg',{content:"设备日检需要连接往返WIFI！"});
            }
        },
        components: {
            commonTop,
            msg,
            loading
        }
    });




},false);
