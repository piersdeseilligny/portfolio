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
        color:var(--foregroundsubtle);
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
        padding: 0px 8px;
        font-size:0.7em;
        transition: background-color 0.2s, color 0.1s;
        white-space: normal;
        position:relative;
    }
.tag-icon{
  width: 14px;
  margin-right:2px;
}
.tag-icon svg{
  max-width: 14px;
  max-height: 14px;
}
    .tag:hover{
        color:var(--foreground)
    }
    .tag.selected{
        color:var(--foregroundlink);
    }
    .tags-selectedall .tag{
        color:darkred;
    }
</style>
<script>
export default {
    props:["id","name","icon","selected","category"],
    methods:{
        toggleselect: function(ctrl){
            this.$emit("selectionchange", this.category, this.name, ctrl);
            console.log(ctrl);
        }
    }
}
</script>
