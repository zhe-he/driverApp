/**
 * 代码说明
 * 1. 获取当前用户是否在审核中
 * 1. 如果不在审核中，获取当前wifi的sn，通过sn获取公司名称等默认信息
 * 1. 如果在审核中，仅仅赋值
 * 1. 输入公司名称会向后台进行模糊查询并在前面显示列表
 */

const querystring = require('querystring');
import "css/credentials.scss";

import Vue from "vue";
import VueResource from "vue-resource";
import errcode from "errcode";
import {getN,callN} from "nativeA";
import {isAndroid} from "method";
import {URL_GETINFO} from "device";
import {GETVEL,USERINFO,COMPLIST,EDITINFO} from "inter";
import commonTop from "common-top";
import loading from "loading";
const RETEL = /^1[3-9]\d{9}$/;

Vue.use(VueResource);
window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN("getBase");
    const WIFI = getN('wifi');

    var creVue = new Vue({
        el: "#credentials",
        data: {
            isWaiting: false, // 加载条
            cmp_name: '',    // 公司
            cid: '',        // 公司id
            cmp_list: [],       // 公司联想集合
            cmp_list_switch: false, // 公司联系显示隐藏 true显示
            name: '', // 司机姓名
            mobile: '', // 司机电话
            license: '', // 驾驶证号
            license_photo: '', // 驾驶证照片
            isDisabled: false,
            credentials_status: '',
            credentials_message: '',
            equ_sn: '', // 设备sn
        },
        mounted(){
            this.getUser();
        },
        methods: {
            // 获取设备信息
            getEqu(){
                return this.$http.get(URL_GETINFO,{timeout: 10000})
                    .then(response=>response.json())
                    .then(data=>{
                        this.equ_sn = data.deviceID || data.deviceSN;
                    });
            },
            // 获取车辆信息
            getBus(){
                return fetch(`${BASEINFO.host}${GETVEL}`,{
                    method: "POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: querystring.stringify({
                        format: "json",
                        equ_sn: this.equ_sn,
                        access_token: BASEINFO.access_token
                    })
                })
                    .then(response=>response.json())
                    .then(message=>{
                        this.isWaiting = false;
                        if (message.code==0) {
                            this.cid = message.data.cmp_id;
                            this.cmp_name = message.data.cmp_name;
                        }else{
                            callN("msg",{"content": message.message});
                        }
                    });
            },
            // 查询用户信息
            getUser(){
                this.isWaiting = true;
                fetch(`${BASEINFO.host}${USERINFO}?uid=${BASEINFO.uid}&access_token=${BASEINFO.access_token}&format=json`,{
                    cache: "no-cache"   
                })
                    .then(response=>response.json())
                    .then(message=>{
                        if (message.code==0) {
                            let data = message.data;
                            
                            if (data.status>0){
                                this.isWaiting = false;

                                this.cmp_name = data.cmp_name;
                                this.cid = data.cid;
                                this.name = data.name;
                                this.mobile = data.mobile+'';
                                this.license = data.license;
                                this.license_photo = data.license_photo;
                                this.isDisabled = true;
                                this.credentials_status = 'success';
                            }else{
                                this.isDisabled = false;
                                this.setDefault();
                            }
                            if (data.status == 1) {
                                this.alertMsg('success','您的资料已经提交成功！<br/>资料正在审核中...');
                            }
                            if (data.status == 3) {
                                this.alertMsg('fail','您的资料审核未通过，<br/>请重新核实您的信息。');
                            }
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.isWaiting = false;
                        callN("msg",{"content": errcode.m404});
                    });
            },
            // 获取公司列表
            getCmp(){
                this.cid = '';
                if (this.cmp_name.length>=2) {
                    this.cmp_list_switch = true;
                    fetch(`${BASEINFO.host}${COMPLIST}`,{
                        method: "POST",
                        mode: "cors",
                        headers:{
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: querystring.stringify({
                            format: "json",
                            cmp_name: this.cmp_name,
                            access_token: BASEINFO.access_token
                        })
                    })
                        .then(response=>response.json())
                        .then(message=>{
                            if (message.code == 0) {
                                this.cmp_list = message.data.list.map(item=>{
                                    let re = new RegExp(this.cmp_name,'gi');
                                    item.cmp_name2 = item.cmp_name.replace(re,`<span>${this.cmp_name}</span>`);
                                    return item;
                                });
                            }
                        })
                        .catch(e=>console.log(e))
                }
            },
            // 设置默认信息
            setDefault(){
                this.mobile = BASEINFO.tel;
                if (WIFI.wangfan != 1) {
                    this.isWaiting = false;
                    callN("msg",{"content": errcode.device});
                    return false;
                }

                this.getEqu().then(this.getBus).catch(e=>{
                    console.log(e);
                    this.isWaiting = false;
                    callN("msg",{"content": errcode.m404});
                });
            },
            // 设置公司
            setCmp(list){
                this.cmp_list_switch = false;
                this.cmp_name = list.cmp_name;
                this.cid = list.cid;
            },
            alertMsg(status,msg){
                this.credentials_status = status;
                this.credentials_message = msg;
            },
            upFile(){
                if (!this.isDisabled) {
                    callN("upFile");
                }
            },
            // 验证提交
            commit(){
                if (this.credentials_status == "success" || this.credentials_status == "fail") {
                    this.alertMsg('','');
                    this.isDisabled = false;
                }else{
                    let { cmp_name,name,mobile,license,license_photo } = this.$data;
                    if(cmp_name.trim()===""){
                        this.alertMsg('error','请填写公司名称');
                        return false;
                    }
                    if (!this.cid) {
                        this.alertMsg('error',errcode.wfwifi);
                        return false;
                    }
                    if (name.trim()==='') {
                        this.alertMsg('error','请填写您的姓名');
                        return false;
                    }
                    if (!RETEL.test(mobile.trim())) {
                        this.alertMsg('error','请填写正确的联系电话');
                        return false;
                    }
                    if (license.trim() === '') {
                        this.alertMsg('error','请填写您的驾驶证号');
                        return false;
                    }
                    if (!license_photo) {
                        this.alertMsg('error','请上传您的驾驶证照片');
                        return false;
                    }
                    this.isWaiting = true;
                    fetch(`${BASEINFO.host}${EDITINFO}`,{
                        method: "POST",
                        mode: "cors",
                        headers:{
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: querystring.stringify({
                            format: "json",
                            access_token: BASEINFO.access_token,
                            token: BASEINFO.token,
                            uid: BASEINFO.uid,
                            cid: this.cid,
                            name: this.name,
                            license: this.license,
                            license_photo: this.license_photo,
                            mobile: this.mobile,
                            type: 1
                        })
                    })
                        .then(response=>response.json())
                        .then(message=>{
                            this.isWaiting = false;
                            if (message.code==0) {
                                this.alertMsg('success','您的资料已经提交成功！<br/>资料正在审核中...');
                                this.isDisabled = true;
                            }else{
                                callN("msg",{"content": message.message});
                            }
                        })
                        .catch(e=>{
                            console.log(e);
                            this.isWaiting = false;
                            callN("msg",{"content": errcode.m404});
                        });

                    
                }
                
            }
        },
        components: {
            commonTop,
            loading
        }
    });

    window.nativeCallback = function (type,param){
        if (isAndroid) {
            param = param?JSON.parse(param):'';
        }
        if (type == "upFile") {
            creVue.$data.license_photo = param.link;
        }else{
            console.log(`没有找到${type}方法，请确保H5有此回调方法`);
        }
    }
},false);
