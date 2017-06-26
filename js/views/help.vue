<template>
    <div>
        <common-top title="帮助"></common-top>
        <nav class="group-say-box">
            <h2>帮助</h2>
            <p>本应用部分功能需要连接车载WIFI网络使用，当您所处环境有往返WIFI网络时，请您保持WIFI连接状态。</p>
            <p>本应用会用到您手机的定位权限，以便为车辆信息可以正常显示。当弹出权限确认弹窗时，请您点击“始终允许”。</p>
        </nav>
    </div>
</template>

<script>
    import commonTop from "common-top";

    export default {
        data(){
            return {
            }
        },
        components: {
            commonTop
        }
    }
</script>

<style lang="sass">
    @import "css/group-say.scss";
</style>