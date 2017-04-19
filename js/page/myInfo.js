import "css/credentials.scss";

import Vue from "vue";
import commonTop from "common-top";
import {getN} from "nativeA";

window.addEventListener("DOMContentLoaded",()=>{
    const BASEINFO = getN('baseInfo');
    new Vue({
        el: "#myInfo",
        data: {
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
                fetch(`${BASEINFO.host}/app-dms/driver/getUserInfo?uid=${BASEINFO.uid}`)
                    .then(response=>response.json())
                    .then(message=>{
                        if (message.code==0) {
                            let data = message.data;
                            this.cmp_name = data.cmp_name;
                            this.name = data.name;
                            this.mobile = data.mobile;
                            this.license = data.license;
                            this.license_photo = data.license_photo;
                        }
                    })
                    .catch(e=>console.log(e));
            }
        },
        components: {
            commonTop
        }
    })
},false);
