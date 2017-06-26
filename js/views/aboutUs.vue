<template>
    <div>
        <common-top title="关于我们"></common-top>

        <nav class="group-say-box">
            <h2>关于我们</h2>
            <p>航美集团是航美传媒集团创始人郭曼于2015年新成立的一家高科技移动互联网公司，总部位于中国北京，核心移动产品“往返”，是中国最大的出行娱乐服务平台。航美集团以“连接旅途中的一切美好”为使命，分别通过旗下的航美移动、航美干线、航美天翼三家子公司专注于长途客车、铁路、航空领域的Wi-Fi建设和运营，而自身通过整合客运交通资源、通讯网络、娱乐内容、O2O服务给人们提供出行娱乐和服务解决方案。</p>
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