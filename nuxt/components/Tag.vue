<template>
    <div
    @click.exact="toggleselect(false)"
    @click.meta="toggleselect(true)"
    @click.ctrl="toggleselect(true)"
    v-bind:class="{selected:selected, 'tag':true}">

        <span class="tag-icon" v-if="icon" v-html="icon"></span>
        {{name}}
        <span class="tag-desc">{{title}}</span>
    </div>
</template>
<style>
    .tag{
        width:276px;
        display:inline-block;
        color:var(--foreground);
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        font-size: 0.8rem;
        font-weight: 500;
        transition: background-color 0.2s, color 0.1s;
        white-space: normal;
        position:relative;
    }
    .tag-desc{
      color:var(--foregroundsubtle);
      font-size:11px;
      display:block;
    }
.tag-icon{
  margin-right:0px;
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
    .tag.selected{
        color:var(--foregroundlink);
    }
    .tags-selectedall .tag{
        color:darkred;
    }
</style>
<script>
export default {
    props:["id","name","icon","selected","category","title"],
    methods:{
        toggleselect: function(ctrl){
            this.$emit("selectionchange", this.category, this.name, ctrl);
        }
    }
}
</script>
