<template>
    <div class="padder">
        <p class="tools-desc">These are some small online tools for my personal use, but that other people might find useful.</p>
        <ul>
            <ToolListItem :link="{path:'/tools/qtake-metadata-csv-transformer'}" name="QTake Metadata CSV Transformer" description="Process metadata .csv exports from QTake for optimized compatibility with DaVinci Resolve"/>
        </ul>
    </div>
</template>
<style>
ul{
    padding-inline-start: 0;
}
p{
    color: rgba(215, 237, 255, 0.5);
    font-size: 14px;
    margin-right: var(--rightmargin);
    margin-top: 6px;
    margin-bottom: 4px;
}
.tools-desc{
    margin-top:24px;
}
</style>
<script setup lang="ts">
import ToolListItem from '~/components/ToolListItem.vue';

</script>