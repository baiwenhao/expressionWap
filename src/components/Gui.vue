<template>
  <div class="gui" v-show="show">
    <div class="bg" @click="hide(false)">
      <div class="info">
        <i class="iconfont icon-dianji" style="font-size: .22rem;font-weight: 900;margin-right: 6px;"></i>你对表情的需求，这里都能满足你
        <div class="ico"></div>
      </div>
    </div>
    <div class="img">
      <img class="expression" :src="expression">
      <div class="p top">
        <img class="v" :src="gui">
      </div>
      <div class="p t-top">
        <div class="text"><b class="r">2</b>添加脸部素材<i class="iconfont icon-lianbu"></i></div>
      </div>
      <div class="p left">
        <img class="v" :src="gui">
      </div>
      <div class="p t-left">
        <div class="text">
          <b class="r">1</b>
          <div style="margin-left: -72px;margin-top: 28px;">选择身体<i class="iconfont icon-shenti"></i></div>
        </div>
      </div>
      <div class="p bottom">
        <img class="v" :src="gui">
      </div>
      <div class="p t-bottom">
        <div class="text"><b class="r">3</b>添加文字<i class="iconfont icon-wenzixuanzhong"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
  import gui from '../assets/gui.png'
  import expression from '../assets/im.png'

  export default {
    props: {
      show: false,
      hide: Function
    },
    data () {
      return {
        gui,
        expression
      }
    }
  }
</script>

<style>
  .gui {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10000;
  }
  .gui .bg {
    position: absolute;
    top: 0;
    bottom: .5rem;
    left: 0;
    right: 0;
    background: rgba(000, 000, 000, .7);
  }
  .gui .img {
    width: 173px;
    height: 173px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 28% auto;
    background-color: #fff;
    border-radius: 6px;
    color: #fff;
    font-size: .14rem;
  }
  .gui .v {
    width: 98px;
    height: 27px;
  }
  .gui .p {
    position: absolute;
  }
  .gui .left {
    top: 66px;
    left: -36px;
  }
  .gui .top {
    transform: rotate(90deg) scaleY(-1);
    top: -20px;
    left: 26px;
  }
  .gui .iconfont {
    color: #fff;
  }
  .gui .bottom {
    left: 50px;
    bottom: -58px;
    transform: rotate(-110deg) scaleY(-1); /*  */
  }
  .gui .t-top {
    top: -62px;
    left: 93px;
  }
  .gui .t-left {
    top: 100px;
    left: -50px;
  }
  .gui .t-bottom {
    position: absolute;
    left: 88px;
    bottom: -124px;
  }
  .gui .expression {
    width: 100%;
    height: 100%;
  }
  .gui .info {
    width: 277px;
    height: 60px;
    line-height: 60px;
    color: #fff;
    font-size: 15px;
  }
  .gui .text {
    display: flex;
    text-align: center;
    justify-content: center;
    white-space: nowrap;
  }
  .gui .text .iconfont {
    margin-left: 4px;
  }
  .gui .r {
    width: 22px;
    height: 22px;
    text-align: center;
    line-height: 22px;
    display: inline-block;
    border-radius: 12px;
    background-color: #31DFCC;
    font-size: 15px;
    margin-right: 4px;
  }
  .gui .info {
    position: absolute;
    left: 49px;
    right: 49px;
    bottom: 30px;
    height: 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    background-color: #31DFCC;
    color: #fff;
  }
  .gui .ico {
    width: 0;
    height: 0;
    overflow: hidden;
    position: absolute;
    left: 50%;
    margin-left: -12px;
    bottom: -22px;
    border-width: 12px;
    border-style: solid;
    border-color: #2BDAC5 transparent transparent transparent;
  }
</style>


