<template>
    <div>
        <common-top title="个人信息"></common-top>
        <section class="credentials-box">
            <div class="credentials-item">
                <span>公司名称</span>
                <b>{{userInfo.cmp_name}}</b>
            </div>
            <div class="credentials-item">
                <span>司机姓名</span>
                <b>{{userInfo.name}}</b>
            </div>
            <div class="credentials-item">
                <span>联系电话</span>
                <b>{{userInfo.mobile}}</b>
            </div>
            <div class="credentials-item">
                <span>驾驶证号</span>
                <b>{{userInfo.license}}</b>
            </div>
            <div class="credentials-photo">
                <p>驾驶证照片（照片为驾驶证信息主页）</p>
                <a href="javascript:;">
                    <img :src="userInfo.license_photo?userInfo.license_photo:'images/tmp/zhengjian4.png'" />
                </a>
            </div>
        </section>
    </div>
</template>

<style lang="sass">
    @import "css/credentials";
</style>

<script>

    import { mapState } from 'vuex';
    import commonTop from "common-top";

    export default {
        data(){
            return {
            }
        },
        computed: mapState(["userInfo"]),
        components: {
            commonTop
        }
    }
</script>