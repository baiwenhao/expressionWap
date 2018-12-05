<template>
  <div class="make">
    <div class="blur_animate" :class="{ 'blur': $route.name === 'search' }">
      <canvas-view />
      <div class="operating" :class="[navActive ? navActive.type : '']">
        <div @click="seeMore" class="flex" :class="[type ? 'more_text' : 'more_img']">
          <span class="iconfont" :class="[ type ? 'icon-tianjia' : 'icon-gengduo' ]"></span>
          <span class="tips">{{ type ? '添加文字' : '更多素材' }}</span>
        </div>
        <router-view ref="scroll" />
      </div>
      <nav-view v-on:change="tabHander" />
    </div>
    <search-word ref="search" />
  </div>
</template>

<script>
  import SearchWord from '@pages/SearchWord'
  import NavView from '../components/Nav'
  import CanvasView from '../components/Canvas'
  import { tabText } from '@common/util'
  import { cache } from '@api/data'
  import { mapGetters, mapActions } from 'vuex'
  import { addText, handlerEvent, stateUser } from '@common/canvas' // addImgs

  export default {
    data () {
      return {
        searchState: false
      }
    },
    computed: {
      ...mapGetters([
        'navActive'
      ]),
      type () {
        return this.navActive.type === 'text'
      }
    },
    components: {
      NavView,
      SearchWord,
      CanvasView
    },
    beforeRouteUpdate (to, from, next) {
    //   stateUser()
    //   if (this.navActive.type !== 'text') {
    //     tabText(this.navActive.name)
    //   } else {
    //     tabText()
    //   }
    //   if (to.name === 'text' && !cache.firstText) {
    //     addText({ text: '双击修改 空格换行' })
    //     cache.firstText = 1
    //   }
      if (to.name === 'search') {
        this.$refs.search.loadHot(() => {
          this.$refs.search.setShow(1)
        })
      } else {
        this.$refs.search.setShow(0)
      }
    //   document.querySelector('#scrollHot').scrollLeft = this.navActive.left || 0
      next()
    },
    mounted () {
      tabText(this.navActive.name)
    },
    methods: {
      ...mapActions(['search']),
      tabHander () {
        stateUser()
        if (this.navActive.type !== 'text') {
          tabText(this.navActive.name)
        } else {
          tabText()
        }
        if (this.navActive.type === 'text' && !cache.firstText) {
          addText({ text: '双击修改 空格换行' })
          cache.firstText = 1
        }
        // if (this.navActive.type === 'search') {
        //   this.$refs.search.loadHot(() => {
        //     this.$refs.search.setShow(1)
        //   })
        // } else {
        //   this.$refs.search.setShow(0)
        // }
        document.querySelector('#scrollHot').scrollLeft = this.navActive.left || 0
      },
      seeMore () {
        if (this.navActive.type !== 'text') {
          handlerEvent('copy', () => {
            this.$router.push({
              name: 'expression',
              query: {
                type: this.navActive.type
              }
            })
          })
        } else {
          this.search({ name: 'random' })
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
  .blur {
    filter: blur(4px);
  }
  .blur_animate {
    transition: filter .6s;
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
    padding: 1px;
  }
  .operating.head .cont_img {
    padding: 1px;
  }
  .operating.sticker .cont_img {
    padding: 1px;
  }
  .operating.text .cont_img {
    border-width: 1px;
  }
  .operating .cont .cont_active {
    padding: 0;
    border: 2px solid #31DFCC;
  }
  .operating .cont .cont_active img {
    transform: scale(1.12);
  }
</style>