import "css/bus.scss";
import Vue from "vue";
import commonTop from "common-top";

window.addEventListener("DOMContentLoaded",()=>{

    new Vue({
        el: "#bus",
        components: {
            commonTop
        }
    })
},false);