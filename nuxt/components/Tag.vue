<template>
    <div
    @click.exact="toggleselect(false)"
    @click.meta="toggleselect(true)"
    @click.ctrl="toggleselect(true)"
    v-bind:class="{selected:selected, 'tag':true}">
        <span class="tag-icon" v-if="icon" v-html="icon"></span>
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
        font-size:0.7em;
        transition: background-color 0.2s, color 0.1s;
        white-space: normal;
    }
.tag-icon{
  width: 14px;
  margin-right:4px;
}
.tag-icon svg{
  max-width: 14px;
  max-height: 14px;
}
    .tag:hover{
        background-color:rgba(255,255,255,0.05);
    }
    .tag.selected{
        color:white;
    }
    .tags-selectedall .tag{
        color:darkred;
    }
</style>
<script>
export default {
    props:["id","name","icon","selected"],
    methods:{
        toggleselect: function(ctrl){
            this.$emit("selectionchange", this.id, ctrl);
            console.log(ctrl);
        }
    }
}
</script>
