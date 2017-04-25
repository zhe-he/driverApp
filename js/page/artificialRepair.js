/**
 * Created by yangshuang on 2017/3/30.
 */
import "css/artificialRepair.scss"
import Vue from "vue";
import errcode from "errcode";
import VueResource from "vue-resource";
import commonTop from "common-top";
import loading from "loading";
import {getN,callN} from "nativeA";
import {jsonp,dataFormat} from "method";
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
            "ctime":"",
            "plate_num":"",
            "content":""


        }

    };
    new Vue({
        el: "#artificialRepair",
        data:fnObj,
        mounted(){
            var date=new Date(),_this=this;
            const WIFI = getN('wifi');
            if(WIFI.wangfan==1){
                //获取设备sn
                this.$http.get(URL_GETINFO,{timeout:10000},{
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                    .then(response=>response.json())
                    .then(data=>{
                        console.log(data);
                        return data.deviceSN;
                    })
                    .then((deviceSN)=>{
                        //根据sn获取车牌号
                        return fetch(`${GETVEL}?equ_sn='${deviceSN}'`,{
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
                            })

                    })
                    .catch(e=>{
                        console.log(e);
                        callN('msg',{
                            content: errcode.m404
                        })
                    });
            }
            //去首空格
            function trimStr(str) {return str.replace(/(^\s*)/g,"");}
            date=dataFormat(date,'YYYY-MM-dd hh:mm:ss');
            fnObj.getDetail.ctime=date;
            var input=document.getElementById('plate_num');
            input.addEventListener('input',()=>{
                _this.input_flag=1;//.write
            });
            input.addEventListener('blur',()=>{
                if(!_this.getDetail.plate_num){
                    _this.input_flag='';//.write
                }
            });
            input.addEventListener('change',()=>{
                if(_this.getDetail.plate_num){
                    var re=/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
                    if(_this.getDetail.plate_num.search(re)==-1)
                    {
                        _this.input_flag=2;//.err
                        _this.isSubmit=false;
                        //console.log("输入的车牌号格式不正确");
                    }else{
                        if(_this.getDetail.plate_num!='' &&  _this.input_flag!=2 && _this.getDetail.content!=''){
                            _this.isSubmit=true;
                        }
                    }

                }else{
                    _this.isSubmit=false;
                }
            });
            var faultDesc=document.getElementById('faultDesc');
            faultDesc.addEventListener('input',()=>{
                _this.getDetail.content=trimStr(_this.getDetail.content)
                if(_this.getDetail.content.length>50){
                    _this.getDetail.content=_this.getDetail.content.substring(0,50);
                }
                _this.len=_this.getDetail.content.length;
                if(_this.getDetail.plate_num!='' &&  _this.input_flag!=2 && _this.getDetail.content!=''){
                    _this.isSubmit=true;
                }else{
                    _this.isSubmit=false;
                }
            });


        },
        methods:{
            submitDate(){
                this.isWaiting=true;
                var _this=this;
                if(_this.isSubmit==false){
                    this.isWaiting=false;
                    return;
                }
                console.log(_this.getDetail);
                fetch(ADDREP,{
                    method:"POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: `userid=${BASEINFO.userid}&plate_num=${_this.getDetail.plate_num}&content=${this.getDetail.content}&type=2`
                })
                    .then(response=>response.json())
                    .then(data=>{
                        _this.isWaiting=false;
                        if(data.code==0){
                            console.log(data);
                            window.location.href='myRepairs.html';
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