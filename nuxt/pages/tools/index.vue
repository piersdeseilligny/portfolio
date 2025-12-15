<template>
    <div class="padder">
        <p class="tools-desc">These are some small online tools for my personal use, but that other people might find useful.</p>
        <ul class="tools-list">
            <ToolListItem flipid="qtake-csv" :link="{path:'/tools/qtake-metadata-csv-transformer'}" name="QTake Metadata CSV Transformer" description="Process metadata .csv exports from QTake for optimized compatibility with DaVinci Resolve"/>
            <ToolListItem flipid="offshootreport" :link="{path:'/tools/offshoot-report-generator'}" name="OffShoot Report Generator" description="Generate DIT Reports from any number of OffShoot log files"/>
        </ul>
    </div>
</template>
<style scoped>
.padder{
    background: var(--backgroundpaper);
    position:absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    padding-top:var(--headerheight);
    overflow-y:auto;
}
ul{
    padding-inline-start: 0;
}
p{
    color: rgba(215, 237, 255, 0.5);
    margin-right: var(--rightmargin);
    margin-top: 6px;
    margin-bottom: 4px;
}
.tools-desc{
    margin-top:24px;
}
.tools-list{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap:12px;
}
</style>
<script>
import ToolListItem from '~/components/ToolListItem.vue';
export default {
    
}
</script>