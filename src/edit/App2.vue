<template>
  <div id="make" class="make">
    <div class="box" v-show="!build">
      <div id="rect" class="rect"><canvas id="canvas"></canvas></div>
      <div class="area">
        <div contenteditable="true" id="area" @input="changeInput"></div>
      </div>
      <div style="height: 12px;"></div>
    </div>
    <div id="view" style="display: none;"></div>
    <div style="text-align: center;">
      <img class="btn" v-show="!build" @click="buildSrc" :src="btn">
      <div v-show="!pc && build" style="display: flex;margin-bottom: 12px;justify-content: center;">
        <i class="no">i</i>长按图片，保存至相册
      </div>
      <div class="flex" v-show="build">
        <img class="bb" :src="go" @click="again">
        <img class="bb" v-show="pc" :src="saves" @click="saveFile">
      </div>
    </div>
    <div id="bottom" class="bottom" @click="getApp">
      <div class="_bottom">
        <div class="c1"><img :src="bar" /></div>
        <div class="c2"><img :src="logo" /></div>
      </div>
    </div>
  </div>
</template>

<script>
  import btn from '@assets/btn.png'
  import logo from '@assets/logo.png'
  import bar from '@assets/bar.png'
  import saves from '@assets/save.png'
  import go from '@assets/go.png'
  import { setCanvas, build, IsPC, save } from '@common/canvas_edit'

  export default {
    data () {
      return {
        pc: IsPC(),
        build: 0,
        btn,
        bar,
        logo,
        saves,
        go
      }
    },
    mounted () {
      const bottom = document.querySelector('#bottom')
      setTimeout(() => {
        const make = document.querySelector('#make')
        make.style.paddingBottom = bottom.offsetHeight + 'px'
      }, 1000)
      document.title = '全民记仇'
      setCanvas()
    },
    methods: {
      buildSrc () {
        build(() => {
          this.build = 1
        })
      },
      changeInput (e) {
        // const tar = e.target
        // tar.style.height = tar.scrollHeight + 'px'
      },
      again () {
        window.location.reload()
      },
      saveFile () {
        save()
      },
      getApp () {
        window.location.assign('http://a.app.qq.com/o/simple.jsp?pkgname=com.soqu.client&ckey=CK1393939922486')
      }
    }
  }
</script>

<style>
  body {
    min-width: 300PX;
    max-width: 640PX;
    margin: 0 auto;
  }
  .make {
    position: relative;
    min-height: 100vh;
    box-sizing: border-box;
    background-color: #F0F0F0;
  }
  .make .bottom img {
    width: 100%;
  }
  .make .box {
    position: relative;
  }
  .make .btn {
    width: 180px;
    height: 50px;
    cursor: pointer;
  }
  .make ._bottom {
    max-width: 640px;
    display: flex;
    margin: 0 auto;
    padding: 10px;
    box-sizing: border-box;
  }
  .make .bottom {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
  }
  .make .c1 {
    /*width: 70vw;*/
    padding-right: 12px;
  }
  .make .c2 {
    /*width: 20vw;*/
  }
  .make .rect {
    width: 100vw;
    margin: 0 auto;
    max-width: 600px;
    box-sizing: border-box;
  }
  .make .flex {
    padding: 0 12px;
    box-sizing: border-box;
  }
  .make .bb {
    max-height: 44px;
    max-width: 44vw;
    margin: 0 4px;
  }
  .make .no {
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    overflow: hidden;
    border-radius: 12px;
    color: #fff;
    display: inline-block;
    background-color: #00DAC3;
  }
  .area {
    max-width: 600px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 12px;
    background-color: #fff;
  }
  #area {
    line-height: 26px;
    padding: 0 12px;
    resize: none;
    font-weight: 900;
    font-size: 20px;
    width: 100%;
    height: 100%;
    border: none;
    color: #333;
    box-sizing: border-box;
  }
  #view {
    padding: 12px;
    box-sizing: border-box;
  }
  #view img {
    width: 100%;
  }
</style>
