<template>
    <div :class="['driver-app','driver-bg'+driverBg]">
        <transition :name="driverTransition.name" :mode="driverTransition.mode">
            <keep-alive v-if="$route.meta.keepAlive">
                <router-view class="app-main" v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view class="app-main" v-if="!$route.meta.keepAlive"></router-view>
        </transition>
    
        <d-toast :status="hmToast.status" :msg="hmToast.msg"></d-toast>
        <d-load :status="hmLoad.status"></d-load>
        <d-photo></d-photo>
    </div>
</template>


<script type="text/javascript">
    import dPhoto from "hm-photo";
    import dToast from 'hm-toast';
    import dLoad from 'hm-load';
    import FastClick from 'fastclick';
    import "./libs/autosize.js";
    import { mapState,mapActions,mapMutations } from "vuex";
    import {callN} from "nativeA";

    export default {
        name: 'app',
        data (){
            return {

            }
        },
        computed: mapState(["hmLoad","hmToast","driverBg","driverTransition"]),
        created(){
            this.$nextTick(()=>{
                FastClick.attach(document.body);
            });
            this.setUserInfoAsync();
            this.setUserCar();
            this.setDeviceUsersAsync();
            // this.nativeSetDrive_time(DRIVE_TIME.drive_time);
            callN('getDriveLine');
            callN('getDriveTime');
            setInterval(()=>{
                // callN('getDriveTime');
                this.setDeviceUsersAsync();
            },1000*60);
        },
        methods: {
            ...mapActions(["setUserInfoAsync","setUserCar","setDeviceUsersAsync"]),
            ...mapMutations(["nativeSetDrive_time"])
        },
        components: {
            dToast,
            dLoad,
            dPhoto
        }
    }
</script>

<style lang="sass">
    @import "css/reset";
    @import "css/base";
    html,body{
        height: 100%;
    }
    .driver-app{
        min-height: 100%;
    }
    .app-main{
        padding-top: 0.6rem;
    }
    %driver-bg{
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center top;
        background-color: $bgColor;
        background-attachment:fixed;
    }
    .driver-bg3{
        @extend %driver-bg;
        background-image: url('../images/bg3\@2x.png');
        background-image: -webkit-image-set(
            url('../images/bg3\@2x.png') 2x,
            url('../images/bg3\@3x.png') 3x);
    }
    .driver-bg2{
        @extend %driver-bg;
        background-image: url('../images/bg2\@2x.png');
        background-image: -webkit-image-set(
            url('../images/bg2\@2x.png') 2x,
            url('../images/bg2\@3x.png') 3x);
    }
    .driver-bg1{
        @extend %driver-bg;
        background-image: url('../images/bg1\@2x.png');
        background-image: -webkit-image-set(
            url('../images/bg1\@2x.png') 2x,
            url('../images/bg1\@3x.png') 3x);
    }

    .common-loading{
        height: 0.74rem;
        line-height: 0.74rem;
        text-align: center;
        color: $greyColor;
        font-size: 0.28rem;

        > i{
            display: inline-block;
            vertical-align: middle;
            width: 0.28rem;
            height: 0.28rem;
            margin-top: -2px;
            margin-right: 0.1rem;
            border-radius: 50%;
            border: 2px solid $greyColor;
            border-bottom-color: transparent;
            animation: rotate 0.75s linear infinite;
        }
    }
    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .height30{
        height: 0.3rem;
    }

    .slide-fade-enter-active{
        transition: transform 1s,opacity 1s;
    }
    .slide-fade-leave-active{
        position: absolute;
        width: 100%;
        opacity: 0;
        transition: all 1s;
    }
    .slide-fade-enter-to{
        transform: perspective(400px) rotateY(0deg);
        opacity: 1;
    }
    .slide-fade-leave-to{
        position: absolute;
        width: 100%;
        opacity: 0;
    }
    .slide-fade-enter{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        transform: perspective(400px) rotateY(90deg);
        opacity: 0;
    }

</style>