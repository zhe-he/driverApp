import "css/settings.scss";
import Vue from "vue";
import commonTop from "common-top";

window.addEventListener("DOMContentLoaded",()=>{

    new Vue({
        el: "#settings",
        data:{
            isCanUpdate: false
        },
        mounted(){
            this.isCanUpdate = true;
        },
        methods: {
            cleanCache(){

            },
            updateApp(){

            },
            signOut(){
                
            }
        },
        components: {
            commonTop
        }
    })
},false);