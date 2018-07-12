<template>
  <div id="scrollHot" class="cont">
    <div v-if="navActive.type === 'text'">
      <div class="position position_top">
        <div class="flex">
          <div @click="setFamily($event, v, 'family')"
            v-for="v in fontList"
            :class="{'cont_active': family.FontFamily === v.FontFamily}"
            class="cont_text gray"
            :style="{ 'fontFamily': v.FontFamily }">字</div>
        </div>
      </div>
      <div class="position position_bottom">
        <div class="flex">
          <div @click="setFamily($event, v, 'color')" v-for="v in colorList" track-by="$index" :style="{ background: v }"  class="cont_text" :class="{ 'cont_active': color === v, 'gray': v === '#FFFFFF' }"></div>
        </div>
      </div>
    </div>
    <div class="flex" v-else>
      <div @click="addImg($event, v)" v-for="(v, i) in hotMain" class="cont_img" :class="{ 'cont_active': v.active }" :title="i + 1">
        <img v-lazy="v.previewUrl || v.url">
        <div class="view" v-if="v.createDetail"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { cache } from '@api/data'
  import { addImg, changeFamily, build } from '@common/canvas_cms'
  import { yzFont, colorList, iosFont, androidFont } from '@api/font'
  import { checkPlatform } from '../common/util'

  export default {
    data () {
      return {
        fontList: [],
        colorList,
        family: '',
        color: ''
      }
    },
    computed: {
      ...mapGetters(['navActive', 'hotMain'])
    },
    mounted () {
      if (!cache.fontList) {
        const dev = checkPlatform()
        const data = { Tags: [] }
        let font = ''

        if (dev === 'Android') {
          for (let i = 0; i < androidFont.length; i++) {
            androidFont[i].Tag = i
          }
          font = androidFont
        } else if (dev === 'IOS') {
          for (let i = 0; i < iosFont.length; i++) {
            iosFont[i].Tag = i
          }
          font = iosFont
        }
        for (let i = 0; i < yzFont.length; i++) {
          data.Tags.push({
            apikey: 'f1b2b0f7171d6c45e90a0d3b3363519a', // https://www.youziku.com/apiKey/index
            AccessKey: yzFont[i].key,
            Content: '字',
            Tag: i + (font.length - 1)
          })
        }
        $youzikuClient.getBatchFontFace(data, (res) => {
          const arr = res.FontfaceList
          let j = ''
          for (let z = 1; z < arr.length; z++) {
            const tmp = arr[z].Tag
            const obj = arr[z]
            for (j = z; j > 0 && arr[j - 1].Tag > tmp; j--) {
              arr[j] = arr[j - 1]
            }
            arr[j] = obj
          }
          font = font.concat(arr)
          this.setFontList(font)
        })
      } else {
        this.setFontList(cache.fontList)
      }
      cache.color = this.color = this.colorList[0]
    },
    methods: {
      ...mapActions(['setHotMain']),
      setFamily (e, v, f) {
        if (e.target.classList.contains('cont_active')) return
        switch (f) {
          case 'family':
            cache.family = v
            changeFamily()
            break
          case 'color':
            cache.color = v
            changeFamily('c')
            break
        }
        this[f] = v
      },
      addImg (e, v) {
        // const left = this.$el.scrollLeft
        // const activeLeft = e.target.offsetLeft
        const obj = this.hotMain.slice(0)
        for (let i = 0; i < obj.length; i++) {
          obj[i].active = obj[i] === v ? 1 : 0
        }
        this.setHotMain(obj)
        if (v.createDetail) {
          build()
        } else {
          let type = ''
          switch (this.navActive.type) {
            case 'body':
              type = 'body'
              break
            case 'head':
              type = 'face'
              break
            case 'sticker':
              type = 'paster'
              break
          }
          cache.images.__path = type + '@/' + v.url
          addImg(v.url)
        }
      },
      insertSort (arr) {
        let j = ''
        for (let i = 1; i < arr.length; i++) {
          const tmp = parseInt(arr[i].tag)
          const obj = arr[i]
          for (j = i; j > 0 && parseInt(arr[j - 1].tag) > tmp; j--) {
            arr[j] = arr[j - 1]
          }
          arr[j] = obj
        }
        return arr
      },
      setFontList (arr) {
        this.fontList = arr
        this.family = cache.family = this.fontList[0]
        if (!cache.fontList) cache.fontList = this.fontList
      }
    }
  }
</script>

<style>
  .cont {
    position: absolute;
    top: 24px;
    bottom: 24px;
    left: calc((100vw / 4) + 16px);
    right: 0;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .cont::-webkit-scrollbar { height: 0; }
  .cont .flex {
    flex-wrap: nowrap;
    justify-content: inherit;
  }
  .cont .cont_img {
    position: relative;
    overflow: hidden;
    flex: 0 0 calc((100vw / 4) - 10px);
    height: calc((100vw / 4) - 10px);
    line-height: calc((100vw / 4) - 10px);
    margin-right: 10px;
    text-align: center;
    box-sizing: border-box;
    border-radius: 5px;
  }
  .cont .view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(000, 000, 000, .5);
  }
  .cont .view:after {
    color: #fff;
    content: '完成';
  }
  .cont .cont_img img {
    max-width: calc((100vw / 4) - 14px);
    max-height: calc((100vw / 4) - 10px);
    vertical-align: middle;
  }
  .cont .position {
    position: absolute;
    left: 0;
    right: 0;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .cont .position_top {
    top: 0;
  }
  .cont .position_bottom {
    bottom: 0;
  }
  .cont .cont_text {
    flex: 0 0 calc(20% - 14px);
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc((100vw / 8) - 8px);
    box-sizing: border-box;
    /*border: 1px solid #DFDFDF;*/
    border: 1px solid #fff;
    margin-right: 8px;
    border-radius: 3px;
    font-size: .24rem;
  }
  .cont .cont_text:first-child {
    font-weight: 900;
  }
  .cont .gray {
    flex: 0 0 calc(20% - 15px);
    height: calc((100vw / 8) - 9px);
    border-color: #DFDFDF;
  }
  #scrollHot .cont_img:after {
    pointer-events: none;
    content: attr(title);
    position: absolute;
    right: 0;
    left: 0;
    bottom: -36px;
    text-align: center;
  }
</style>