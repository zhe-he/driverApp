<template>
    <article class="driver-content">
        <router-view></router-view>
        <nav class="driver-menu">
            <router-link tag="a" exact to="/driver">首页</router-link>
            <router-link tag="a" exact to="/driver/car">车辆</router-link>
            <router-link tag="a" exact to="/driver/home">我的</router-link>
        </nav>
    </article>
</template>


<script>
    export default {
        data(){
            return {}
        }
    }
</script>


<style lang="sass">
    @import "css/base";
    .driver-content{
        height: 100%;
        box-sizing: border-box;
        padding-bottom: 1rem;
    }
    .driver-menu{
        @include common-fixed(auto);
        bottom: 0;
        display: flex;
        height: .98rem;
        background-color: $bgColor;
        > a{
            display: block;
            flex: 1;
            height: .98rem;
            padding-top: .66rem;
            box-sizing: border-box;
            text-align: center;
            font-size: 0.22rem;
            line-height: 0.22rem;
            background-position: center 0.12rem;
            color: $greyColor2;
            &.router-link-active{
                color: $blueColor;
            }
            &:nth-child(1){
                @include bg2('home',.44rem,.44rem);
                &.router-link-active{
                    @include bg2('home_click',.44rem,.44rem);
                }
            }
            &:nth-child(2){
                @include bg2('cheliang',.4rem,.44rem);
                &.router-link-active{
                    @include bg2('cheliang_click',.4rem,.44rem);
                }
            }
            &:nth-child(3){
                @include bg2('wode',.36rem,.44rem);
                &.router-link-active{
                    @include bg2('wode_click',.36rem,.44rem);
                }
            }
        }
    }
</style>