<template>
    <article>
        <div class="header">
            <router-link tag="b" to="/checkIn" class="checkIn"><i></i>签到</router-link>
            往返司机端
        </div>
        <div class="userInfo">
            <div>
                <img :src="avatar?avatar:'images/tmp/touxiang@2x.png'" />
            </div>
            <p>{{mobile}}</p>
            <span>当前车辆：{{plate_num}}</span>
        </div>
        <div class="stat">
            <i></i>
            <!-- <p><i></i>无法定位到您的位置，请开启定位功能！</p> -->
            <ul>
                <li>
                    <p>{{now}}</p>
                    <span>当前上网用户(人)<router-link to="/help" tag="a" class="explain"></router-link></span>
                </li>
                <li>
                    <p>{{drive_time}}</p>
                    <span>驾驶时间(小时)</span>
                </li>
            </ul>
        </div>
        <div class="notice">
            <ul>
                <li v-for="item in msgList">
                    <router-link tag="a" :to="{name: 'msgDetail',params:{id: item.id}}" class="">
                        <i :class="item.type==2?'sigh':''"></i>
                        <p>{{item.title}}</p>
                        <span :class="item.status==0?'new':''"></span>
                        <b></b>
                    </router-link>
                </li>
            </ul>
        </div>


    </article>
</template>

<script>
    const querystring = require("querystring");

    import {MESLIST} from "inter";
    import errcode from "errcode";
    import {mapState,mapActions} from "vuex";
    import {getN} from "nativeA";

    const BASEINFO = getN('getBase');

    export default {
        data(){
            return {
                msgList: []
            }
        },
        computed: mapState({
            "avatar": state => state.userInfo.avatar,
            "plate_num": state => state.carInfo.plate_num,
            "mobile": state => state.userInfo.mobile,
            "now": state => state.deviceInfo.now,
            "drive_time": state => state.carInfo.drive_time
        }),
        mounted(){
            this.getMsg();
        },
        methods: {
            ...mapActions(["toast"]),
            getMsg(){
                var params = {
                    format: "json",
                    uid: BASEINFO.uid,
                    access_token: BASEINFO.access_token,
                    page: 1,
                    size: 3
                };
                fetch(`${BASEINFO.host}${MESLIST}?${querystring.stringify(params)}`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        if(data.code==0){
                            var list1 = [];
                            var list2 = [];
                            for (var i = 0; i < data.data.list.length; i++) {
                                if (data.data.list[i].type=="2") {
                                    list1.push(data.data.list[i])
                                }else{
                                    list2.push(data.data.list[i])
                                }
                            }
                            this.msgList = list1.concat(list2);
                        }else{
                            this.toast(data.message);
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.toast(errcode.m404);
                    })
            }
        }

    }
</script>

<style lang="sass" scoped>
    @import "css/base";
    .header{
        position:relative;
        text-align:center;
        font-size:.36rem;
        line-height:.8rem;
        color:#fff;
        .checkIn{
            position:absolute;
            left:.8rem;
            top:0;
            font-size:.32rem;
            i{
                position:absolute;
                top:.2rem;
                left:-.49rem;
                width:.4rem;
                height:.39rem;
                @include bg2('qiandao');
            }
        }
    }
    .userInfo{
        padding:.55rem;
        color:#fff;
        text-align:center;
        > div{
            width:2.4rem;
            height:2.4rem;
            margin:0 auto .25rem;

            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        p{
            font-size:.36rem;
            line-height:.53rem;
        }
        span{
            font-size:.32rem;
            line-height:.54rem;
        }
    }
    .stat{
        width:6.9rem;
        height:1.96rem;
        padding:.3rem 0;
        @include bg2('beijing',$x:100%,$y:55.4%);
        background-position:bottom;
        background-color:#fff;
        border-radius:.06rem;
        margin:0 auto;
        @extend %common-shadow;
        >i{
            display:block;

        }
        >p{
            position:relative;
            left:.42rem;
            padding-left:.78rem;
            font-size:.28rem;
            color:$redColor;
            height: .4rem;
            line-height:.4rem;
            i{
                position:absolute;
                left:.36rem;
                top:.02rem;
                width:.32rem;
                height:.34rem;
                @include bg2('jinggao');
            }
        }
        >ul{
            margin-top:.3rem;
            display:flex;
            li{
                flex:1;
                text-align:center;
                p{
                    height: .46rem;
                    font-size:.4rem;
                    color:#1E77FF;
                    line-height:.46rem;
                }
                span{
                    font-size:.26rem;
                    color:$greyColor2;
                    line-height:.64rem;
                    position:relative;
                }
            }
        }

    }
    .notice{
        margin-top:.2rem;
         ul{
            width: 6.9rem;
            height:3.24rem;
            margin:0 auto;
            @extend %common-shadow;
            li{
                padding: .3rem 0;
                margin:0 .3rem;
                border-bottom:.01rem solid #D9D9D9;
                line-height: .48rem;


                a{
                    position: relative;
                    //padding-left:.7rem;
                    font-size: .34rem;
                    color:$greyColor2;
                    i{
                        @include bg2("xinfeng",100%,0.34rem);
                        background-position: center center;
                        width: .4rem;
                        height: .4rem;
                        position: absolute;
                        top: .04rem;
                        left: 0;

                        &.sigh{
                            @include bg2("jinggao");
                        }
                    }
                    >p{
                        padding-left:.7rem;
                        padding-right: 1rem;
                        @include eps;
                    }
                    b{
                        @include bg2("Stroke");
                        position: absolute;
                        width:.14rem;
                        height: .24rem;
                        top:-.34rem;
                        left:6.2rem;
                    }
                }
                &:nth-child(3){
                    border-bottom:none;
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
    .hide{
        display:none;
    }
    .explain{
        position:absolute;
        right:-.34rem;
        top:.03rem;
        width:.3rem;
        height:.3rem;
        @include bg('explain.png');
    }

</style>