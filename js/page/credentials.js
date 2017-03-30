import "css/credentials.scss";

import Vue from "vue";

const RETEL = /^1[3-9]\d{9}$/;
window.addEventListener("DOMContentLoaded",()=>{
    new Vue({
        el: "#credentials",
        data: {
            company: '',
            driverName: '',
            driverTel: '',
            driverNumber: '',
            driverPic: '',
            isDisabled: false,
            credentials_status: '',
            credentials_message: ''
        },
        mounted(){

        },
        watch: {
            
        },
        methods: {
            alertMsg(status,msg){
                this.credentials_status = status;
                this.credentials_message = msg;
            },
            changePic(){

            },
            commit(){
                if (this.credentials_status === 'success') {
                    this.alertMsg('','');
                    this.isDisabled = false;
                }else{
                    let { company,driverName,driverTel,driverNumber,driverPic } = this.$data;
                    if (company.trim()==='') {
                        this.alertMsg('error','请填写公司名称');
                        return false;
                    }
                    if (driverName.trim()==='') {
                        this.alertMsg('error','请填写您的姓名');
                        return false;
                    }
                    if (!RETEL.test(driverTel.trim())) {
                        this.alertMsg('error','请填写正确的联系电话');
                        return false;
                    }
                    if (driverNumber.trim() === '') {
                        this.alertMsg('error','请填写您的驾驶证号');
                        return false;
                    }
                    /*if (driverPic.trim() === '') {
                        this.alertMsg('error','请上传您的驾驶证照片');
                        return false;
                    }*/

                    this.alertMsg('success','您的资料已经提交成功！<br/>资料正在审核中...');
                    this.isDisabled = true;
                }
                
            }
        }
    })
},false);
