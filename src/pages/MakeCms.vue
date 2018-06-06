<template>
  <div class="make">
    <canvas-view />
    <div class="operating" :class="[navActive ? navActive.type : '']">
      <div class="top flex" v-show="navActive.type == 'body'">
        <div class="f1">共 <strong style="color: #333;">{{ total }}</strong> 张，已做 <strong style="color: green">{{ complete }}</strong> 张，还剩 <strong style="color: red;">{{ remaining }}</strong> 张</div>
      </div>
      <div @click="seeMore" class="flex" :class="[type ? 'more_text' : 'more_img']">
        <span class="iconfont" :class="[ type ? 'icon-tianjia' : 'icon-gengduo' ]"></span>
        <span class="tips">{{ type ? '添加文字' : '更多素材' }}</span>
      </div>
      <router-view ref="scroll" />
    </div>
    <nav-view />
  </div>
</template>

<script>
  import NavView from '../components/Nav'
  import CanvasView from '../components/CanvasCms'
  import { mapGetters, mapActions } from 'vuex'
  import { cache } from '@api/data'
  import { addText, getLength, copyCanvas } from '@common/canvas_cms'

  export default {
    data () {
      return {
        lock: false,
        searchState: false
      }
    },
    computed: {
      ...mapGetters([
        'navActive',
        'hotMain'
      ]),
      total () {
        return this.hotMain.length
      },
      remaining () {
        let n = 0
        for (let i = 0; i < this.hotMain.length; i++) {
          if (!this.hotMain[i].createDetail) {
            n += 1
          }
        }
        return n
      },
      complete () {
        let n = 0
        for (let i = 0; i < this.hotMain.length; i++) {
          if (this.hotMain[i].createDetail) {
            n += 1
          }
        }
        return n
      },
      type () {
        return this.navActive.type === 'text'
      }
    },
    components: {
      NavView,
      CanvasView
    },
    beforeRouteUpdate (to, from, next) {
      if (to.name === 'text') {
        const t = getLength()
        if (t.length === 0 && !this.lock) {
          const t = '双击修改'
          addText(t)
          this.lock = true
        } else {
          let i = 0
          for (; i < t.length; i++) {
            if (t[i].type === 'i-text' || t[i].type === 'text' || t[i].type === 'textbox') {
              break
            }
          }
          if (i !== t.length - 1 && !this.lock) {
            const t = '双击修改'
            addText(t)
            this.lock = true
          }
        }
      }
      document.querySelector('#scrollHot').scrollLeft = this.navActive.left || 0
      next()
    },
    methods: {
      ...mapActions(['searchRandom']),
      seeMore () {
        if (this.navActive.type !== 'text') {
          copyCanvas()
          this.$router.push({ name: 'expression', query: { type: this.navActive.type }}, () => {
            // cb
          })
        } else {
          this.searchRandom({ fontFamily: cache.family })
        }
      }
    }
  }
</script>

<style>
  .make {
    position: fixed;
    top: 0;
    bottom: .5rem;
    left: 0;
    right: 0;
  }
  .make.blur {
    filter: blur(4px);
  }
  .operating {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc((100vw / 4) + 38px);
    background-color: #fff;
  }
  .operating .iconfont {
    font-size: .25rem;
    margin-bottom: 6px;
  }
  .operating .tips {
    font-size: .10rem;
  }
  .operating .more_img {
    flex-direction: column;
    align-items: center;
    width: calc((100vw / 4) - 10px);
    height: calc((100vw / 4) - 10px);
    margin-top: 24px;
    margin-left: 16px;
    border-radius: 5px;
    color: #fff;
    background-color: #31DFCC;
  }
  .operating .more_img .iconfont {
    color: #fff;
  }
  .operating .more_text {
    flex-direction: column;
    align-items: center;
    width: calc((100vw / 4) - 10px);
    height: calc((100vw / 4) - 10px);
    margin-top: 24px;
    margin-left: 16px;
    border-radius: 5px;
    color: #31DFCC;
    background-color: #fff;
    box-shadow: 0 0 5px #ddd;
  }
  .operating .more_text .iconfont {
    color: #31DFCC;
  }
  .operating.body .cont_img {
    padding: 2px;
  }
  .operating.head .cont_img {
    padding: 2px;
  }
  .operating.sticker .cont_img {
    padding: 2px;
  }
  .operating.text .cont_img {
    border-width: 1px;
  }
  .operating .cont .cont_active {
    padding: 0;
    border: 2px solid #31DFCC;
  }
  .operating .top {
    position: absolute;
    right: 6px;
    left: 16px;
    top: 2px;
  }
</style>