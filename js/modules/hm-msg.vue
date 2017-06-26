<template>
    <section v-if="isShow">
        <div @click="cancel()" class="hm-msg-mask"></div>
        <div class="hm-msg-content">
            <p v-html="msg"></p>
            <nav>
                <a @click="cancel()" href="javascript:;">取消</a>
                <a @click="confirm()" href="javascript:;">确定</a>
            </nav>
        </div>
    </section>
</template>

<script type="text/javascript">
    import eventHub from 'eventHub';
    export default {
        data(){
            return {
                isShow: false,
                msg: '',
                type: 0
            }
        },
        mounted(){
            eventHub.$on('msg-show',(msg='',type)=>{
                this.isShow = true;
                this.msg = msg;
                this.type = type;
            });
        },
        methods: {
            cancel(){
                this.isShow = false;
                eventHub.$emit('msg-cancel',this.msg,this.type);
            },
            confirm(){
                this.isShow = false;
                eventHub.$emit('msg-confirm',this.msg,this.type);
            }
        }
    }
</script>

<style lang="sass">
    @import "css/base";
    $lineColor: #D5D5D5;
    .hm-msg-mask{
        z-index: 990;
        @include common-fixed;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    }
    .hm-msg-content{
        z-index: 1000;
        position: fixed;
        top: 50%;
        left: 50%;
        width: 6.4rem;
        margin-left: -3.2rem;
        margin-top: -1.3rem;
        border-radius: 0.4rem;
        background-color: #fff;
        > p{
            padding: 0.6rem 0 0.3rem;
            color: $blackColor;
            font-size: 0.34rem;
            line-height: 0.36rem;
            text-align: center;
        }
        > nav{
            border-top: 1px solid $lineColor;
            display: flex;
            > a{
                display: block;
                flex: 1;
                height: 1.1rem;
                line-height: 1.1rem;
                text-align: center;
                font-size: 0.34rem;
                color: #1E77FF;
                &:nth-child(1){
                    border-right: 1px solid $lineColor;
                    color: $greyColor;
                }
            }
        }
    }
</style>