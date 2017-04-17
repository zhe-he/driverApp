<template>
    <section v-if="isShow">
        <div @click="cancel()" class="common-msg-mask"></div>
        <div class="common-msg">
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
                msg: ''
            }
        },
        mounted(){
            eventHub.$on('msg-show',(msg='')=>{
                this.isShow = true;
                this.msg = msg;
            });
        },
        methods: {
            cancel(){
                this.isShow = false;
                eventHub.$emit('msg-cancel',this.msg);
            },
            confirm(){
                this.isShow = false;
                eventHub.$emit('msg-confirm',this.msg);
            }
        }
    }
</script>