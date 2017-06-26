<template>
    <div>
        <common-top title="车辆详情"></common-top>        
        <div class="height30"></div>
        <div class="busDetail-content">
            <div class="busDetail-info">
                <h2>车辆档案</h2>
                <p><span>车牌号：</span><a href="javascript:;">{{plate_num}}</a></p>
                <div class="busDetail-pic">
                    <span>行驶证：</span>
                    <div class="imgbox">
                       <img :src="mdriving_license_img?mdriving_license_img:'images/tmp/zhengjian4.png'"> 
                    </div>
                </div>
            </div>
            <div class="busDetail-archives">
                <h2>车载数字中心设备档案</h2>
                <p><span>S/N:</span><span>{{deviceSN}}</span></p>
                <p><span>MAC:</span><span>{{deviceMac}}</span></p>
            </div>
        </div>
    </div>
</template>



<script>
    import { mapState } from 'vuex';
    import commonTop from "common-top";

    export default {
        data(){
            return {
            }
        },
        computed: mapState({
            "mdriving_license_img": state=>state.carInfo.mdriving_license_img,
            "plate_num": state=>state.carInfo.plate_num,
            "deviceMac": state=>state.deviceInfo.deviceMac,
            "deviceSN": state=>state.deviceInfo.deviceSN
        }),
        components: {
            commonTop
        }
    }
</script>

<style lang="sass">
    @import "css/base";
    
    .busDetail-content{
        width: 6.9rem;
        @extend %common-shadow;
        margin: 0 auto;
        padding-bottom: 0.21rem;

        h2{
            height: 1.38rem;
            line-height: 1.38rem;
            font-size: 0.34rem;
            text-indent: 0.7rem;
            color: $blackColor;
            font-weight: normal;
            background-position: left center;
            @extend %ui-border-b;
            margin-bottom: 0.46rem;
        }
    }
    %ceilP{
        display: flex;    
        line-height: 0.48rem;
        font-size: 0.34rem;
        color: $blackColor;
        padding-bottom: 0.3rem;
        padding-left: 0.7rem;
    }
    .busDetail-info,.busDetail-archives{
        padding: 0 0.3rem;
        > p{
            height: 0.48rem;
            @extend %ceilP;
        }
    }
    .busDetail-pic{
        @extend %ceilP;
        > span{
            width: 1.75rem;
            height: 0.48rem;
            line-height: 0.48rem;
        }
        .imgbox{
            width: 3rem;
            height: 1.8rem;
            line-height: 1.8rem;
            img{
                max-width: 100%;
                max-height: 100%;
                vertical-align: middle;
            }
        }
    }

    .busDetail-info{
        position: relative;
        @extend %ui-border-b;
        h2{
            @include bg2('icon_car',0.42rem,0.46rem);
        }
        > p{
            > span,& > a{
                display: block;
            }
            > span{
                width: 1.75rem;
            }
            > a{
                width: 2.4rem;
                color: $blueColor;
            }
        }

        &:before,&:after{
            content: "";
            position: absolute;
            bottom: -0.14rem;
            width: 0.28rem;
            height: 0.28rem;
            border-radius: 50%;
            background-color: $bgColor;
        }
        &:before{
            left: -0.14rem;
            box-shadow: -0.03rem 0 0.03rem $shadowColor inset;
        }
        &:after{
            right: -0.14rem;
            box-shadow: 0.03rem 0 0.03rem $shadowColor inset;
        }
    }
    .busDetail-archives{
        h2{
            @include bg2('icon_equipment',0.43rem,0.41rem);
        }
        > p > span{
            display: block;
            &:nth-child(1){
                width: 1.1rem;
            }
            &:nth-child(2){
                width: 3rem;
            }
        }
    }
</style>