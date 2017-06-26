<template>
    <header class="common-top">
        <div>
            <a @click="goBack()" :class="backType>-2?'goBack':''"></a>
            <h1>{{title}}</h1>
            <router-link tag="a" v-if="linkTitle" :to="link">{{linkTitle}}</router-link>
        </div>
    </header>
</template>

<script>

    export default {
        props: {
            title: {
                type: String
            },
            backType: {
                type: Number,
                default: -1
            },
            link: {
                type: String|Object
            },
            linkTitle: {
                type: String
            }
        },
        methods: {
            goBack(){
                if (this.backType) {
                    this.$router.go(this.backType);
                }
            }
        }
    }
</script>
<style lang="sass">
    @import "css/base";
    .common-top{
        height: 0.88rem;
        > div{
            z-index: 100;
            @include common-fixed;
            @include bg2('bg3',100%,auto);
            width: 100%;
            display: flex;
            padding-top: 0.6rem;
            > *{
                display: block;
                height: 0.88rem;
                line-height: 0.88rem;
                color: #fff;
            }
            > a:nth-of-type(1){
                width: 0.8rem;
                &.goBack{
                    @include bg2('back',0.24rem,0.44rem);
                    background-position: center center;
                }
            }
            h1{
                width: 5.04rem; 
                font-size: 0.36rem;
                text-indent: 0.86rem;
                font-weight: normal;
                text-align: center;
            }
            > a:nth-of-type(2){
                padding-right: 0.3rem;
                width: 1.36rem;
                font-size: 0.32rem;
                text-align: right;
            }
        }
    }
</style>