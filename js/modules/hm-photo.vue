<template>
    <div>
        <div v-show="isShow" class="hm-photo-mask" @click="cancel()"></div>
        <div :class="['hm-photo-content',isShow?'active':'']">
            <ul>
                <li>
                    <a @click="photograph()" href="javascript:;">拍照</a>
                </li>
                <li>
                    <a @click="selectPhotos()" href="javascript:;">从相册选择</a>
                </li>
            </ul>
            <a @click="cancel()" href="javascript:;">取消</a>
        </div>
    </div>
</template>

<script type="text/javascript">
    import {mapState,mapMutations} from "vuex";
    import {callN} from "nativeA";

    export default {
        data(){
            return {
            }
        },
        computed: mapState({
            "type": state => state.hmPhoto.type,
            "isShow": state => state.hmPhoto.isShow,
            "msg": state => state.hmPhoto.type==2?"用户头像":"驾驶证"
        }),
        methods: {
            ...mapMutations(["hidePhoto"]),
            cancel(){
                this.hidePhoto();
            },
            photograph(){
                callN("upFile",{
                    "type": this.type,
                    "method": 1,
                    "msg": `拍照-${this.msg}`
                });
            },
            selectPhotos(){
                callN("upFile",{
                    "type": this.type,
                    "method": 2,
                    "msg": `相册选择-${this.msg}`
                });
            }
        }
    }
</script>

<style lang="sass">
    @import "css/base";
    .hm-photo-mask{
        z-index: 990;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color:rgba(0,0,0,.5);
    }
    .hm-photo-content.active{
        transform: translate3d(0,0,0);
    }
    .hm-photo-content{
        z-index: 1000;
        position: fixed;
        bottom:0;
        left: 50%;
        margin-left: -3.45rem;
        width:6.9rem;
        
        transform: translate3d(0,100%,0);
        transition: transform .5s;

        ul{
            background-color:#fff;
            border-radius:.06rem;
            li{
                border-bottom:.01rem solid #D9D9D9;
                >a{
                    display:block;
                    width:100%;
                    height:100%;
                    font-size:.32rem;
                    line-height:1.05rem;
                    text-align:center;
                    color:$greyColor;
                }
                &:nth-child(2){
                    border-bottom:none;
                }
            }
        }
        >a{
            display:block;
            width:100%;
            line-height:.88rem;
            background:#fff;
            border-radius:.06rem;
            margin:.2rem 0 .3rem 0;
            text-align:center;
            font-size:.34rem;
            color:$blackColor;
        }
    }

</style>