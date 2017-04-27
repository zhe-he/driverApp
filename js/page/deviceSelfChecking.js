/**
 * Created by yangshuang on 2017/3/31.
 */
import "css/deviceSelfChecking.scss";
import Vue from "vue";
import errcode from "errcode";
import VueResource from "vue-resource";
import commonTop from "common-top";
import {getN,callN} from "nativeA";
import msg from "msg";
import loading from "loading";
import {dataFormat} from "method";
import eventHub from "eventHub";
import {URL_GETINFO,URL_HEALTH} from "device";
import {GETREPORT,ADDREP,GETVEL} from "inter";
Vue.use(VueResource);
window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('getBase');
    const NUMBER = getN('getAutoCheckNumber');
    const WIFI = getN('wifi');
    // WIFI.wangfan=0;
    // NUMBER.number='111';
    var fnObj = {
        "isWifi":WIFI.wangfan,
        "isWaiting":false,
        "getDetail":{
            "dtime":"",
            "plate_num":"",
            "plate_sn":"",
            "protal":"",
            "compass":"",
            "wifi":"",
            "status":"",
            "hasNumber":false
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
            // var _this=this,plate_sn='';
            // NUMBER.isChecked=1;
            if(NUMBER.isChecked==1){
                if(NUMBER.number){
                    this.isWaiting=true;
                    fetch( `${GETREPORT}?number=${NUMBER.number}`,{
                        cache:"no-cache"
                    })
                        .then(response=>response.json())
                        .then(data=>{
                            this.isWaiting=false;
                            var result=data.data;
                            if(data.code==0){
                                this.getDetail.hasNumber=true;
                                this.getDetail=result.content;
                                this.getDetail.status=result.status;
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
                }else{
                    if(this.isWifi==1){
                        this.isWaiting=true;
                        this.getDetail.hasNumber=true;
                        this.getSN()
                            .then((plate_sn)=>{
                                this.isWaiting=false;
                                // NUMBER.plate_sn='6010306';
                                if(plate_sn==NUMBER.plate_sn){
                                    // NUMBER.ctime=1492600167612;
                                    this.isWaiting=true;
                                    this.getDetail.dtime=NUMBER.ctime;
                                    this.getDetail.plate_sn=plate_sn;
                                    this.getPlateNum();
                                    this.getDetail.wifi=1;
                                    this.getDetail.portal=1;
                                    this.getDetail.compass=1;
                                }else{
                                    this.getDetail.plate_sn='';
                                    this.getDetail.dtime='';
                                    this.noCheck();
                                }
                            }).catch(e=>{
                                console.log(e);
                                this.isWaiting=false;
                                callN('msg',{
                                    content: errcode.device
                                })
                            })
                    }else{

                        this.getDetail.hasNumber=false;
                        callN('msg',{
                            content: errcode.deviceCheck
                        })
                    }

                }
            }else{
                this.noCheck();
            }
        },
        methods:{
            getSN(){
                return this.$http.get(URL_GETINFO,{timeout:10000})
                    .then(message=>{
                        let data=message.body;
                        if (data && typeof data == 'string') {
                            data = JSON.parse(data);
                        }
                        this.getDetail.plate_sn=data.deviceSN;
                        this.getDetail.plate_num='';
                        this.getDetail.dtime=Date.now();
                        return data.deviceSN;
                    })
            },
            selfCheck(){
                this.isWaiting=true;
                //html页面有判断
                /*if(this.isWifi==0){
                    callN('msg',{content:errcode.deviceCheck});
                    this.isWaiting=false;
                    return
                }*/
                var date=new Date();
                date=dataFormat(date,'YYYY-MM-dd hh:mm:ss');
                this.getDetail.dtime=date;
                //获取设备sn
                this.getSN().then(()=>{
                    this.getPlateNum();
                    this.getHealth();
                }).then(()=>{
                    this.getDetail.hasNumber=true;
                    if(!this.getDetail.plate_num || !this.getDetail.plate_sn || this.getDetail.wifi!=1 || this.getDetail.portal!=1 || this.getDetail.compass!=1){
                            var content={
                                "type" : 2,
                                    "ctime":this.getDetail.dtime,
                                    "plate_num":this.getDetail.plate_num,
                                    "plate_sn":this.getDetail.plate_sn,
                                    "wifi":this.getDetail.wifi,
                                    "portal":this.getDetail.portal,
                                    "compass":this.getDetail.compass
                            };
                            fetch(ADDREP,{
                                method:"POST",
                                mode: "cors",
                                headers:{
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                body: `userid=${BASEINFO.userid}&plate_num=${this.getDetail.plate_num}&content=${JSON.stringify(content)}&type=2`
                            })
                                .then(response=>response.json())
                                .then(data=>{
                                    console.log(data);
                                    // console.log('send');
                                    var param=data.data;
                                    callN('sendCheckNumber',param);
                                })
                                .catch(e=>console.log(e));
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.isWaiting=false;
                        callN('msg',{
                            content: errcode.m404
                        })
                    });

                this.getDetail.status='';
            },
            getPlateNum(){
                //根据sn获取车牌号
                fetch(`${GETVEL}?equ_sn='${this.getDetail.plate_sn}'`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        this.isWaiting=false;
                        if(data.code==0){
                            this.getDetail.plate_num=data.data.plate_num;
                        }else{
                            callN('msg',{
                                content:data.message
                            })
                        }
                    }).catch(e=>{
                        console.log(e);
                        this.isWaiting=false;
                        callN('msg',{
                            content: errcode.m404
                        })
                    });
            },
            getHealth(){
                //获取设备检测详情
                this.$http.get(URL_HEALTH,{timeout:10000},{
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                    .then(message=>{
                        let data = message.body;
                        if (data && typeof data == 'string') {
                            data = JSON.parse(data);
                        }
                        // callN('msg',{content:data});
                        // this.isWaiting=false;
                        this.getDetail.compass=data.Compass=="OK"?'1':'0';
                        this.getDetail.wifi=data.WIFI=="OK"?'1':'0';
                        this.getDetail.portal=data.Portal=="OK"?'1':'0';
                    })
                    .catch(e=>{
                        console.log(e);
                        callN('msg',{
                            content: errcode.device
                        })
                    });
            },
            noCheck(){
                this.getDetail.hasNumber=false;//置空
                // this.getDetail.dtime=new Date().getTime();
                callN('msg',{content: errcode.deviceNoCheck});
            }
        },
        components: {
            commonTop,
            msg,
            loading
        }
    });




},false);
