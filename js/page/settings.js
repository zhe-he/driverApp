import "css/settings.scss";
import Vue from "vue";

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
            goBack(){

            },
            cleanCache(){

            },
            updateApp(){

            },
            signOut(){
                
            }
        }
    })
},false);