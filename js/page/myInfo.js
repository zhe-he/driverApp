import "css/credentials.scss";

import Vue from "vue";
import errcode from "errcode";
import commonTop from "common-top";
import loading from "loading";
import {getN,callN} from "nativeA";

window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('getBase');
    new Vue({
        el: "#myInfo",
        data: {
            isWaiting: false,
            cmp_name: '',
            name: '',
            mobile: '',
            license: '',
            license_photo: '' // '../images/tmp/zhengjian4.png'
        },
        mounted(){
            this.getUserInfo();
        },
        methods: {
            getUserInfo(){
                this.isWaiting = true;
                fetch(`${BASEINFO.host}/app-dms/driver/getUserInfo?uid=${BASEINFO.uid}`)
                    .then(response=>response.json())
                    .then(message=>{
                        this.isWaiting = false;
                        if (message.code==0) {
                            let data = message.data;
                            this.cmp_name = data.cmp_name;
                            this.name = data.name;
                            this.mobile = data.mobile;
                            this.license = data.license;
                            this.license_photo = data.license_photo;
                        }else{
                            callN("msg",{"content": message.message})
                        }
                    })
                    .catch(e=>{
                        this.isWaiting = false;
                        console.log(e);
                        callN("msg",{"content": errcode.m404});
                    });
            }
        },
        components: {
            commonTop,
            loading
        }
    })
},false);
