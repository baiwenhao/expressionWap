<template>
  <div class="search" :class="{'active': stateSearch}">
    <view-title :back="done" :done="done" :text="'配字'" :done-text="'完成'" />
    <div class="area mb pd">
      <i @click="close" class="iconfont close">&times;</i>
      <input id="searchInput" maxlength="40" @input="input" :disabled="!stateSearch" ref="text" class="text" placeholder="请输入" type="text" name="name" />
    </div>
    <div class="start more_menu" v-show="!lock">
      <div class="flex" style="font-size: .15rem;">
        <span @click="setActive(v)" v-for="v in list" :class="{'active': listActive === v}">{{ v }}</span>
      </div>
    </div>
    <div v-show="!lock" class="result">
      <div class="pd"style="font-size: .14rem;">
        <div @click="doneList(v)" class="pd list_text" v-for="v in search">{{ v }}</div>
        <div v-if="search.length === 0" class="f16" style="text-align: center;margin-top: 15%;">暂无数据</div>
      </div>
    </div>
    <div v-show="lock" class="result" style="top: 84px;">
      <div @click="doneList(v)" class="pd list_text" v-for="v in result">{{ v }}</div>
      <div v-if="result.length === 0" class="f16" style="text-align: center;margin-top: 15%;">暂无数据</div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import ViewTitle from '@components/Title'
  import { delay } from '@common/util'
  import { hot } from '@api/data'
  import { modifyText } from '@common/canvas_cms'
  import Ripple from 'ripple'

  const data = {
    zn: 20,
    en: 40
  }

  export default {
    data () {
      return {
        lock: false,
        list: [],
        listActive: '',
        result: [],
        search: []
      }
    },
    components: {
      ViewTitle
    },
    computed: {
      ...mapGetters(['stateSearch'])
    },
    created () {
      this.loadHot()
    },
    methods: {
      ...mapActions(['searchStatus', 'searchTag', 'searchVal', 'searchHot', 'searchLabel']),
      setActive (v) {
        this.lock = false
        this.listActive = v
        if (data[v]) {
          this.search = data[v]
        } else {
          if (v === '热门') {
            this.searchHot((res) => {
              this.search = res
              data[v] = res
            })
          } else {
            this.searchTag({
              tag: v,
              cb: (res) => {
                this.search = res
                data[v] = res
              }
            })
          }
        }
      },
      loadHot () {
        this.searchLabel((res) => {
          if (res.data && res.data.length >= 1) {
            res.data.unshift('热门')
            this.list = res.data
            this.listActive = res.data[0]
          } else {
            this.list = hot
            this.listActive = hot[0]
          }
          this.setActive(this.listActive)
        })
      },
      input (e) {
        const v = e.target.value.replace(/\s/g, '')
        if (!v) return
        if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(v)) {
          this.lock = true
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
          this.searchVal({
            word: v,
            cb: (res) => {
              this.result = res
            }
          })
        }, 400)
      },
      doneList (v) {
        this.$refs.text.value = v
        modifyText(v)
        delay(() => {
          this.searchStatus({
            status: false,
            input: this.$refs.text
          })
        }, 300)
      },
      close () {
        this.$refs.text.value = ''
        this.$refs.text.focus()
        this.lock = false
        this.result.length = 0
      },
      done (ev, state) {
        Ripple(ev)
        switch (state) {
          case 'done':
            const val = this.$refs.text.value.replace(/\s/g, '')
            if (val) modifyText(this.$refs.text.value)
            break
        }
        delay(() => {
          this.searchStatus({
            status: false,
            input: this.$refs.text
          })
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
    position: absolute;
    top: 140px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .search .title_view .iconfont {
    color: #fff;
  }
  .search .title_view .blue {
    color: #31DFCC;
  }
</style>
