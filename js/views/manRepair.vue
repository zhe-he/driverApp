<template>
    <div>
        <common-top title="人工报修"></common-top>
        
        <div class="content">
            <div>
                <dl>
                    <dt>车牌号：</dt>
                    <dd>
                        <!--<span :class="[input_flag==2?'err':'']">-->
                            <input type="text" placeholder="请输入车牌号" v-model="plate_num" id="plate_num" :class="[(input_flag==1||input_flag==2)?'write':'',input_flag==2?'err':'']">
                        <!--</span>-->
                    </dd>
                </dl>
               <!-- <dl>
                    <dt>报修时间：</dt>
                    <dd>{{getDetail.ctime}}</dd>
                </dl>-->
                <dl>
                    <dt class="faultDesc">故障描述：</dt>
                    <dd></dd>
                </dl>
                <div>
                    <textarea id="faultDesc" name="faultDesc"  v-model="getDetail.content"></textarea>
                    <span id="count" class="dxj-txt" ><b>{{len}}</b>/50</span>
                </div>
            </div>
            <a @click="submitDate" :class="['bottomBtn',isSubmit?'a_c':'disabled']" >提交</a>

        </div>
    </div>
</template>

<script>
    const querystring=require('querystring');
    import { mapMutations,mapActions } from 'vuex';
    import errcode from "errcode";
    import commonTop from "common-top";
    import {getN} from "nativeA";
    import {ADDREP} from "inter";

    const BASEINFO = getN('getBase');

    export default {
        data(){
            return {
                "isSubmit":false,
                "input_flag":"",
                "len":0,
                "getDetail":{
                    // "ctime":"",
                    "content":""
                }
            };
        },
        computed: {
            "plate_num": {
                get (){
                    return this.$store.state.carInfo.plate_num2;
                },
                set (value){
                    this.$store.commit("updatePlateNum",value);
                }
            }
        },
        mounted(){
            //去首空格
            function trimStr(str) {return str.replace(/^\s+/g,"");}
            /*date=dataFormat(date,'YYYY-MM-dd hh:mm:ss');
            this.getDetail.ctime=date;*/
            
            this.$nextTick(()=>{
                var input=document.getElementById('plate_num');
                input.addEventListener('input',()=>{
                    this.input_flag=1;//.write
                });
                input.addEventListener('blur',()=>{
                    if(!this.plate_num){
                        this.input_flag='';//.write
                    }
                });
                input.addEventListener('change',()=>{
                    if(this.plate_num){
                        var re=/^[\u4e00-\u9fa5\uFE30-\uFFA0][A-Za-z]\w{5}\s*$/;
                        if(!re.test(this.plate_num))
                        {
                            this.input_flag=2; //.err
                            this.isSubmit=false;
                        }else{
                            if(this.plate_num!='' &&  this.input_flag!=2 && this.getDetail.content!=''){
                                this.isSubmit=true;
                            }
                        }

                    }else{
                        this.isSubmit=false;
                    }
                });
                var faultDesc=document.getElementById('faultDesc');
                faultDesc.addEventListener('input',()=>{
                    this.getDetail.content=trimStr(this.getDetail.content);
                    if(this.getDetail.content.length>50){
                        this.getDetail.content=this.getDetail.content.substring(0,50);
                    }
                    this.len=this.getDetail.content.length;
                    if(this.plate_num!='' &&  this.input_flag!=2 && this.getDetail.content!=''){
                        this.isSubmit=true;
                    }else{
                        this.isSubmit=false;
                    }
                });

            });
        },
        methods:{
            ...mapActions(["toast"]),
            ...mapMutations(["showLoad","hideLoad"]),
            submitDate(){
                if(this.isSubmit==false){
                    return;
                }
                this.showLoad();
                fetch(`${BASEINFO.host}${ADDREP}`,{
                    method:"POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: querystring.stringify({
                        format: "json",
                        token: BASEINFO.token,
                        uid:BASEINFO.uid,
                        plate_num:this.plate_num.trim().toLocaleUpperCase(),
                        content:this.getDetail.content.trim(),
                        type:2,
                        access_token:BASEINFO.access_token
                    })
                })
                    .then(response=>response.json())
                    .then(data=>{
                        this.hideLoad();
                        if(data.code==0){
                            this.toast(errcode.repair);
                            setTimeout(()=>{
                                this.getDetail.content = '';
                                this.len = 0;
                                this.isSubmit = false;
                                this.$router.go(-1);
                            },1000);
                        }else{
                            this.toast(data.message);
                        }
                    })
                    .catch(e=>{
                        console.log(e);
                        this.hideLoad();
                        this.toast(errcode.m404);
                    });
            }
        },
        components: {
            commonTop
        }
    }
</script>

<style lang="sass" scoped>
    @import "css/base";

    .content{
        width: 6.9rem;
        margin: 0.4rem auto 0;
        padding-bottom: .85rem;
        @extend %common-shadow;
        div{
            padding:.5rem .3rem;
            dl{
                line-height:.7rem;
                display: flex;
                color: $blackColor;
                dt{
                    flex:3;
                }
                dd{
                    flex:6;
                    input{
                        color: $blackColor;
                        display: block;
                        height: .6rem;
                        line-height: .6rem;
                        padding: 0 .3rem;
                        width:3.92rem;
                        border: 1px solid $greyColor2;
                        border-radius: 1rem;
                        box-sizing: border-box;


                        font-size: .3rem;
                        background-color: transparent;
                    }
                    /*.write{
                        color: $blackColor;
                    }*/

                    .err{
                        border: 1px solid #E00C26;
                        background-color: #FFF8F9;
                    }
                }
            }
            div{
                padding:0 0;
                margin-top: .15rem;
                position: relative;
                #faultDesc{
                    border-radius: .06rem;
                    color: $blackColor;
                    font-size: .36rem;
                    height: 4.74rem;
                    line-height: .5rem;
                    padding: .3rem;
                    width: 5.7rem;
                    resize: none;
                }
                #count{
                    position: absolute;
                    bottom:.3rem;
                    right:.3rem;
                }
            }
        }

        .bottomBtn{
                @extend %common-shadowBtn;
                width:6.3rem;
                height:.88rem;
                line-height: .88rem;
            }

    }
</style>