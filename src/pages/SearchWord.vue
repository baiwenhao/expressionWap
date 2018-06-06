<template>
  <div class="search" :class="{ 'active': show }">
    <view-title :back="done" :done="done" :text="'配字'" :done-text="'完成'" />
    <div class="area mb pd">
      <i @click="close" class="iconfont close">&times;</i>
      <input id="searchInput" maxlength="40" @input="input" :disabled="!show" ref="text" class="text" placeholder="请输入" type="text" name="name" />
    </div>
    <div class="start more_menu" v-show="!lock">
      <div class="flex" style="font-size: .15rem;">
        <span @click="setActive(v)" v-for="v in list" :class="{'active': listActive === v}">{{ v }}</span>
      </div>
    </div>
    <div v-show="!lock" ref="result" class="result">
      <div class="pd"style="font-size: .14rem;">
        <div @click="doneList($event, v)" class="pd list_text" v-for="v in searchList">{{ v }}</div>
        <div v-if="searchList.length === 0" class="f16" style="text-align: center;margin-top: 15%;">暂无数据</div>
      </div>
    </div>
    <div v-show="lock" class="result" style="top: 94px; height: calc(100vh - 94px);">
      <div @click="doneList($event, v)" class="pd list_text" v-for="v in result">{{ v }}</div>
      <div v-if="result.length === 0" class="f16" style="text-align: center;margin-top: 15%;">暂无数据</div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import ViewTitle from '@components/Title'
  import { delay } from '@common/util'
  import { addText } from '@common/canvas'

  const data = {
    hot: '热门',
    zn: 20,
    en: 40,
    page: {}
  }

  export default {
    data () {
      return {
        show: 0,
        lock: 0,
        scrollLock: 0,
        list: [],
        listActive: '',
        result: [],
        searchList: []
      }
    },
    components: {
      ViewTitle
    },
    mounted () {
      this.$refs.result.addEventListener('scroll', this.loadMain)
    },
    methods: {
      ...mapActions(['search']),
      setShow (status) {
        this.show = status
      },
      loadMain (e) {
        const t = e.target
        if (t.scrollTop + 20 + t.offsetHeight >= t.scrollHeight && !this.scrollLock && this.listActive) {
          this.scrollLock = 1
          if (this.listActive === data.hot && data.page[data.hot] !== 'end') {
            data.page[data.hot] += 1
            this.moreHot()
          } else if (data.page[this.listActive] !== 'end') {
            data.page[this.listActive] += 1
            this.moreTag()
          }
        }
      },
      moreTag () {
        this.search({
          tag: this.listActive,
          name: 'list',
          page: data.page[this.listActive],
          cb: (res) => {
            if (res && res.length) {
              this.searchList = []
              if (data[this.listActive]) {
                data[this.listActive] = data[this.listActive].concat(res)
                this.searchList = data[this.listActive]
              } else {
                this.searchList = res
                data[this.listActive] = res
              }
              this.scrollLock = 0
            } else {
              data.page[this.listActive] = 'end'
            }
          }
        })
      },
      moreHot (cb) {
        this.search({
          name: 'hot',
          page: data.page[data.hot],
          cb: (res) => {
            if (res && res.length) {
              this.searchList = []
              if (data[data.hot]) {
                data[data.hot] = data[data.hot].concat(res)
                this.searchList = data[data.hot]
              } else {
                this.searchList = res
                data[data.hot] = res
              }
              this.scrollLock = 0
            } else {
              data.page[data.hot] = 'end'
            }
            cb && cb()
          }
        })
      },
      setActive (v, cb) {
        this.lock = 0
        this.listActive = v
        if (data[v]) {
          this.searchList = data[v]
        } else {
          if (v === data.hot) {
            this.moreHot(cb)
          } else {
            this.moreTag()
          }
        }
      },
      loadHot (cb) {
        if (data.list) {
          this.list = data.list
          this.listActive = data.listActive
          cb && cb()
        } else {
          this.search({
            name: 'label',
            cb: (res) => {
              if (res.data && res.data.length) {
                res.data.unshift('热门')
                data.list = res.data
                data.listActive = data.list[0]
                this.list = data.list
                this.listActive = data.listActive
              }
              for (let i = 0; i < this.list.length; i++) {
                data.page[this.list[i]] = 1
              }
              this.setActive(this.listActive, cb)
            }
          })
        }
      },
      input (e) {
        const v = e.target.value
        if (!v) return
        if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(v)) {
          this.lock = 1
          this.result = []
          return
        }
        const en = v.replace(/[^a-zA-Z0-9]/gi, '')
        const zn = v.replace(/[^\u4e00-\u9fa5]/gi, '')
        if (zn.length * 2 > data.zn) {
          e.target.value = v.slice(0, data.zn)
          return
        }
        if (en.length > data.en) {
          e.target.value = v.slice(0, data.en)
          return
        }
        if (en.length + zn.length * 2 >= data.en) {
          e.target.value = v.slice(0, data.en)
          return
        }
        this.lock = v ? 1 : 0
        delay(() => {
          this.search({
            name: 'msg',
            word: v,
            cb: (res) => {
              this.result = res
            }
          })
        }, 400)
      },
      doneList (e, text) {
        this.$refs.text.value = text
        addText({ text })
        delay(() => {
          this.$router.go(-1)
          this.$refs.text.value = ''
        }, 300)
      },
      close () {
        this.$refs.text.value = ''
        this.$refs.text.focus()
        this.lock = 0
        this.result.length = 0
      },
      done (e, state) {
        switch (state) {
          case 'done':
            const val = this.$refs.text.value.replace(/\s/g, '')
            if (val) addText({ text: this.$refs.text.value })
            break
        }
        delay(() => {
          this.$router.go(-1)
          this.$refs.text.value = ''
        }, 300)
      }
    }
  }
</script>

<style>
  .search {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 100vw;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    background-color: rgba(000, 000, 000, .8);
    color: #fff;
    z-index: 2;
    transition-property: left, background;
    transition-duration: .2s, .6s;
  }
  .search.active {
    left: 0;
    background-color: rgba(000, 000, 000, .8);
  }
  .search .area {
    position: relative;
  }
  .search .close {
    position: absolute;
    right: 24px;
    top: 6px;
    width: 26px;
    height: 26px;
    line-height: 22px;
    vertical-align: top;
    text-align: center;
    border-radius: 50px;
    font-size: 20px;
    background-color: #fff;
    color: #666;
  }
  .search .more_menu {
    width: 100vw;
    overflow-x: auto;
    background-color: rgba(000, 000, 000, .3);
  }
  .search .more_menu .f14 {
    box-sizing: border-box;
    padding-left: 6px;
  }
  .search .more_menu span {
    white-space: nowrap;
    padding:0 10px;
  }
  .search .more_menu span.active {
    position: relative;
    color: #31DFCC;
  }
  .search .more_menu span.active:after {
    position: absolute;
    left: 50%;
    bottom: 6px;
    width: 14px;
    height: 2px;
    margin-left: -7px;
    background-color: #31DFCC;
    content: '';
  }
  .search .more_menu .flex {
    justify-content: flex-start;
  }
  .search .text {
    width: 100%;
    height: 40px;
    line-height: 20px;
    padding: 10px;
    padding-right: 42px;
    border-radius: 5px;
    box-sizing: border-box;
    color: #fff;
    font-size: .14rem;
    background-color: #626262;
  }
  ::-webkit-input-placeholder {
    color: #fff;
  }
  .search .list_text {
    padding: 18px 12px;
    line-height: 18px;
    font-size: .14rem;
    word-break: break-all;
    border-bottom: 1px solid #4A4A4A;
  }
  .search .list_text:last-child {
    border-bottom: none;
  }
  .search .result {
    width: 100%;
    height: calc(100vh - 138px);
    position: absolute;
    top: 138px;
    left: 0;
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .search .title_view .iconfont {
    color: #fff;
  }
  .search .title_view .blue {
    color: #31DFCC;
  }
  .search .ripple { background-color: rgba(255, 255, 255, .5); }
</style>
