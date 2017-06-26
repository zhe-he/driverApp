<template>
    <div>
        <common-top title="设备自检"></common-top>
        <div class="content">
            <div>
                <p>请在WiFi状态下：进行设备每日检测</p>
                <dl>
                    <dt>检测时间：</dt>
                    <dd v-if="getDetail.ctime==''"></dd>
                    <dd v-else>{{getDetail.ctime | timeFormat}}</dd>
                </dl>
            </div>
            <b></b>
            <div>
                <span>当前监测情况：</span>
                <ul>
                    <li>
                        车牌号：<span>{{getDetail.plate_num}}</span>
                        <p>
                            <span v-if="!getDetail.plate_num&&getDetail.status==1">已报修</span>
                            <template v-else>
                                <span v-if="!getDetail.plate_num&&getDetail.status==2">已处理</span>
                            </template>
                            <i :class="[flag_num==0?'':flag_num==3?'loading':flag_num==2?'normal':'err']"></i>
                        </p>
                    </li>
                    <li>
                        设备SN：<span>{{getDetail.plate_sn}}</span>
                        <p>
                            <span v-if="!getDetail.plate_sn&&getDetail.status==1">已报修</span>
                            <template v-else>
                                <span v-if="!getDetail.plate_sn&&getDetail.status==2">已处理</span>
                            </template>
                            <i :class="[flag_sn==0?'':flag_sn==3?'loading':flag_sn==2?'normal':'err']"></i>
                        </p>
                    </li>
                    <li>
                        WiFi连接 <span></span>
                        <p>
                            <span v-if="getDetail.wifi!=1&&getDetail.status==1">已报修</span>
                            <template v-else>
                                <span v-if="getDetail.wifi!=1&&getDetail.status==2">已处理</span>
                            </template>
                            <i :class="[flag_wifi==0?'':flag_wifi==3?'loading':flag_wifi==2?'normal':'err']"></i>
                        </p>
                    </li>
                    <li>Portal页面 <span></span>
                        <p>
                            <span v-if="getDetail.portal!=1&&getDetail.status==1">已报修</span>
                            <template v-else>
                                <span v-if="getDetail.portal!=1&&getDetail.status==2">已处理</span>
                            </template>
                            <i :class="[flag_portal==0?'':flag_portal==3?'loading':flag_portal==2?'normal':'err']"></i>
                        </p>
                    <li>北斗定位 <span></span>
                        <p>
                            <span v-if="getDetail.compass!=1&&getDetail.status==1">已报修</span>
                            <template v-else>
                                <span v-if="getDetail.compass!=1&&getDetail.status==2">已处理</span>
                            </template>
                            <i :class="[flag_compass==0?'':flag_compass==3?'loading':flag_compass==2?'normal':'err']"></i>
                        </p>
                    </li>
                    <li>设备4G <span></span>
                        <p>
                            <span v-if="getDetail._4G!=1&&getDetail.status==1">已报修</span>
                            <template v-else>
                                <span v-if="getDetail._4G!=1&&getDetail.status==2">已处理</span>
                            </template>
                            <i :class="[flag_4G==0?'':flag_4G==3?'loading':flag_4G==2?'normal':'err']"></i>
                        </p>
                    </li>
                </ul>
            </div>

            <a class="a_c bottomBtn" v-if="getDetail.status_flag==2 && isWifi==1" @click="selfCheck()">
                <b><u></u>自检刷新</b>
            </a>
        </div>
    </div>
</template>


<script>
    /**
     * Created by yangshuang on 2017/3/31.
     * 1. 向APP获取今天是否进行过自检   
     * > 1.1 如果没有，提示errcode.deviceNoCheck  
     * > 1.2 如果有进行过自检，向APP获取是否有自检单号    
     * > 1.2.1 如果没有自检单号，向APP获取当前是否连接了往返wifi  
     * > 1.2.1.1 如果没有连接往返wifi，提示errcode.deviceCheck    
     * > 1.2.1.2 如果连接了往返wifi，通过设备接口获取设备sn，判断当前获取的sn和app上次自检返回的sn是否一致   
     * > 1.2.1.2.1 如果一致，除了车牌号其他全部打对勾，车牌号通过接口获取   
     * > 1.2.1.2.2 如果不一致，程序自动进行设备自检     
     * > 1.2.2 如果有自检单号，通过后台获取信息显示到页面上（已报修/已处理）  
     * > 1.2.2.1 如果已处理，页面显示刷新按钮，点击刷新 设备自检一次     
     * > 1.2.2.1.1 如果请求失败或服务器返回错误，可以继续点击    
     * > 1.2.2.1.2 如果请求成功，刷新按钮隐藏    
     *
     * - 只要是进行了自检，都必须传给APP->是否自检过，单号
     */
    const querystring = require('querystring');
    import { mapMutations,mapActions } from 'vuex';
    import errcode from "errcode";
    import commonTop from "common-top";
    import {getN,callN} from "nativeA";
    import {URL_GETINFO,URL_HEALTH} from "device";
    import {GETREPORT,ADDREP,GETVEL} from "inter";

    const BASEINFO = getN('getBase');
    export default {
        data(){
            return {
                "isWifi":getN('wifi').wangfan,
                "flag_num":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
                "flag_sn":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
                "flag_wifi":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
                "flag_portal":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
                "flag_compass":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
                "flag_4G":0,//0-不显示图标 1-显示 .err 2-显示 .normal 3- 显示 .loading
                "getDetail":{
                    "ctime":"",
                    "plate_num":"",
                    "plate_sn":"",
                    "protal":"",
                    "compass":"",
                    "wifi":"",
                    "_4G":"",
                    "status":"",
                    "status_flag":""
                },
                "selfChecking": false // 设备自检中 
            };
        },
        mounted(){
            const NUMBER = getN('getAutoCheckNumber');


            if(NUMBER.isChecked==1){
                if(NUMBER.number){
                    // this.showLoad();
                    this.flag_num=3;this.flag_sn=3;this.flag_wifi=3;this.flag_portal=3;this.flag_compass=3;this.flag_4G=3;
                    fetch( `${BASEINFO.host}${GETREPORT}?number=${NUMBER.number}&access_token=${BASEINFO.access_token}&format=json`,{
                        cache:"no-cache"
                    })
                        .then(response=>response.json())
                        .then(data=>{
                            // this.hideLoad();
                            var result=data.data;
                            if(data.code==0){
                                let data=typeof (result.content)=='string'?JSON.parse( result.content ):result.content;
                                this.getDetail.compass = (data.Compass && data.Compass.toString().trim().toUpperCase()=="OK")?'1':data.Compass;
                                this.getDetail.wifi = (data.WIFI && data.WIFI.toString().trim().toUpperCase()=="OK")?'1':data.WIFI;
                                this.getDetail.portal = (data.Portal && data.Portal.toString().trim().toUpperCase()=="OK")?'1':data.Portal;
                                this.getDetail._4G = (data["4G"] && data['4G'].toString().trim().toUpperCase()=="OK")?'1':data['4G'];
                                this.getDetail.plate_num=data.plate_num;
                                this.getDetail.plate_sn=data.plate_sn;
                                this.getDetail.ctime=result.ctime;
                                this.flag_num=this.getDetail.plate_num?2:1;
                                this.flag_sn=this.getDetail.plate_sn?2:1;
                                this.flag_wifi=this.getDetail.wifi==1?2:1;
                                this.flag_portal=this.getDetail.portal==1?2:1;
                                this.flag_compass=this.getDetail.compass==1?2:1;
                                this.flag_4G=this.getDetail._4G==1?2:1;
                                this.getDetail.status=result.status;
                                this.getDetail.status_flag=result.status;
                            }else{
                                this.isIcon();
                                this.toast(data.message);
                            }
                        })
                        .catch(e=>{
                            console.log(e);
                            // this.hideLoad();
                            this.isIcon();
                            this.toast(errcode.m404);
                        })
                }else{
                    if(this.isWifi==1){
                        // this.showLoad();
                        this.flag_num=3;this.flag_sn=3;this.flag_wifi=3;this.flag_portal=3;this.flag_compass=3;this.flag_4G=3;
                        this.getSN()
                            .then((plate_sn)=>{
                                // this.hideLoad();
                                if(plate_sn==NUMBER.plate_sn){
                                    // this.showLoad();
                                    this.getDetail.ctime=NUMBER.ctime;
                                    this.getDetail.plate_sn=plate_sn;
                                    this.getPlateNum();
                                    this.getDetail.wifi=1;
                                    this.getDetail.portal=1;
                                    this.getDetail.compass=1;
                                    this.getDetail._4G=1;
                                    this.flag_wifi=this.getDetail.wifi==1?2:1;
                                    this.flag_portal=this.getDetail.portal==1?2:1;
                                    this.flag_compass=this.getDetail.compass==1?2:1;
                                    this.flag_4G=this.getDetail._4G==1?2:1;
                                }else{
                                    this.isIcon();
                                    this.selfCheck();
                                }
                            }).catch(e=>{
                                console.log(e);
                                // this.hideLoad();
                                this.isIcon();
                                this.toast(errcode.device);
                            })
                    }else{

                        this.toast(errcode.deviceCheck);
                    }
                }
            }else{
                this.noCheck();
            }
        },
        methods:{
            ...mapActions(["toast"]),
            ...mapMutations(["showLoad","hideLoad"]),
            getSN(){
                return this.$http.get(URL_GETINFO,{timeout:10000})
                    .then(response=>response.json())
                    .then(data=>{
                        this.getDetail.plate_sn=data.deviceID || data.deviceSN;
                        this.flag_sn=this.getDetail.plate_sn?2:1;
                        this.getDetail.plate_num='';
                        return data.deviceID || data.deviceSN;
                    })
            },
            selfCheck(){
                if (this.selfChecking) {
                    return ;
                }
                this.selfChecking = true;
                // this.showLoad();
                this.getDetail.ctime=parseInt(Date.now()/1000);
                this.flag_num=3;this.flag_sn=3;this.flag_wifi=3;this.flag_portal=3;this.flag_compass=3;this.flag_4G=3;
                this.getDetail.plate_num='';
                this.getDetail.plate_sn='';
                this.getDetail.wifi='';
                this.getDetail.portal='';
                this.getDetail.compass='';
                this.getDetail._4G='';
                this.getDetail.status='';
                
                //获取设备sn
                this.getSN().then(this.getPlateNum)
                    .then(()=>{
                        // this.showLoad();
                        return this.getHealth();
                    })
                    .then(()=>{
                        this.selfChecking = false;
                        if(!this.getDetail.plate_num || !this.getDetail.plate_sn || this.getDetail.wifi!=1 || this.getDetail.portal!=1 || this.getDetail.compass!=1|| this.getDetail._4G!=1){
                            var content={
                                    "ctime":this.getDetail.ctime,
                                    "plate_num":this.getDetail.plate_num,
                                    "plate_sn":this.getDetail.plate_sn,
                                    "WIFI":this.getDetail.wifi==1?'OK':this.getDetail.wifi,
                                    "Portal":this.getDetail.portal==1?'OK':this.getDetail.portal,
                                    "4G":this.getDetail._4G==1?'OK':this.getDetail._4G,
                                    "Compass":this.getDetail.compass==1?'OK':this.getDetail.compass
                            };

                            fetch(`${BASEINFO.host}${ADDREP}`,{
                                method:"POST",
                                mode: "cors",
                                headers:{
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                body: querystring.stringify({
                                    format: "json",
                                    token: BASEINFO.token,
                                    uid: BASEINFO.uid,
                                    access_token: BASEINFO.access_token,
                                    plate_num: this.getDetail.plate_num,
                                    content: JSON.stringify(content),
                                    type: 1
                                })
                            })
                                .then(response=>response.json())
                                .then(data=>{
                                    if(data.code==0){
                                        this.getDetail.status=1;
                                        this.getDetail.status_flag=1;
                                        let param=data.data;
                                        param.isChecked=1;
                                        param.plate_sn=this.getDetail.plate_sn;
                                        callN('sendCheckNumber',param);
                                    }else{
                                        this.getDetail.status='';
                                        this.getDetail.status_flag=2;
                                    }

                                })
                                .catch(e=>{
                                    this.getDetail.status_flag=2;
                                    console.log(e);
                                    this.toast(errcode.m404);
                                });
                        }else{
                            this.getDetail.status_flag=1;
                            let param={
                                "isChecked":1,
                                "number": "",
                                "ctime": Date.now(),
                                "plate_sn":this.getDetail.plate_sn
                            };
                            callN('sendCheckNumber',param);
                        }
                    })
                    .catch(e=>{
                        this.selfChecking = false;
                        // this.getDetail.status_flag=2;
                        console.log(e);
                        // this.hideLoad();
                        this.isIcon();
                        this.toast(errcode.m404);
                    });

            },
            getPlateNum(){
                //根据sn获取车牌号
                return fetch(`${BASEINFO.host}${GETVEL}?equ_sn=${this.getDetail.plate_sn}&access_token=${BASEINFO.access_token}&format=json`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        // this.hideLoad();
                        if(data.code==0){
                            this.getDetail.plate_num=data.data.plate_num;
                            this.flag_num=this.getDetail.plate_num?2:1;
                        }else{
                            this.flag_num=1;
                            this.toast(data.message);
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.flag_num=1;
                        // this.getDetail.status_flag=2;
                        this.toast(errcode.m404);
                    });
            },
            getHealth(){
                //获取设备检测详情
                return this.$http.get(URL_HEALTH,{timeout:20000},{
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                    .then(response=>response.json())
                    .then(data=>{
                        // this.hideLoad();
                        this.getDetail.compass=data.Compass.toString().trim().toUpperCase()=="OK"?'1':data.Compass;
                        this.getDetail.wifi=data.WIFI.toString().trim().toUpperCase()=="OK"?'1':data.WIFI;
                        this.getDetail.portal=data.Portal.toString().trim().toUpperCase()=="OK"?'1':data.Portal;
                        this.getDetail._4G=data['4G'].toString().trim().toUpperCase()=="OK"?'1':data['4G'];
                        this.flag_wifi=this.getDetail.wifi==1?2:1;
                        this.flag_portal=this.getDetail.portal==1?2:1;
                        this.flag_compass=this.getDetail.compass==1?2:1;
                        this.flag_4G=this.getDetail._4G==1?2:1;
                    })
            },
            noCheck(){
                this.isIcon();
                this.toast(errcode.deviceNoCheck);
            },
            isIcon(){
                this.flag_num=0;
                this.flag_sn=0;
                this.flag_wifi=0;
                this.flag_portal=0;
                this.flag_compass=0;
                this.flag_4G=0;
            }
        },
        components: {
            commonTop
        }
    }
</script>


<style lang="sass" scoped>
    @import "css/base";

    .content{
        width: 6.3rem;
        height:10.07rem;
        margin: 0.45rem auto 0;
        padding: .42rem .3rem .85rem;
        position: relative;
        @extend %common-shadow;
        >div{
            p{
                line-height: .62rem;
            }
            dl{
                color: $greyColor;
                display: flex;
                font-size: .3rem;
                line-height: .62rem;
                dt{
                    flex: 1;
                    white-space: nowrap;
                }
                dd{
                    flex:3;
                    @include eps;
                }
            }
        }
        >div{
            >span{
                line-height: .82rem;
            }
            ul{
                line-height: .82rem;
                li{
                    position: relative;
                    span{
                        color: #247BFF;
                    }
                    >p{
                        position: absolute;
                        line-height: .82rem;
                        top: 0;
                        right:.67rem;
                        >i{
                            position: absolute;
                            width:.398rem;
                            height:.398rem;
                            right:-.67rem;
                            top:.21rem;
                        }
                    }


                }
            }
        }

        >b{
            display: block;
            border: 1px solid #dfdfdf;
            margin:.3rem 0;
        }
        .bottomBtn{
            height:.88rem;
            line-height: .88rem;
            margin:0 auto;
            position: absolute;
            bottom: .85rem;
            text-align: center;
            width:6.3rem;
            @extend %common-shadowBtn;
            b{
                position: relative;
                >u{
                    @include bg2("icon_refresh");
                    position: absolute;
                    top:.035rem;
                    left: -.5rem;
                    width:.4rem;
                    height: .41rem;
                }
            }

        }

    }   
    .normal{
        @include bg2("normal");
        animation:rotatingNot 1.2s linear infinite;
    }
    .err{
        @include bg2("icon_fail");
        animation:rotatingNot 1.2s linear infinite;
    }
    .loading{
        @include bg2("icon_loading");
        animation:rotating 1.2s linear infinite;
    }
    @keyframes rotating{
        from{transform:rotate(0)}
        to{transform:rotate(360deg)}
    }
    @keyframes rotatingNot{
        from{transform:rotate(0)}
        to{transform:rotate(0)}
    }
</style>