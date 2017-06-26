<template>
    <div class="checkIn">
        <common-top title="签到"></common-top>   

        <div class="checkIn-column">
            <nav class="checkIn-header">
                <a @click="preMonth()" href="javascript:;"></a>
                <a href="javascript:;">{{curTime|yearMonth}}</a>
                <a @click="nextMonth()" href="javascript:;"></a>
            </nav>
            <div class="checkIn-calendar">
                <ul>
                    <li>日</li>
                    <li>一</li>
                    <li>二</li>
                    <li>三</li>
                    <li>四</li>
                    <li>五</li>
                    <li>六</li>
                </ul>
                <ol class="clearfix checkIn-date">
                    <li v-for="item in tempDays" :key="item-30"></li>
                    <li :class="{'cur':(index+1)==curDate,'auto':list.type==1,'manual':list.type==2}" v-for="(list,index) in checkList" :key="index">{{index+1}}</li>
                </ol>
            </div>
        </div>
        <div class="checkIn-icon">
            <span>人工签到</span>
            <span>自动签到</span>
            <span>当前位置</span>
        </div>
        <p :style="{'opacity':(checkInError?1:0)}" class="checkIn-msg">当前车辆签到不成功，请尝试重新签到。</p>
        
        <a @click="checkInLogin()" :class="['checkIn-login',isCheckIn?'disabled':'a_c']" href="javascript:;">签到</a>
    </div>
</template>

<script>
    /*
     * 1. 获取当月签到的记录，判断用户今天是否能签到
     * 1. 点击签到后，告知客户端走自动签到逻辑
     * 1. 没有连接往返wifi无法签到
     * 1. 签到所需车牌号通过设备接口sn->后台接口获取
     */

    const querystring = require('querystring');
    import { mapState,mapMutations,mapActions } from 'vuex';
    import errcode from "errcode";
    import commonTop from "common-top";
    import {getN,callN} from 'nativeA';
    import {dataFormat} from 'method';
    import {USERINFO,SIGNTOP,ADDSIGN} from 'inter';


    const BASEINFO = getN('getBase');
 
    export default {
        data(){
            return {
                curTime: Date.now(),    // 当前选择时间
                checkInError: false,    // 签到失败
                isCheckIn: true,       // 当天是否签到
                checkList: []   // 当月签到集合
            }
        },
        computed: {
            ...mapState({
                equ_sn: state=>state.deviceInfo.deviceSn,
                plate_num: state=>state.carInfo.plate_num
            }),
            tempDays(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth(),1);
                return d.getDay();
            },
            curDate(){
                let d = new Date();
                let c = new Date(this.curTime);
                if(d.getFullYear()==c.getFullYear() && d.getMonth()==c.getMonth()){
                    return d.getDate();
                }else{
                    return 99999;
                }
            }
        },
        mounted(){
            this.setCheckList();
            this.setCheckIn();
            
        },
        methods: {
            ...mapActions(["toast"]),
            ...mapMutations(["showLoad","hideLoad"]),
            preMonth(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth()-1,1);
                this.curTime = d.getTime();
                this.setCheckList();
            },
            nextMonth(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth()+1,1);
                this.curTime = d.getTime();
                this.setCheckList();
            },
            setDefaultCheckList(){
                let d = new Date(this.curTime);
                d.setFullYear(d.getFullYear(),d.getMonth()+1,0);
                let monthDays = d.getDate();
                let arr = [];
                for(var i = 0; i < monthDays; i++){
                    arr[i] = {};
                }
                this.checkList = arr;
            },
            setCheckIn(){
                fetch(`${BASEINFO.host}${USERINFO}?uid=${BASEINFO.uid}&access_token=${BASEINFO.access_token}&format=json`,{
                    cache: "no-cache"
                })
                    .then(response=>response.json())
                    .then(message=>{
                        this.isCheckIn = false;
                        if (message.code==0) {
                            if (message.data.last_sign_time && 
                                dataFormat(message.data.last_sign_time*1000,'YYYY-MM-DD') == dataFormat(Date.now(),'YYYY-MM-DD')) {
                                this.isCheckIn = true;
                            }
                        }else{
                            this.toast(message.message);
                        }
                    })
            },
            setCheckList(){
                this.setDefaultCheckList();

                let json = {
                    "format": "json",
                    "uid": BASEINFO.uid,
                    "month": dataFormat(this.curTime,'YYYY-MM'),
                    "access_token": BASEINFO.access_token
                };
                this.showLoad();
                const url = `${BASEINFO.host}${SIGNTOP}?${querystring.stringify(json)}`;
                fetch(url,{
                    "cache": "no-cache"
                })
                    .then(response=>response.json())
                    .then(message=>{
                        this.hideLoad();
                        if (message.code == 0) {
                            this.checkList = message.data;
                        }else{
                            this.toast(message.message);
                        }
                    })
                    .catch(e=>{
                        this.hideLoad();
                        console.log(e);
                        this.toast(errcode.m404);
                    });
            },
            checkInLogin(){
                if(this.isCheckIn){
                    return ;
                }
                if (getN('wifi').wangfan != 1) {
                    this.toast(errcode.checkinWiFi);
                    return ;
                }
                if (!this.plate_num) {
                    this.toast(errcode.checkinNum);
                    return ;
                }

                callN('autoCheckIn');
                this.showLoad();
                fetch(`${BASEINFO.host}${ADDSIGN}`,{
                    method: "POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: querystring.stringify({
                        format: "json",
                        token: BASEINFO.token,
                        uid: BASEINFO.uid,
                        plate_num: this.plate_num,
                        type: 2,
                        access_token: BASEINFO.access_token
                    })
                })
                    .then(response=>response.json())
                    .then(message=>{
                        this.hideLoad();
                        if (message.code==0) {
                            this.checkInError = false;
                            this.isCheckIn = true;

                            if (dataFormat(this.curTime,'YYYY-MM') == dataFormat(Date.now(),'YYYY-MM')) {
                                let d = new Date();
                                this.checkList[d.getDate()-1] = {
                                    data: dataFormat(d.getTime(),'YYYY-MM-DD'),
                                    type: 2
                                }
                            }

                            this.toast(errcode.checkinManual);
                        }else{
                            this.checkInError = true;
                            this.toast(message.message);
                        }
                    })
                    .catch(e=>{
                        this.hideLoad();
                        console.log(e);
                        this.toast(errcode.m404);
                    });
            }
        },
        components: {
            commonTop
        }
    }
</script>

<style lang="sass">
    @import "css/base";

    .checkIn {
        position: relative;
    }
    .checkIn-column {
        width: 6.9rem; 
        margin: 0.6rem auto 0;
        @extend %common-shadow;
    }
    .checkIn-header {
        display: flex;
        background-color: #F3F3F3;
        border-radius: 0.06rem 0.06rem 0 0;
        > a{
            display: block;
            height: 1.4rem;
            line-height: 1.4rem;
            &:nth-child(1),&:nth-child(3){
                width: 1.74rem;
                background-position: center center;
            }
            &:nth-child(1){
                @include bg2('zuo',0.18rem,0.32rem);
            }
            &:nth-child(3){
                @include bg2('you',0.18rem,0.32rem);
            }
            &:nth-child(2){
                width: 3.42rem;
                font-size: 0.4rem;
                color: $blackColor;
                text-align: center;
            }
        }
    }
    .checkIn-calendar{
        padding: 0.1rem 0.02rem;
        li{
            height: 0.95rem;
            line-height: 0.95rem;
            text-align: center;
            font-size: 0.34rem;
            color: $blackColor;
        }
        > ul{
            display: flex;
            > li{
                flex: 1;
            }
        }
        .checkIn-date li{
            float: left;
            position: relative;
            width: 0.98rem;
            &.cur{
                @include bg2('dangqianweizhi',0.6rem,0.6rem);
                background-position: center center;
            }
            &.manual{
                @include bg2('rengongqiandao',0.74rem,0.77rem);
                background-position: 0.03rem 0.07rem;
            }
            &.auto{
                @include bg2('zidongqiandao',0.74rem,0.77rem);
                background-position: 0.03rem 0.07rem;
                color: #fff;
            }
        }
    }
    .checkIn-icon{
        display: flex;
        padding: 0 0.3rem;
        > span{
            display: block;
            width: 1.94rem;
            height: 1.08rem;
            line-height: 1.08rem;
            font-size: 0.28rem;
            color: #7D7D7D;
            text-indent: 0.52rem;
            background-position: left center;
            &:nth-child(1){
                @include bg2('rengongqiandao',0.42rem,0.44rem);
            }
            &:nth-child(2){
                @include bg2('zidongqiandao',0.42rem,0.44rem);
            }
            &:nth-child(3){
                @include bg2('dangqianweizhi',0.3rem,0.3rem);
            }
        }
    }
    .checkIn-msg{
        height: 0.42rem;
        line-height: 0.42rem;
        margin-bottom: 0.66rem;
        text-indent: 0.84rem;
        color: $redColor;
        font-size: 0.28rem;
        @include bg2('jinggao',0.4rem,0.4rem);
        background-position: 0.3rem center;
    }
    .checkIn-login{
        width: 6.9rem;
        height: 0.88rem;
        line-height: 0.88rem;
        @extend %common-shadowBtn;
    }
</style>