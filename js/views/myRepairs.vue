<template>
    <div>
        <common-top title="我的报修" link="manRepair" link-title="人工报修"></common-top>
        <div class="content">
            <ul>
                <li v-for="item in repairList">
                    <dl>
                        <dt>报修编号：</dt>
                        <dd>{{item.number | repairNum}}</dd>
                    </dl>
                    <dl>
                        <dt>报修时间：</dt>
                        <dd>{{item.ctime | timeFormat}}</dd>
                    </dl>
                    <dl>
                        <dt>故障描述：</dt>
                        <dd v-if="item.type==2">{{item.content}}</dd>
                        <dd v-else>{{item.content | descFormat}}</dd>
                    </dl>
                    <p>
                        <i class="submit" v-if="item.status==1">已提交</i>
                        <i class="succ" v-if="item.status==2">已修复</i>
                        <span v-if="item.type==2">人工报修</span>
                        <span v-if="item.type==1">自动报修</span>
                    </p>
                </li>
            </ul>
            <p :style="{'opacity':isShow?'100':'0'}" class="common-loading">
                <i></i>加载中...
            </p>
        </div>
    </div>
</template>

<script>
    import { mapMutations,mapActions } from 'vuex';
    const querystring = require('querystring');

    import errcode from "errcode";
    import commonTop from "common-top";
    import {getN} from "nativeA";
    import {REPLIST} from "inter";

    const BASEINFO = getN('getBase');


    export default {
        data(){
            return {
                "repairList": [],
                "isShow": false,    // 加载中文案是否显示
                "isReady": false,   // 是否能加载下一页
                "curpage": 1,       // 当前页数
                "pageCount":99,     // 总页数，只在第一次请求赋值
                "size": 10,         // 每页多少条数据
                "addMoreHandler": null
            };
        },
        /*watch: {
            "$route": function (newRoute){
                // 缓存情况下 go(-1)回来的时候 添加window对象 ，现在关闭不做缓存，请勿打开
                if (newRoute.name == 'myRepairs') {
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
                    size: this.size
                };
                this.isReady = true;
                fetch(`${BASEINFO.host}${REPLIST}?${querystring.stringify(params)}`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        this.hideLoad();
                        this.isReady=false;
                        this.isShow = false;
                        if(data.code==0){
                            this.repairList=this.repairList.concat(data.data.list);
                            
                            if(this.curpage==1){
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

    .succ{
        @include bg2("icon_been_repaired");
        position: absolute;
        top:-.14rem;
        right:-.12rem;
        width: 1.12rem;
        height:.66rem;
        color: #fff;
        line-height: .66rem;
        text-align: center;
        font-size:.24rem;
    }
    .err{
        @extend .succ;
        @include bg2("icon_not_repaired");
    }
    .submit{
        @extend .succ;
        @include bg2("icon_been_submitted");
    }
    .content {
        ul {
            width: 6.9rem;
            margin: 0 auto;

            li {
                padding: .3rem .32rem .2rem;
                background-color: #fff;
                border-radius: .06rem;
                position: relative;
                margin-top: .3rem;
                @extend %common-shadow;
                dl {
                    line-height: .48rem;
                    display: flex;
                    padding: .11rem 0;
                    dt {
                        width:1.8rem;
                        color: $greyColor;
                        text-align: right;
                    }
                    dd {
                        width:3.6rem;
                        color: #121212;
                        word-break: break-all;
                    }
                }
                p {
                    position: absolute;
                    top: 0;
                    right: -.14rem;
                    padding-top: .45rem;
                    width: 1.5rem;
                    font-size: .28rem;
                    color: $greyColor;
                    line-height: .4rem;
                }
            }
        }
    }
</style>