/**
 * Created by yangshuang on 2017/4/13.
 */
import "css/messageContent.scss"

import Vue from "vue";
import commonTop from "common-top";

window.addEventListener("DOMContentLoaded",()=>{

    new Vue({
        el: "#messageContent",
        components: {
            commonTop
        }
    });
    
},false);