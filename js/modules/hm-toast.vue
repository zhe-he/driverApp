<template>
    <div :class="{'hm-toast-fadeIn': this.status==1,'hm-toast-hide': this.status==0,'hm-toast-fadeOut': this.status==2,'hm-toast':true}">
        <p v-html="msg"></p>
    </div>
</template>

<style>
    .hm-toast-fadeIn{
        animation: fadeInUp 1s 0s ease both;
    }
    .hm-toast-fadeOut{
        animation: fadeOutDown .6s 0s ease both;
    }
    .hm-toast{
        z-index: 1000;
        display: flex;
        jusitify-content: center;
        align-items: center;
        position: fixed;
        top: 50%;
        left: 50%;
        margin-top: -1.6rem;
        margin-left: -2.4rem;
        width: 4.8rem;
        height: 1.9rem;
        background-color: rgba(0,0,0,0.7);
        border-radius: 0.1rem;
    }
    .hm-toast-hide{
        z-index: -1;
        opacity: 0;
    }
    .hm-toast p{
        width: 100%;
        box-sizing: border-box;
        padding: 0 0.25rem;
        line-height: 0.54rem;
        text-align: center;
        color: #fff;
        font-size: 0.32rem;
    }

    @keyframes fadeInUp{
        0%{
            z-index: 1000;
            opacity:0;
            transform:translateY(20px)
        }
        100%{
            z-index: 1000;
            opacity:1;
            transform:translateY(0)
        }
    }
    @keyframes fadeOutDown{
        0%{
            z-index: 1000;
            opacity:1;
            transform:translateY(0)
        }
        100%{
            z-index: -1;
            opacity:0;
            transform:translateY(20px)
        }
    }
</style>

<script>
    export default {
        props: {
            msg: {
                type: String,
                required: true
            },
            status: {
                type: String | Number,
                default: 1
            }
        },
        data(){
            return {
            }
        }
    }
</script>