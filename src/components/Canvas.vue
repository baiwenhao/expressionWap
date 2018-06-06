<template>
  <div class="_canvas">
    <div id="canvas">
      <div class="canvas_rect"></div>
      <canvas id="_canvas"></canvas>
    </div>
    <button id='callback' class="iconfont icon-fanhui pd" @click="handlerEvent('back')"></button>
    <i id="previous" class="iconfont icon-chexiao1" @click="history"></i>
    <i id="next" class="iconfont icon-chexiao" @click="history"></i>
    <div id="save_canvas" class="pd f14" @click="save">保存</div>
    <button class="upload">
      <i class="iconfont icon-tianjia1" style="font-size: .14rem; color: #2BDAC5;"></i>
      <span id="upload_text"></span>
      <input id="postFile" type="file" @change="file" accept="image/png,image/gif,image/jpeg" name="file" class="file">
    </button>
    <div :class="{ 'active': flip }" class="bottom">
      <button v-show="levels" @click="handlerEvent('changeLevel', 'bringForward')" class="iconfont icon-zhiyudingceng"></button>
      <button v-show="levels" @click="handlerEvent('changeLevel', 'sendBackwards')" class="iconfont icon-zhiyudiceng"></button>
      <button @click="handlerEvent('fanzhuan', 'flipX')" style="font-size: .16rem" class="iconfont icon-zuoyoufanzhuan"></button>
      <button @click="handlerEvent('fanzhuan', 'flipY')" style="font-size: .16rem" class="iconfont icon-shangxiafanzhuan"></button>
    </div>
  </div>
</template>

<script>
  import { save, undo, redo, setCanvas, addLocalImg, handlerEvent } from '@common/canvas'
  import {
    delay,
    fileReader,
    compressImg
  } from '@common/util'
  import { mapGetters } from 'vuex'
  import ViewTitle from '@components/Title'

  export default {
    data () {
      return {
        list: []
      }
    },
    components: { ViewTitle },
    computed: { ...mapGetters(['levels', 'flip']) },
    mounted () {
      setCanvas('#canvas', (cache) => {
        cache.router = this.$router
      })
      if (window.__wxjs_environment === 'miniprogram') {
        document.querySelector('#callback').style.marginTop = -100 + 'px'
      }
    },
    methods: {
      save,
      handlerEvent,
      file (e) {
        const tar = e.target.files[0]
        if (!tar) return
        const type = tar.name.slice(tar.name.lastIndexOf('.') + 1)
        if (/(gif|png|jpeg|jpg)/gi.test(type)) {
          if (tar.size > Math.pow(500, 2)) {
            compressImg(tar, (d) => {
              document.querySelector('#postFile').value = ''
              addLocalImg(d, tar.type.replace('image/', ''))
            })
          } else {
            fileReader(tar, {
              readAsDataURL: 1,
              onload (d) {
                document.querySelector('#postFile').value = ''
                addLocalImg(d, tar.type.replace('image/', ''))
              }
            })
          }
        } else {
          Toast.top('目前只支持上传图片格式')
          document.querySelector('#postFile').value = ''
        }
      },
      history (e) {
        delay(() => {
          e.target.id === 'previous' ? undo() : redo()
        }, 250)
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
  }
  ._canvas {
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: calc((100vw / 4) + 38px);
    background-color: #f0f0f0;
  }
  ._canvas .bottom {
    position: absolute;
    right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    bottom: 10px;
    transition: transform .3s;
    transform: translateY(50px);
  }
  ._canvas .bottom.active {
    bottom: 10px;
    transform: translateY(0);
  }
  ._canvas .bottom .iconfont {
    width: .3rem;
    height: .3rem;
    margin-left: 15px;
    border-radius: 60px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 0 4px #999;
    font-size: .15rem;
  }
  ._canvas .upload {
    position: absolute;
    bottom: 10px;
    left: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: .3rem;
    padding: 0 14px 0 14px;
    background: #fff;
    color: #01DFD0;
    font-size: .14rem;
    border-radius: 30px;
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
  .icon-chexiao1, .icon-chexiao {
    height: 44px;
    line-height: 44px;
    position: absolute;
    top: 0;
    color: #999;
  }
  #callback, #save_canvas {
    position: absolute;
    left: 0;
    top: 0;
    height: 44px;
    line-height: 44px;
    font-size: .15rem;
  }
  #save_canvas {
    left: auto;
    right: 0;
    color: #999;
  }
  #save_canvas.save {
    color: #333;
  }
  #previous {
    right: 50%;
    margin-right: .06rem;
    padding: 0 .06rem;
  }
  #next {
    left: 50%;
    margin-left: .06rem;
    padding: 0 .06rem;
  }
  ._canvas .active {
    color: #333;
  }
</style>