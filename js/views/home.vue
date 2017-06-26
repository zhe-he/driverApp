<template>
    <article>
        <div class="userCenter">
            <p>个人中心</p>
            <router-link tag="i" to="/settings"></router-link>
        </div>
        <div class="userPhoto">
            <div @click="callPhoto()">
                <img :src="avatar?avatar:'images/tmp/touxiang@2x.png'" />
            </div>
            <p>{{mobile}}</p>
        </div>
        <div class="content">
            <ul>
                <li>
                    <router-link to="/myinfo" tag="a">
                        <i></i>
                        <p>个人信息</p>
                        <b class=""></b>
                        <span></span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/sysMsg" tag="a">
                        <i></i>
                        <p>消息</p>
                        <b :class="hasNew?'new':''"></b>
                        <span></span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/myRepairs" tag="a">
                        <i></i>
                        <p>故障追踪</p>
                        <b class="num">{{repTotal}}</b>
                        <span></span>
                    </router-link>
                </li>
            </ul>
        </div>

    </article>
</template>

<script>
    const querystring = require('querystring');
    import {MESLIST,REPLIST} from "inter";
    import errcode from "errcode";
    import {mapState,mapMutations} from "vuex";
    import {getN} from "nativeA";

    const BASEINFO = getN('getBase');
    export default {
        data(){
            return {
                hasNew: false,
                repTotal: ''
            }
        },
        mounted(){
            this.getMesList();
            this.getRepList();
        },
        computed: mapState({
            "avatar": state => state.userInfo.avatar,
            "mobile": state => state.userInfo.mobile
        }),
        methods: {
            ...mapMutations(["setPhoto","showPhoto"]),
            getMesList(){
                var params = {
                    format: "json",
                    uid: BASEINFO.uid,
                    access_token: BASEINFO.access_token,
                    page: 1,
                    size: 20,
                    type: 1
                };
                fetch(`${BASEINFO.host}${MESLIST}?${querystring.stringify(params)}`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(message=>{
                        if (message.code == 0) {
                            for(var i=0; i<message.data.list.length; i++){
                                if (message.data.list[i].status==0) {
                                    this.hasNew = true;
                                    break;
                                }
                            }
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.toast(errcode.m404);
                    });
            },
            getRepList(){
                var params = {
                    format: "json",
                    uid: BASEINFO.uid,
                    access_token: BASEINFO.access_token,
                    page: 1,
                    size: 20
                };
                fetch(`${BASEINFO.host}${REPLIST}?${querystring.stringify(params)}`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(message=>{
                        if (message.code == 0) {
                            this.repTotal = message.data.total || 0;
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.toast(errcode.m404);
                    });
            },
            callPhoto(){
                this.setPhoto(2);
                this.showPhoto();
            },
        }
    }
</script>

<style lang="sass" scoped>
    @import "css/base";
    .userCenter{
        position: relative;
        padding-top:.19rem;
        margin-bottom:.79rem;
        p{
            text-align:center;
            color:#fff;
            font-size:.36rem;
            line-height:.5rem;
        }
        i{
            position:absolute;
            top:.24rem;
            right:.3rem;
            width:.4rem;
            height:.4rem;
            @include bg2('shezhi');
        }
    }
    .userPhoto{
        width:2.4rem;
        height:3.52rem;
        padding:.6rem 2.25rem;
        margin:0 auto;
        background-color:#fff;
        border-radius:.06rem;
        @include bg2('beijing',$x:100%,$y:32.9%);
        background-position:bottom;
        @extend %common-shadow;

        > div{
            width:2.4rem;
            height:2.4rem;
            margin: 0 auto;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        p{
            font-size:.36rem;
            text-align:center;
            color:$blackColor;
            line-height:1.03rem;
        }
    }
    .content {
        ul{
            width: 6.9rem;
            margin:0 auto;
            li{
                padding: .25rem .3rem;
                line-height: .48rem;
                margin-top: .2rem;
                @extend %common-shadow;
                a{
                    position: relative;
                    //padding-left:.7rem;
                    font-size: .34rem;
                    font-weight: normal;
                    i{
                        @include bg2("gerenxinxi");
                        width: .4rem;
                        height: .4rem;
                        position: absolute;
                        top:.075rem;
                        left:0;
                    }
                    >p{
                        padding-left: .7rem;
                        font-size:.34rem;
                        line-height:.48rem;
                        color:$blackColor;
                        @include eps;
                    }

                    span{
                        @include bg2("Stroke");
                        position: absolute;
                        width:.14rem;
                        height: .24rem;
                        top:-.36rem;
                        left:6.18rem;
                    }
                }
                &:nth-child(2){
                    i{
                        @include bg2("xiaoxi");
                    }
                }
                &:nth-child(3){
                    i{
                        @include bg2("guzhangzhuizong");
                    }
                }
            }
        }
    }
    
    .new{
        position: absolute;
        top:-.24rem;
        left:5.84rem;
        margin-top:-4px;
        width: .16rem;
        height: .16rem;
        border-radius: .08rem;
        background-color: $redColor;
    }
    .num{
        width: 1rem;
        text-align: right;
        font-size:.28rem;
        color:$greyColor2;
        line-height:.34rem;
        position: absolute;
        top:-.38rem;
        left:4.98rem;
    }
</style>