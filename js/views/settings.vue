<template>

    <div class="setting-warpper">
        <common-top title="设置"></common-top>

        <nav class="settings-box">
            <a v-show="isAndroid" @click="cleanCache()" href="javascript:;" class="settings-item">
                <p>清除本地缓存</p>
                <span>{{cache}}</span>
            </a>
            <a v-show="isAndroid" @click="updateApp()" href="javascript:;" :class="['settings-item',isCanUpdate?'active':'','bg']">
                <p>版本更新</p>
                <i></i>
            </a>
            <router-link tag="a" to="aboutUs" class="settings-item bg"><p>关于我们</p></router-link>
        </nav>
        <a @click="signOut()" class="settings-signOut a_c" href="javascript:;">注销</a>
        <hm-msg></hm-msg>
    </div>
</template>


<script>
    /**
     * 1. 获取最新版本信息，如有新版本，小红点提示
     * 1. 更新、清缓存、注销 调用客户端方法
     */
    import eventHub from "eventHub";
    import errcode from "errcode";
    import { mapActions } from 'vuex';
    import commonTop from "common-top";
    import {getN,callN} from "nativeA";
    import {GETVER} from "inter";
    import {isAndroid} from "method";
    import hmMsg from "hm-msg";

    const BASEINFO = getN("getBase");
    var reVersion = /(iOSApp|AndroidApp)\/wangfanDriver\s+(\d+\.\d+\.\d+)/i.exec(window.navigator.userAgent);

    export default {
        data(){
            return {
                isAndroid: isAndroid,
                cache: "",
                isCanUpdate: false,
                updateUrl: "",
                checkUpdate: false, 
                version: (reVersion?reVersion[2]:"1.0.0")
            }
        },
        mounted(){
            this.getCanupdata();
            this.cache = getN("getCache").size;

            eventHub.$on("msg-confirm",(content,type)=>{
                switch(type){
                    case 1:
                        callN('cleanCache');
                        this.cache = "0.0Byte";
                        break;
                    case 2:
                        callN('updateApp',{ "url": this.updateUrl });
                        break;
                    case 3:
                        callN('signOut');
                        break;
                }
            });
        },
        methods: {
            ...mapActions(["toast"]),
            getCanupdata(){
                this.checkUpdate = true;
                var type = isAndroid?'1':'2';
                fetch(`${BASEINFO.host}${GETVER}?type=${type}&access_token=${BASEINFO.access_token}&format=json`,{
                    cache: "no-cache"
                })
                    .then(response=>response.json())
                    .then(message=>{
                        this.checkUpdate = false;
                        if (message.code==0) {
                            if(this.version < message.data.code){
                                this.updateUrl = message.data.url;
                                this.isCanUpdate = true;
                            }
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.checkUpdate = false;
                    });
            },
            cleanCache(){
                eventHub.$emit("msg-show",errcode.cleanCache,1);
            },
            updateApp(){
                if (this.checkUpdate) {
                    this.toast(errcode.updateCheck);
                    return false;
                }

                // 当前为最新版本
                if (this.isCanUpdate) {
                    eventHub.$emit("msg-show",errcode.updateMsg,2);
                }else{
                    this.toast(errcode.update);
                }
            },
            signOut(){
                eventHub.$emit("msg-show",errcode.signOut,3);
            }
        },
        beforeRouteLeave(to,from,next){
            // 离开时 清空eventHub事件
            eventHub.$off();
            next();
        },
        components: {
            commonTop,
            hmMsg
        }
    }
</script>

<style lang="sass">
    @import "css/base";
    .settings-box{
        padding-top: 0.75rem;

        .settings-item{
            position: relative;
            display: block;
            width: 6.9rem;
            height: 0.98rem;
            line-height: 0.98rem;
            margin: 0 auto 0.2rem;
            @extend %common-shadow;
            text-indent: 0.3rem;
            font-size: 0.34rem;
            color: $blackColor;

            &.active > i{
                position: absolute;
                top: 50%;
                right: 0.6rem;
                width: 0.16rem;
                height: 0.16rem;
                margin-top: -0.08rem;
                border-radius: 50%;
                background-color: #f43531;
            }
            &.bg{
                @include bg2('Stroke',0.14rem,0.24rem);
                background-position: 6.5rem center;
            }
            > span{
                position: absolute;
                top: 0;
                right: 0.24rem;
                font-size: 0.3rem;
                line-height: 0.98rem;
                width: 30%;
                text-align: right;
                color: $greyColor;
            }
        }
    }
    .settings-signOut{
        position: fixed;
        bottom: 1.1rem;
        left: 50%;
        width: 6.9rem;
        height: 0.88rem;
        line-height: 0.88rem;
        @extend %common-shadowBtn;
        margin-left: -3.45rem;
    }
</style>