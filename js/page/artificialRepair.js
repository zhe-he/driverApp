/**
 * Created by yangshuang on 2017/3/30.
 */
const querystring=require('querystring');
import "css/artificialRepair.scss";
import Vue from "vue";
import errcode from "errcode";
import VueResource from "vue-resource";
import commonTop from "common-top";
import loading from "loading";
import {getN,callN} from "nativeA";
// import {dataFormat} from "method";
import {ADDREP,GETVEL} from "inter";
import {URL_GETINFO} from "device";
Vue.use(VueResource);
window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('getBase');
    var fnObj = {
        "isSubmit":false,
        "input_flag":"",
        "len":0,
        "isWaiting":false,
        "getDetail":{
            // "ctime":"",
            "plate_num":"",
            "content":""


        }

    };
    new Vue({
        el: "#artificialRepair",
        data: fnObj,
        mounted(){
            const WIFI = getN('wifi');
            if(WIFI.wangfan==1){
                this.isWaiting=true;
                //获取设备sn
                this.$http.get(URL_GETINFO,{timeout:10000},{
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                    .then(response=>response.json())
                    .then(data=>{
                        return data.deviceSN;
                    })
                    .then(deviceSN=>{
                        //根据sn获取车牌号
                        let json = {
                            "equ_sn": deviceSN,
                            "access_token": BASEINFO.access_token,
                            "format": "json"
                        };
                        return fetch(`${BASEINFO.host}${GETVEL}?${querystring.stringify(json)}`,{
                            cache:"no-cache"
                        })
                            .then(response=>response.json())
                            .then(data=>{
                                this.isWaiting=false;
                                if(data.code==0){
                                    this.getDetail.plate_num=data.data.plate_num;
                                    this.input_flag=1;
                                }else{
                                    callN('msg',{
                                        content:data.message
                                    })
                                }
                            })

                    })
                    .catch(e=>{
                        console.log(e);
                        this.isWaiting=false;
                        callN('msg',{
                            content: errcode.m404
                        })
                    });
            }
            //去首空格
            function trimStr(str) {return str.replace(/^\s+/g,"");}
            /*date=dataFormat(date,'YYYY-MM-dd hh:mm:ss');
            fnObj.getDetail.ctime=date;*/
            
            this.$nextTick(()=>{
                var input=document.getElementById('plate_num');
                input.addEventListener('input',()=>{
                    this.input_flag=1;//.write
                });
                input.addEventListener('blur',()=>{
                    if(!this.getDetail.plate_num){
                        this.input_flag='';//.write
                    }
                });
                input.addEventListener('change',()=>{
                    if(this.getDetail.plate_num){
                        var re=/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
                        if(this.getDetail.plate_num.search(re)==-1)
                        {
                            this.input_flag=2;//.err
                            this.isSubmit=false;
                        }else{
                            if(this.getDetail.plate_num!='' &&  this.input_flag!=2 && this.getDetail.content!=''){
                                this.isSubmit=true;
                            }
                        }

                    }else{
                        this.isSubmit=false;
                    }
                });
                var faultDesc=document.getElementById('faultDesc');
                faultDesc.addEventListener('input',()=>{
                    this.getDetail.content=trimStr(this.getDetail.content);
                    if(this.getDetail.content.length>50){
                        this.getDetail.content=this.getDetail.content.substring(0,50);
                    }
                    this.len=this.getDetail.content.length;
                    if(this.getDetail.plate_num!='' &&  this.input_flag!=2 && this.getDetail.content!=''){
                        this.isSubmit=true;
                    }else{
                        this.isSubmit=false;
                    }
                });

            });

            


        },
        methods:{
            submitDate(){
                this.isWaiting=true;
                if(this.isSubmit==false){
                    this.isWaiting=false;
                    return;
                }
                fetch(`${BASEINFO.host}${ADDREP}`,{
                    method:"POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: querystring.stringify({
                        format: "json",
                        token: BASEINFO.token,
                        uid:BASEINFO.uid,
                        plate_num:this.getDetail.plate_num,
                        content:this.getDetail.content.trim(),
                        type:2,
                        access_token:BASEINFO.access_token
                    })
                })
                    .then(response=>response.json())
                    .then(data=>{
                        this.isWaiting=false;
                        if(data.code==0){
                            callN('msg',{content:errcode.repair});
                            setTimeout(()=>{
                                this.getDetail.content = '';
                                window.location.href='myRepairs.html';
                            },1000);
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
                    });
            }
        },
        components: {
            commonTop,
            loading
        }
    })
},false);