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
  margin-right:2px;
}
.contentblock .tag-icon{
  margin-right:6px;
}
.tag-icon svg{
  max-width: 14px;
  max-height: 14px;
}
.contentblock .tag-icon{
  max-height:18px;
}
.contentblock .tag-icon svg{
  max-height:18px;
  max-width:24px;
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
        }
    }
}
</script>
