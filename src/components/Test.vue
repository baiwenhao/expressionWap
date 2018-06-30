<template>
  <div class="test">
    <button @click="handler" class="btn">生成gif</button>
  </div>
</template>

<script>
  import '@common/canvas2image'

  export default {
    data () {
      return {

      }
    },
    mounted () {
    },
    methods: {
      reload () {
        window.location.reload()
      },
      handler (e, t) {

      }
    }
  }
</script>

<style>
  body {
    -webkit-overflow-scrolling: touch;
  }
  .test {
    margin-top: 100px;
    position: relative;
    min-height: 100vh;
    text-align: center;
  }
  .item {
    display: flex;
    justify-content: center;
    align-self: center;
  }
  .input {
    height: 40px;
    line-height: 40px;
    border: 1px solid #ddd;
  }
  .btn {
    line-height: 60px;
    margin: 200px 0;
    padding: 0 12px;
    font-size: 30px;
    background: #ddd;
  }
  .parent {
    position: relative;
    /*padding: 100px 0;*/
  }
  .head {
    height: 500px;
    position: relative;
  }
  .test_hr {
    position: absolute;
    left: 0;
    top: 0;
    width: 6px;
  }
</style>
