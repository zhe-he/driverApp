/**
 * Created by yangshuang on 2017/3/30.
 */
import "css/myRepairs.scss"

import Vue from "vue";
import commonTop from "common-top";

window.addEventListener("DOMContentLoaded",()=>{
    new Vue({
        el: "#myRepairs",
        components: {
            commonTop
        }
    })
},false);