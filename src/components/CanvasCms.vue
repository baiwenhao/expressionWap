<template>
  <div class="_canvas">
    <div id="canvas"></div>
    <div id="addRect" @click="addRect" style="left: 0;right: auto;">添加脸部</div>
    <div id="save_canvas" @click="view">提交</div>
    <button class="upload bottom">
      <i @click="clear" class="iconfont icon-lajitong" style="font-size: .2rem"></i>
    </button>
    <div v-show="flip" class="abs bottom" style="right: 15px;bottom: 12px;left: auto;width: auto;">
      <button v-show="levels" @click="changeLevel('bringForward')" class="iconfont icon-zhiyudingceng"></button>
      <button v-show="levels" @click="changeLevel('sendBackwards')" class="iconfont icon-zhiyudiceng"></button>
      <button @click="fz('flipX')" style="font-size: .16rem" class="iconfont icon-zuoyoufanzhuan"></button>
      <button @click="fz('flipY')" style="font-size: .16rem" class="iconfont icon-shangxiafanzhuan"></button>
    </div>
  </div>
</template>

<script>
  import {
    save,
    build,
    clear,
    addRect,
    fanzhuan,
    setCanvas,
    changeLevel,
    addLocalImg
  } from '@common/canvas_cms'
  import ViewTitle from '@components/Title'
  import { fileReader, loadingImg } from '@common/util'
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        list: []
      }
    },
    components: {
      ViewTitle
    },
    computed: {
      ...mapGetters(['levels', 'flip', 'hotMain'])
    },
    mounted () {
      setCanvas('#canvas')
    },
    methods: {
      view () {
        this.$router.push({ name: 'body' })
        for (let i = 0; i < this.hotMain.length; i++) {
          if (this.hotMain[i].active) {
            save(this.$router, this.hotMain[i].id)
            break
          }
        }
      },
      build,
      clear,
      addRect,
      changeLevel,
      fz (t) { fanzhuan(t) },
      file (e) {
        const tar = e.target.files[0]
        fileReader(tar, {
          readAsDataURL: true,
          onload (d) {
            loadingImg(d).then((res) => {
              addLocalImg(res, true)
            })
          }
        })
      }
    }
  }
</script>

<style>
  #canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
  }
  ._canvas {
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: calc((100vw / 4) + 38px);
  }
  ._canvas .abs {
    position: absolute;
    left: 0;
    width: 100%;
  }
  ._canvas .top {
    top: 0;
  }
  ._canvas .bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    bottom: 16px;
  }
  ._canvas .bottom .iconfont {
    width: .3rem;
    height: .3rem;
    line-height: .3rem;
    margin-left: 15px;
    border-radius: 60px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 0 4px #999;
    font-size: .15rem;
  }
  ._canvas .icon-tianjia1 {
    font-size: .14rem;
    color: #2BDAC5;
  }
  ._canvas .upload {
    position: absolute;
    left: 12px;
    bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ._canvas .file {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .canvas_rect {
    position: absolute;
    pointer-events: none;
    background-color: #fff;
  }
  ._canvas .history .f14 {
    color: #999;
  }
  ._canvas .history .save {
    color: #333;
  }
  #save_canvas, #addRect {
    position: fixed;
    top: 0;
    right: 0;
    padding: 12px;
    font-size: .14rem;
    cursor: pointer;
  }
</style>