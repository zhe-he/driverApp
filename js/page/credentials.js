const querystring = require('querystring');
import "css/credentials.scss";

import Vue from "vue";
import {getN} from "nativeA";
import {clone} from "method";
import {URL_GETINFO} from "device";
import commonTop from "common-top";
import lrz from "lrz";
const RETEL = /^1[3-9]\d{9}$/;
window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN("baseInfo");

    new Vue({
        el: "#credentials",
        data: {
            cmp_name: '',    // 公司
            cid: '',        // 公司id
            cmp_list: [],       // 公司联想集合
            cmp_list_switch: false, // 公司联系显示隐藏 true显示
            name: '', // 司机姓名
            mobile: BASEINFO.tel, // 司机电话
            license: '', // 驾驶证号
            license_photo: '', // 驾驶证照片
            isDisabled: false,
            credentials_status: '',
            credentials_message: '',
            equ_sn: '', // 设备sn
            equ_mac: '' // 设备mac
        },
        mounted(){
            this.getUser();
            this.$nextTick(()=>{
                this.nativeEffect();
            });
        },
        methods: {
            // 获取设备信息
            getEqu(){
                fetch(URL_GETINFO,{
                    cache: 'no-cache'
                })
                    .then(response=>response.json())
                    .then(data=>{
                        this.equ_sn = data.deviceSN;
                        this.equ_mac = data.deviceMac;
                    })
                    .catch(err=>console.log(err));
            },
            // 获取车辆信息
            getBus(){
                fetch(BASEINFO.host+'/app-dms/device/getVelByField',{
                    method: "POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: querystring.stringify({
                        equ_sn: this.equ_sn,
                        equ_mac: this.equ_mac
                    })
                })
                    .then(response=>response.json())
                    .then(data=>{
                        console.log(data);
                    })
                    .catch(e=>console.log(e));
            },
            // 查询用户信息
            getUser(){
                fetch(`${BASEINFO.host}/app-dms/driver/getUserInfo?uid=${BASEINFO.uid}`,{
                    cache: "no-cache"   
                })
                    .then(response=>response.json())
                    .then(message=>{
                        console.log(clone(message));
                        if (message.code==0) {
                            let data = message.data;
                            if (data.status>0){
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
                            }
                            if (data.status == 1) {
                                this.alertMsg('success','您的资料已经提交成功！<br/>资料正在审核中...');
                            }
                            if (data.status == 3) {
                                this.alertMsg('error','审核失败，请完善您的资料');
                            }
                        }
                    })
                    .catch(e=>console.log(e));
            },
            // 获取公司列表
            getCmp(){
                console.log(this.cmp_name);
                if (this.cmp_name.length>=3) {
                    this.cmp_list_switch = true;
                    fetch(BASEINFO.host+'/app-crm/company/lists',{
                        method: "POST",
                        mode: "cors",
                        headers:{
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: querystring.stringify({
                            cmp_name: this.cmp_name,
                            size: 20
                        })
                    })
                        .then(response=>response.json())
                        .then(message=>{
                            if (message.code == 0) {
                                this.cmp_list = message.data.list;
                            }
                        })
                        .catch(e=>console.log(e))
                }
            },
            // 设置公司
            setCmp(list){
                this.cmp_list_switch = false;
                this.cmp_name = list.cmp_name;
                this.cid = list.id;
            },
            alertMsg(status,msg){
                this.credentials_status = status;
                this.credentials_message = msg;
            },
            // 原生事件
            nativeEffect(){
                var _this = this;
                // 图片上传
                document.querySelector('#file').addEventListener('change', function () {
                    lrz(this.files[0])
                        .then(rst =>{
                            _this.license_photo = rst.base64;
                        })
                        .catch(err=>console.log(err))
                        .always(()=>{});
                });
            },
            // 验证提交
            commit(){
                if (this.credentials_status !== '') {
                    this.alertMsg('','');
                    this.isDisabled = false;
                }else{
                    let { cmp_name,name,mobile,license,license_photo } = this.$data;
                    if (cmp_name.trim()==='') {
                        this.alertMsg('error','请填写公司名称');
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
                    fetch(`${BASEINFO.host}/app-dms/driver/editUserInfo`,{
                        method: "POST",
                        mode: "cors",
                        headers:{
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: querystring.stringify({
                            uid: BASEINFO.uid,
                            cid: this.cid,
                            name: this.name,
                            license: this.license,
                            license_photo: this.license_photo,
                            type: 1
                        })
                    })
                        .then(response=>response.json())
                        .then(message=>{
                            if (message.code==0) {
                                this.alertMsg('success','您的资料已经提交成功！<br/>资料正在审核中...');
                                this.isDisabled = true;
                            }else{

                            }
                        })
                        .catch(e=>console.log(e));

                    
                }
                
            }
        },
        components: {
            commonTop
        }
    })
},false);
