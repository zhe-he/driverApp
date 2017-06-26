<template>
    <div>
        <common-top title="系统消息"></common-top>
        <nav class="messageContent">
            <h2>{{getDetail.title}}</h2>
            <h3>
                <span v-if="getDetail.ctime">{{getDetail.ctime | timeFormat}}</span>
                <span v-else></span>
            </h3>

            <p>{{getDetail.content}}</p>
        </nav>
    </div>
</template>



<script>
    const querystring = require("querystring");
    import { mapMutations,mapActions } from 'vuex';
    import errcode from "errcode";
    import commonTop from "common-top";
    import {getN} from "nativeA";
    import {MESDET,MESEDIT} from "inter";

    const BASEINFO = getN('getBase');

    export default {
        data(){
            return {
                "id": this.$route.params.id,
                "getDetail":{
                    "content":"",
                    "ctime":"",
                    "title":""
                }
            }
        },
        mounted(){
            this.showLoad();
            fetch(`${BASEINFO.host}${MESDET}?id=${this.id}&access_token=${BASEINFO.access_token}&format=json`,{
                cache:"no-cache"
            })
                .then(response=>response.json())
                .then(data=>{
                    this.hideLoad();
                    if(data.code==0){
                        this.editMess();
                        this.getDetail.content=data.data.content;
                        this.getDetail.ctime=data.data.ctime;
                        this.getDetail.title=data.data.title;
                    }else{
                        this.toast(data.message);
                    }
                })
                .catch(e=>{
                    console.log(e);
                    this.hideLoad();
                    this.toast(errcode.m404);
                })
        },
        methods:{
            ...mapActions(["toast"]),
            ...mapMutations(["showLoad","hideLoad"]),
            editMess(){
                var data={
                    format: "json",
                    "id":this.id,
                    "uid":BASEINFO.uid,
                    "status":1,
                    "access_token": BASEINFO.access_token,
                    "token": BASEINFO.token
                }
                fetch(`${BASEINFO.host}${MESEDIT}?${querystring.stringify(data)}`,{
                    cache:"no-cache"
                })
                    .then(response=>response.json())
                    .then(data=>{
                        if(data.code!=0){
                            this.toast(data.message);
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.toast(errcode.m404);
                    })
            }
        },
        components: {
            commonTop
        }
    }
</script>

<style lang="sass">
    @import "css/base";
    .messageContent{
        width: 6.9rem;
        margin: 0.6rem auto 0;
        @extend %common-shadow;
        padding: 0.6rem 0.48rem 1.65rem;
        box-sizing: border-box;

        > h2{
            line-height: 0.48rem;
            font-size: 0.34rem;
            color: $blackColor; 
            font-weight: normal;
        }
        >h3{
            text-align: right;
            padding:0 .36rem .3rem 0;
            >span{
                font-size: .28rem;
                line-height: .43rem;
                color: $greyColor2;
                font-weight: normal;
            }
        }
        > p{
            font-size: 0.32rem;
            line-height: 0.6rem;
            text-align: justify;
            color: $greyColor;
        }
    }
</style>