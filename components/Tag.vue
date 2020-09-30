<template>
    <div v-on:click="toggleselect" v-bind:class="{selected:selected, 'tag':true}">
        <span class="tag-icon" v-html="icon"></span>
        {{name}}
    </div>
</template>
<style>
    .tag{
        display:inline-block;
        color:rgba(255,255,255,0.5);
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
        padding: 6px 12px;
        font-size:0.8em;
        transition: background-color 0.2s, color 0.1s;
        white-space: normal;
    }
    .tag:hover{
        background-color:rgba(255,255,255,0.05);
    }
    .tag.selected{
        color:white;
    }
</style>
<script>
export default {
    props:["id","name","icon","selected"],
    methods:{
        toggleselect: function(){
            this.$emit("selectionchange", this.id);
        }
    }
}
</script>