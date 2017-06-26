<template>
    <div>
        <common-top title="系统消息"></common-top>

        <div class="content">
            <ul>
                <li v-for="(item,index) in messageList">
                    <a href="javascript:;" @click="check(index,item.id)">
                        <h3>
                            <i class="message"></i>
                            <p>{{item.title}}</p>
                            <span></span>
                            <b :class="[item.status==0?'new':'']"></b>
                        </h3>
                        <p><span>{{item.ctime | timeFormat}}</span></p>
                    </a>
                </li>
            </ul>
            <p :style="{'opacity':isShow?'100':'0'}" class="common-loading">
                <i></i>加载中...
            </p>
        </div>
        <!--<footer>
            <b class="allSelected"><i></i>全选</b>
            <span @click="test()">删除</span>
        </footer>-->
    </div>
</template>


<script>
    const querystring = require("querystring");
    import { mapMutations,mapActions } from 'vuex';
    import errcode from "errcode";
    import commonTop from "common-top";
    import {getN} from "nativeA";
    import {MESLIST} from "inter";

    const BASEINFO = getN('getBase');

    export default {
        data(){
            return {
                "messageList":[],
                "isShow": false,    // 加载中文案是否显示
                "isReady": false,   // 是否能加载下一页
                "curpage":1,        // 当前页数
                "pageCount":99,     // 总页数，只在第一次请求赋值
                "size": 10,         // 每页多少条数据
                "addMoreHandler": null
            }
        },
        /*watch: {
            "$route": function (newRoute){
                // 缓存情况下 go(-1)回来的时候 添加window对象 ，现在关闭不做缓存，请勿打开
                if (newRoute.name == 'sysMsg') {
                    window.addEventListener('scroll',this.addMoreHandler,false);
                }
            }
        },*/
        mounted(){
            this.showLoad();
            this.getData();
            this.addMoreHandler = this.addMore.bind(this);
            this.$nextTick(()=>{
                window.addEventListener('scroll',this.addMoreHandler,false);
            });
        },
        methods: {
            ...mapActions(["toast"]),
            ...mapMutations(["showLoad","hideLoad"]),
            getData(){
                var params = {
                    format: "json",
                    uid: BASEINFO.uid,
                    access_token: BASEINFO.access_token,
                    page: this.curpage,
                    size: this.size,
                    type: 1
                };
                this.isReady=true;
                fetch(`${BASEINFO.host}${MESLIST}?${querystring.stringify(params)}`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        this.isReady=false;
                        this.hideLoad();
                        this.isShow = false;
                        if(data.code==0){
                            this.messageList=this.messageList.concat(data.data.list);
                            if (this.curpage===1) {
                                this.pagecount = Math.ceil(data.data.total/this.size);
                            }
                            if (this.curpage++>=this.pagecount) {
                                window.removeEventListener('scroll',this.addMoreHandler,false);
                                this.isReady = true;
                            }

                        }else{
                            this.toast(data.message);
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.hideLoad();
                        this.isShow = false;
                        this.isReady=false;
                        this.toast(errcode.m404);
                    })
            },
            addMore(){
                var H = document.documentElement.scrollHeight || document.body.scrollHeight;
                var h = window.innerHeight;
                var t = document.documentElement.scrollTop||document.body.scrollTop;
                if (H - (h + t) < 15 && !this.isReady){
                    this.isShow = true;
                    this.getData();
                }
            },
            check(num,id){
                this.messageList[num].status=1;
                this.$router.push({name: 'msgDetail', params: {id}});
            }
        },
        beforeRouteLeave(to,from,next){
            // 离开时 清空window对象
            window.removeEventListener('scroll',this.addMoreHandler,false);
            next();
        },
        components: {
            commonTop
        }
    }
</script>


<style lang="sass" scoped>
    @import "css/base";
    body{
        color: $blackColor;
    }

    .content{
        padding-top: 0.55rem;
    }
    .message{
        @include bg2("xinfeng");
        width: .4rem;
        height: .34rem;
        position: absolute;
        top:.12rem;
        left:0;
    }
    .new{
        position: absolute;
        top: 50%;
        right:.36rem;
        margin-top:-4px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background-color: $redColor;
    }
    .select{
        width: .4rem;
        height: .4rem;
        border-radius: .4rem;
        border:3px solid #D5D7E2;
        position: absolute;
        top:0;
        left:0;
    }
    .selected{
        @include bg2("normal");
        width: .508rem;
        height: .496rem;
        position: absolute;
        top:0;
        left:0;
    }

    .content {
        ul{
            width: 6.9rem;
            margin:0 auto;
            li{
                padding: .3rem;
                line-height: .58rem;
                margin-top: .2rem;
                @extend %common-shadow;
                h3{
                    position: relative;
                    //padding-left:.7rem;
                    font-size: .34rem;
                    font-weight: normal;
                    >i.select,>i.selected{
                        top:.04rem;
                    }
                    >p{
                        padding-right: 1rem;
                        @include eps;
                    }
                    span{
                        @include bg2("Stroke");
                        position: absolute;
                        width:.14rem;
                        height: .24rem;
                        top:.17rem;
                        right:0;
                    }
                }
                p{
                    padding-left:.7rem;
                    span{
                        font-size:.28rem;
                        color: $greyColor2;
                        line-height: .42rem;
                        padding-right: .1rem;
                    }
                }
            }
        }
    }
    footer{
        width: 6.3rem;
        height: .48rem;
        margin-top: 2rem;
        background-color: #fff;
        box-shadow: 0 0 .1rem rgba(31,120,255,.2);
        padding:.25rem .6rem;
        position: fixed;
        bottom: 0;
        >span{
            float: right;
            color: $redColor;
        }
        b{
            color: $greyColor2;
            padding-left: .6rem;
            position: relative;
            >i{
                @extend .select;
                top:-.04rem;
            }
        }
        .allSelected{
            color: #1E77FF;
            i{
                border: none;
                @extend .selected;
            }
        }
    }
    .hide{
        display: none;
    }
</style>