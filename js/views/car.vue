<template>
    <div>
        <common-top :back-type="-2" title="车辆信息"></common-top>
        
        <div class="height30"></div>
        <nav class="bus-menu">
            <router-link tag="a" to="/carDetail">
                <i></i>
                <p>当前车辆：<span v-html="plate_num"></span></p>
                <i></i>
            </router-link>
            <router-link tag="a" to="/deviceCheck">
                <i></i>
                <p><span>设备日检</span><span>检测结果</span></p>
                <i></i>
            </router-link>
            <router-link tag="a" to="/myRepairs">
                <i></i>
                <p>故障追踪</p>
                <i></i>
            </router-link>
            <a href="javascript:;">
                <i></i>
                <p>车内目前上网用户<b v-html="now"></b>人</p>
                <i></i>
            </a>
        </nav>
        <div class="height30"></div>
        <div class="car-line">
            <h2>本次行驶轨迹</h2>
            <div class="car-map">
                <div id="car-map"></div>
                <a href="javascript:;"></a>
            </div>
        </div>
    </div>
</template>


<script>
    /**
     * 1. 检测是否处在往返wifi下，如果不是，弹窗提示(弹窗移除)
     * 1. 获取设备sn，通过sn获取当前车牌号
     * 1. 每分钟获取车内上网用户
     * 1. 每分钟获取设备的经纬度，转换成百度坐标打点地图
     */


    import { mapState,mapMutations } from 'vuex';
    import commonTop from "common-top";

    export default {
        data(){
            return {
                map: null,
                CONVERTOR: null,
                translateCount: 0,
                translateList: []
            }
        },
        computed: mapState({
            "plate_num": state => state.carInfo.plate_num,
            "now": state => state.deviceInfo.now,
            "gpsList": state => state.deviceInfo.gpsList
        }),
        watch: {
            "gpsList": {
                handler(newVal){
                    this.drawLine(newVal);
                },
                deep: true
            },
            translateCount(newVal){
                if (newVal >= this.gpsList.length) {

                    // 清除undefined
                    this.translateList = this.translateList.filter(item=>item);

                    this.map.clearOverlays(); 
                    var lastPoint = this.translateList[this.translateList.length-1];
                    let polyline = new BMap.Polyline(this.translateList,{strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});                             
                    let marker = new BMap.Marker(lastPoint); 
                    this.map.addOverlay(polyline);
                    this.map.addOverlay(marker);
                    if (this.map.getZoom()<12) {
                        this.map.centerAndZoom(lastPoint,13); 
                    }else{ 
                        this.map.setCenter(lastPoint);
                    } 
                }
            }
        },
        mounted(){
            this.$nextTick(()=>{
                this.mapInit();
                this.drawLine(this.gpsList);
            });
        },
        methods: {
            ...mapMutations(["showLoad","hideLoad"]),

            translate(aPoint,index){
                this.CONVERTOR.translate(aPoint,1,5,data=>{
                    this.translateCount += 10;
                    if (data.status==0) {
                        this.translateList.splice(index,10,...data.points);
                    }
                });
            },
            drawLine(line){ 
                if (line.length==0) {return }
                this.translateCount = 0;
                for (var i = 0; i < line.length; i+=10) { 
                    var aLine = line.slice(i,i+10);
                    var aPoint = [];
                    for (var j = 0; j < aLine.length; j++) {
                        let ggPoint = new BMap.Point(aLine[j].lng, aLine[j].lat);
                        aPoint.push(ggPoint);
                    }
                    this.translate(aPoint,i);
                }

            },
            mapInit(){
                this.map = new BMap.Map("car-map");    // 创建Map实例
                this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
                this.map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
                this.CONVERTOR = new BMap.Convertor(); // 实际坐标转换百度坐标对象
            }
        },
        components: {
            commonTop
        }
    }
</script>

<style lang="sass">
    @import "css/base";
    .bus-menu{
        width: 6.9rem;
        margin: 0 auto;
        @extend %common-shadow;
        box-sizing: border-box;
        padding: 0 0.3rem;
        > a{
            position: relative;
            display: block;
            width: 100%;
            @extend %ui-border-b;
            color: $blackColor;
            p{
                height: 1.4rem;
                line-height: 1.4rem;
                font-size: 0.34rem;
                padding: 0 0.42rem 0 0.7rem;
                > span:nth-of-type(2){
                    width: 50%;
                    text-align: right;
                    float: right;
                    color: $blueColor;
                }
                b{
                    margin: 0 0.1rem;
                    color: $blueColor;
                }
            }
            > i{
                position: absolute;
                top: 50%;
                &:nth-of-type(1){
                    left: 0;
                }
                &:nth-of-type(2){
                    right: 0;
                }
            }
            $aImg: 'icon_car' 'icon_Test' 'icon_fault' 'icon-user';
            $aWidth: 0.84rem 0.82rem 0.8rem 0.8rem;
            $aHeight: 0.92rem 0.92rem 0.82rem 0.78rem;
            @for $i from 1 to 5{
                // UI给的图片大了一倍，故÷2
                $w: nth($aWidth,$i)/2;
                $h: nth($aHeight,$i)/2;
                &:nth-child(#{$i}) > i:nth-of-type(1){
                    width: $w+0.03rem;
                    height: $h+0.03rem;
                    margin-top: -$h/2;
                    @include bg2(nth($aImg,$i),$w,$h);
                }
            }
            &:nth-child(1) > i:nth-of-type(2){
                width: 0.41rem;
                height: 0.42rem;
                margin-top: -0.21rem;
                @include bg2('icon_Set_up');
            }
            &:nth-child(2) > i,
            &:nth-child(3) > i{
                &:nth-of-type(2){
                    width: 0.14rem;
                    height: 0.24rem;
                    margin-top: -0.12rem;
                    @include bg2('Stroke');
                }
            }
        }
    }

    .car-line{
        @extend %common-shadow;
        width: 6.9rem;
        padding-top: 0.14rem;
        margin: 0 auto;
        > h2{
            height: 1.04rem;
            line-height: 1.04rem;
            font-size: 0.34rem;
            color: $blackColor;
            text-indent: 0.9rem;
            font-weight: normal;
            @include bg2('icon-trajectory',0.43rem,0.42rem);
            background-position: 0.3rem center;
        }
        .car-map{
            position: relative;
            height: 3.34rem;
            > div{
                height: 100%;
            }
            > a{
                z-index: 10;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 68px;
                height: 25px;
            }
        }
    }
</style>