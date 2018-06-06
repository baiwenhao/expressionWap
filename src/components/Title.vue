<template>
  <div class="title_view start flex">
    <button v-show="back" @click="back($event, 'back')" class="iconfont icon-fanhui pd"></button>
    <span v-show="text" class="f14" style="font-weight: 900;">{{ text }}</span>
    <button v-show="done" @click="done($event, 'done')" class="pd f14 blue">{{ doneText || '完成' }}</button>
    <div v-show="!done" style="visibility: hidden;" class="pd f14">{{ doneText || '完成' }}</div>
  </div>
</template>

<script>
  export default {
    props: {
      back: Function,
      done: Function,
      doneText: String,
      text: String
    }
  }
</script>

<style>
  .title_view .f14 { font-size: .14rem; }
  .title_view.flex { justify-content: space-between; }
  .title_view .blue { position: absolute;right: 0;top: 0; color: #333; }
  .title_view .blue:active { color: #31DFCC; }
  .title_view .icon-fanhui { position: absolute;left: 0;top: 0;font-size: .15rem; }
  .title_view .pd { position: relative; overflow: hidden; }
  .title_view .ripple { background-color: rgba(255, 255, 255, .5); }
</style>
