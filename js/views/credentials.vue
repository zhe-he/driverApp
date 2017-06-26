<template>
    <div>
        <common-top :back-type="-2" title="完善信息"></common-top>   
        <section class="credentials-box">
            <div class="credentials-item">
                <span>公司名称</span>
                <b v-show="isDisabled">{{cmp_name}}</b>
                <input @input="getCmp()" v-show="!isDisabled" v-model="cmp_name" maxlength="30" type="text" />
            </div>
            <ul :class="['credentials-prompt',cmp_list_switch?'show':'']">
                <li @click="setCmp(list)" :key="list.cid" v-for="(list,index) in cmp_list" v-html="list.cmp_name2"></li>
            </ul>
            <div class="credentials-item">
                <span>司机姓名</span>
                <b v-show="isDisabled">{{name}}</b>
                <input v-show="!isDisabled" v-model="name" maxlength="8" type="text" />
            </div>
            <div class="credentials-item">
                <span>联系电话</span>
                <b v-show="isDisabled">{{mobile}}</b>
                <input v-show="!isDisabled" v-model="mobile" maxlength="11" type="tel" />
            </div>
            <div class="credentials-item">
                <span>驾驶证号</span>
                <b v-show="isDisabled">{{license}}</b>
                <input v-show="!isDisabled" v-model="license" type="text" />
            </div>
            <div class="credentials-photo">
                <p>驾驶证照片（照片为驾驶证信息主页）</p>
                <a @click="callPhoto()" href="javascript:;">
                    <img :src="license_photo?license_photo:'images/tmp/zhengjian4.png'" />
                </a>
            </div>
        </section>
        <p :class="['credentials-tip',credentials_status]"><i></i><span v-html="credentials_message"></span></p>
        <a @click="commit()" class="credentials-btn a_c" href="javascript:;" v-text="isDisabled?'修改信息':'完成'"></a>
    </div>
</template>

<style lang="sass">
    @import "css/credentials";
</style>

<script>
    /**
     * 代码说明
     * 1. 获取当前用户是否在审核中
     * 1. 如果不在审核中，获取当前wifi的sn，通过sn获取公司名称等默认信息
     * 1. 如果在审核中，仅仅赋值
     * 1. 输入公司名称会向后台进行模糊查询并在前面显示列表
     */

    const querystring = require('querystring');
    import { mapState,mapMutations,mapActions } from 'vuex';
    import errcode from "errcode";
    import {getN} from "nativeA";
    import {USERINFO,COMPLIST,EDITINFO} from "inter";
    import commonTop from "common-top";
    const RETEL = /^1[3-9]\d{9}$/;

    const BASEINFO = getN("getBase");

    export default {
        data(){
            return {
                cmp_list: [],       // 公司联想集合
                cmp_list_switch: false, // 公司联系显示隐藏 true显示
                name: '', // 司机姓名
                mobile: '', // 司机电话
                license: '', // 驾驶证号
                isDisabled: false,
                credentials_status: '',
                credentials_message: '',
                cmp_name: '',
                cid: '',
            }
        },
        mounted(){
            this.getUser();
        },
        watch: {
            cmp_name2(newVal){
                if (!this.cmp_name) {
                    this.cmp_name = newVal;
                    this.cid = this.cid2;
                }
            }
        },
        computed: mapState({
            "license_photo": state => state.userInfo.license_photo,
            "cmp_name2": state => state.carInfo.cmp_name,
            "cid2": state => state.carInfo.cmp_id,
            "equ_sn": state => state.deviceInfo.deviceSN
        }),
        methods: {
            ...mapActions(["toast"]),
            ...mapMutations(["showLoad","hideLoad","setPhoto","showPhoto"]),
            
            // 查询用户信息
            getUser(){
                this.showLoad();
                fetch(`${BASEINFO.host}${USERINFO}?uid=${BASEINFO.uid}&access_token=${BASEINFO.access_token}&format=json`,{
                    cache: "no-cache"   
                })
                    .then(response=>response.json())
                    .then(message=>{
                        this.hideLoad();
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
                                this.cmp_name = data.cmp_name;
                            }else{
                                this.isDisabled = false;
                                this.mobile = BASEINFO.tel;
                                this.setDefault();
                            }
                            if (data.status == 1) {
                                this.alertMsg('success','您的资料已经提交成功！<br/>资料正在审核中...');
                            }
                            if (data.status == 3) {
                                this.alertMsg('fail','您的资料审核未通过，<br/>请重新核实您的信息。');
                            }
                        }else{
                            this.isDisabled = false;
                            this.setDefault();
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.hideLoad();
                        this.toast(errcode.m404);
                    });
            },
            setDefault(){
                this.mobile = BASEINFO.tel+'';
                this.cid = this.cid2;
                this.cmp_name = this.cmp_name2;
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
            callPhoto(){
                if (!this.isDisabled) {
                    this.setPhoto(1);
                    this.showPhoto();
                }
            },
            // 验证提交
            commit(){
                if (this.credentials_status == "success" || this.credentials_status == "fail") {
                    this.alertMsg('','');
                    this.isDisabled = false;
                }else{
                    let { cmp_name,name,mobile,license } = this.$data;
                    if(cmp_name.trim()===""){
                        this.alertMsg('error','请填写公司名称');
                        return false;
                    }
                    if (!this.cid) {
                        this.alertMsg('error','没有查询到该公司名称，<br>请检查是否已连接往返免费wifi');
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
                    if (!this.license_photo) {
                        this.alertMsg('error','请上传您的驾驶证照片');
                        return false;
                    }
                    this.showLoad();
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
                            this.hideLoad();
                            if (message.code==0) {
                                this.alertMsg('success','您的资料已经提交成功！<br/>资料正在审核中...');
                                this.isDisabled = true;
                            }else{
                                this.toast(message.message);
                            }
                        })
                        .catch(e=>{
                            console.log(e);
                            this.hideLoad();
                            this.toast(errcode.m404);
                        });
                }
                
            }
        },
        components: {
            commonTop
        }
    }
</script>