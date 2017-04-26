<template>
    <header class="common-top">
        <div>
            <a @click="goBack()" :class="backType>-1?'goBack':''" href="javascript:;"></a>
            <h1>{{title}}</h1>
            <span v-if="link"><a :href="link">{{linkTitle}}</a></span>
        </div>
    </header>
</template>

<script>
    import {callN} from "nativeA";
    export default {
        props: {
            title: {
                type: String
            },
            backType: {
                type: Number,
                default: 0
            },
            link: {
                type: String
            },
            linkTitle: {
                type: String
            }
        },
        methods: {
            goBack(){
                switch(this.backType){
                    case 0:
                        window.history.go(-1);
                        break;
                    case 1:
                        // go app index-page
                    case 2: 
                        // go html bus-page
                    case 3: 
                        // go app my-page
                        callN("close",{type:this.backType})
                        break;
                }
            }
        }
    }
</script>