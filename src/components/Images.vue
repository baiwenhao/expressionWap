<template>
  <div class="images" :class="{ 'active': status }">
    <view-title :back="back" :text="''" />
    <div class="mw start" style="color: #333;" ref="animate">
      <span class="ant" ref="text">{{ detail && detail.templetName }}</span>
    </div>
    <div id="scrollH" class="list_item four" @scroll="resize" ref="main">
      <div class="min_h">
        <div v-show="detail && detail.intro" class="mw start" style="border-bottom: 1px solid #EFEFEF;font-size:.12rem;line-height: .12rem;padding-top: 12px;padding-bottom:24px;color: #666;">{{ detail.intro }}</div>
        <div class="flex" style="padding: 24px 18px;padding-bottom: 0;">
          <div @click="addImg(v)" class="item" v-for="v in list">
            <img v-lazy="v.previewUrl || v.url">
          </div>
        </div>
      </div>
      <div v-show="detail._end" style="text-align: center;">没有更多了</div>
      <div class="_copyright">Copyright© 来源于{{ detail && detail.sourceName || '网络' }}</div>
      <div class="nodata" v-if="list && list.length === 0">暂无图片</div>
    </div>
  </div>
</template>

<script>
  import { getData } from '@common/util'
  import { cache, menu } from '@api/data'
  import ViewTitle from '@components/Title'

  export default {
    props: {
      list: Array,
      status: Boolean,
      detail: Object
    },
    data () {
      return {
        lock: false,
        scrollTimer: ''
      }
    },
    components: {
      ViewTitle
    },
    mounted () {
      this.time = ''
      this.num = 0
      this.m = this.$refs.animate
      this.t = this.$refs.text
      this.l = this.$refs.main
    },
    methods: {
      resize (e) {
        const top = e.target.scrollTop
        if (e.target.offsetHeight + top >= e.target.scrollHeight && !this.detail._end && !this.detail._loading) {
          this.$emit('load')
        }
        clearTimeout(this.scrollTimer)
        this.scrollTimer = setTimeout(() => {
          if (top > 88 && !this.lock) {
            this.top('top')
          } else if (top <= 10) {
            this.top()
          }
        }, 50)
      },
      setMore (type, state) {
        this[type] = state
      },
      top (state) {
        this.lock = 1
        clearInterval(this.time)
        this.time = setInterval(() => {
          const n = state === 'top' ? this.num + 2 : this.num - 2
          const w = (window.innerWidth - this.t.offsetWidth) / 2
          let l = n * w / 100
          const f = 1.6 - Math.ceil(n * 6 / 100) / 10
          let t = Math.ceil(n * 44 / 100)
          if (t > 44) t = 44
          if (l > w) l = w
          if (l < 0) l = 0
          if (t === 44 || t < 0) {
            this.lock = false
            clearInterval(this.time)
            return
          }
          this.t.style.transform = 'scale(' + f + ')'
          this.t.style.marginLeft = l + 'px'
          this.m.style.marginTop = -t + 'px'
          this.num = n
        }, 1)
      },
      addImg (v) {
        if (v.createDetail) cache.createDetail = v
        const menuName = getData('twoMenu')
        let name = ''
        let type = ''
        let params = ''
        for (let i = 0; i < menu.length; i++) {
          if (menu[i].type === cache.menuActive) {
            name = menu[i].name
            type = menu[i].type
            break
          }
        }
        cache.images.url = v.url

        if (type === 'menuRecent') {
          params = '最近'
        } else if (type === 'menuImage') {
          if (menuName === '身体') {
            params = 'body'
          } else if (menuName === '脸部') {
            params = 'face'
          }
        } else if (type === 'menuSticker') {
          params = 'paster'
        } else if (type === 'menuOther') {
          params = 'other'
        }
        cache.images.__path = params + '@/' + name + '/' + menuName + '/' + this.detail.templetName + '/' + cache.images.url
        this.$router.go(-1)
      },
      back (ev) {
        this.$emit('change', 0)
      }
    }
  }
</script>

<style>
  .images {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 100%;
    top: 0;
    width: 100%;
    background-color: #fff;
    transition-property: left;
    transition-duration: .4s;
    height: 100vh;
  }
  .images .four {
    flex: 1;
    height: auto;
    /*height: calc(100vh - 88px);*/
    /*transition: top .2s;*/
  }
  .images .min_h {
    min-height: calc(100vh - 140px);
  }
  .images .min_h .start { height: auto; }
  .images .four::-webkit-scrollbar { width: 0; }
  .images.active {
    left: 0;
  }
  .images .ant {
    transition: transform .1s;
    transform: scale(1.6);
    transform-origin: left center;
    display: inline-block;
    font-size: .14rem;
  }
  .images .mw {
    padding: 0 12px;
  }
  .images .four_top {
    top: 44px;
  }
</style>
