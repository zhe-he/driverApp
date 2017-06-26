<template>
    <div>
        <input type="tel" v-model="mobile" placeholder="请输入手机号码" />
        <input type="tel" v-model="code" placeholder="验证码" />
        <a @click="getCode()" href="javascript:;">获取验证码</a>
        <a @click="signIn()" href="javascript:;">登陆</a>
    </div>
    
</template>


<script type="text/javascript">
    const querystring = require("querystring");
    import {getN} from "nativeA";

    const BASEINFO = getN('getBase');

    export default {
        data(){
            return {
                mobile: 15072496166,
                code: ""
            }
        },
        mounted(){

        },
        methods:{
            getCode(){
                fetch(BASEINFO.host+'/app-dms/sms/getCode?access_token='+BASEINFO.access_token+'&mobile='+this.mobile);
            },
            signIn(){
                fetch(BASEINFO.host+'/app-dms/driver/login',{
                    method: "POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: querystring.stringify({
                        format: "json",
                        mobile: this.mobile,
                        auth_code: this.code,
                        access_token: BASEINFO.access_token
                    })
                })
            }
        }
    }
</script>

<style scoped>
    input {
        width: 100%;
        height: 1rem;
        display: block;
        font-size: .4rem;
        box-sizing: border-box;
        margin-bottom: 0.2rem;
    }
    a{
        display: block;
    }
</style>