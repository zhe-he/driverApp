<template>
    <header class="common-top">
        <div>
            <a @click="goBack()" :class="backType>-1?'goBack':''" href="javascript:;"></a>
            <h1>{{title}}</h1>
            <i></i>
        </div>
    </header>
</template>

<script>
    export default {
        props: {
            title: {
                type: String
            },
            backType: {
                type: Number,
                default: 0
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
                        break;
                    case 3: 
                        // go app my-page
                        break;
                }
            }
        }
    }
</script>