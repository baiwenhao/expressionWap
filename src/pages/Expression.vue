<template>
  <div class="material">
    <view-title :back="goBack" :text="'素材库'" />
    <div class="menu flex">
      <div @click="setMenu(v)" v-for="v in menu" v-show="v.code" :class="{ 'active': v.active }">{{ v.name }}</div>
    </div>
    <div class="list_item" :class="[menuType === 'menuRecent' ? 'four' : 'three']">
      <div v-if="menuType === 'menuRecent'" class="flex" style="padding: 8px 18px">
        <div class="nodata" v-if="!main.length">暂无数据</div>
        <div class="item" v-for="v in main" @click="addImg(v)">
          <img v-lazy="v.url" />
        </div>
      </div>
      <div class="flex" v-else>
        <div class="mr">
          <div @click="setList(v)" v-for="v in subList" :class="{ 'active': !!v.active }" class="submenu">{{ v.categoryName }}</div>
        </div>
        <div class="f1 scroll">
          <div class="min_four">
            <div class="flex" style="margin-top: 10px;">
              <div class="nodata" v-if="!lock">暂无数据</div>
              <div @click="loadMain(v)" class="item item_r" v-for="v in main">
                <div class="bg"></div>
                <div class="box">
                  <img v-lazy="v.cover" />
                </div>
                <div class="viewtext">{{ v.templetName }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <images ref="imgs" :status="detailStatus" :detail="detail" :list="detailList" v-on:change="changeDetailStatus" v-on:load="loadDetail" />
  </div>
</template>

<script>
  import { menu, list, main, cache, nav } from '../api/data'
  import { setData, getCode, getData } from '@common/util'
  import { axios } from '@api/api'
  import Images from '../components/Images'
  import ViewTitle from '@components/Title'

  export default {
    data () {
      return {
        lock: 1,
        detail: {},
        detailList: [],
        detailStatus: 0,
        lockDetail: 0,
        menu,
        menuType: cache.menuActive, // string
        subList: [],
        main: ''
      }
    },
    components: {
      Images,
      ViewTitle
    },
    created () {
      this.loadMenu()
    },
    methods: {
      changeDetailStatus (status) {
        this.detailStatus = status
      },
      goBack () {
        this.$router.go(-1)
      },
      setMenu (v) {
        if (v.type === 'menuSticker') {
          setData('menuActive', 'sticker')
        } else if (v.type === 'menuImage') {
          setData('menuActive', 'body')
        }
        for (let i = 0; i < this.menu.length; i++) this.menu[i].active = 0
        v.active = 1
        this.menuType = v.type
        cache.menuActive = v.type
        if (v.type === 'menuRecent') {
          const d = getData('RecentImg')
          this.main = d.slice(0, 60)
        } else {
          setData('expression_menu', v.type)
          this.loadMenu()
        }
      },
      setList (v) {
        setData('twoMenu', v.categoryName)
        if (cache.menuActive === 'menuImage') {
          if (v.categoryName === '脸部') {
            setData('menuActive', 'head')
          } else if (v.categoryName === '身体') {
            setData('menuActive', 'body')
          }
        }
        this.subList = []
        const data = list[this.menuType]
        for (let i = 0; i < data.length; i++) {
          if (data[i] === v) {
            data[i].active = !0
            this.loadList(data[i].id)
          } else {
            data[i].active = !1
          }
        }
        this.subList = data
      },
      loadMenu () {
        this.size = Math.floor((window.innerHeight - 138) / Math.floor((window.innerWidth - 96) / 4)) * 4 + 1
        let id = ''
        let name = ''
        const navType = this.$route.query.type
        if (this.menuType === 'menuImage') {
          setData('menuActive', navType)
        } else if (this.menuType === 'menuSticker') {
          setData('menuActive', 'sticker')
        }
        const ll = list[this.menuType]
        for (let j = 0; j < nav.length; j++) {
          if (nav[j].type === navType) {
            name = nav[j].name
            break
          }
        }
        setData('twoMenu', name)
        if (ll && ll.length) {
          for (let i = 0; i < ll.length; i++) {
            if (ll[i].categoryName === name) {
              ll[i].active = 1
              id = ll[i].id
            } else {
              ll[i].active = 0
            }
          }
          if (!id) {
            ll[0].active = 1
            id = ll[0].id
          }
          this.subList = ll
          this.loadList(id)
        } else {
          const type = getCode(this.menu, this.menuType)
          if (type) {
            axios('menu', 'get', { type }).then((res) => {
              if (res.status && res.data) {
                for (let i = 0; i < res.data.length; i++) {
                  if (res.data[i].categoryName === name) {
                    res.data[i].active = 1
                    id = res.data[i].id
                    break
                  }
                }
                if (!id) {
                  res.data[0].active = 1
                  id = res.data[0].id
                }
                this.subList = res.data
                setData('twoMenu', this.subList[0].categoryName)
                list[this.menuType] = res.data
                this.loadList(id)
              }
            })
          }
        }
      },
      loadList (categoryId) {
        this.main = main[categoryId]
        if (!this.main) {
          axios('post', 'get', { categoryId }).then((res) => {
            if (res.status) {
              if (res.data.length) {
                if (location.protocol === 'https:') {
                  for (let i = 0; i < res.data.length; i++) {
                    res.data[i].cover = res.data[i].cover.replace(cache.http, cache.https)
                  }
                } else if (location.protocol === 'http:' && location.host === 'maketest.51biaoqing.com') {
                  for (let i = 0; i < res.data.length; i++) {
                    res.data[i].cover = res.data[i].cover.replace(cache.http, cache.test)
                  }
                }
              } else {
                res.data = []
              }
              this.main = res.data
              main[categoryId] = res.data
            }
            if (this.main.length === 0) {
              this.lock = 0
            }
          })
        }
      },
      loadMain (v) {
        this.detail = v
        const id = v.categoryCode
        cache.categoryCode = id
        const d = cache[id]
        if (d) {
          this.detailList = d
          this.changeDetailStatus(1)
        } else {
          this.detail._page = 0
          cache[id] = this.detailList = []
          this.loadDetail()
        }
      },
      loadDetail () {
        const params = {
          page: this.detail._page += 1,
          pageSize: this.size,
          categoryCode: this.detail.categoryCode
        }
        this.detail._loading = 1
        if (this.detail.templetName === '热门') params.pageSize = 32
        axios('img', 'get', params).then((res) => {
          if (res.data.length) {
            if (location.protocol === 'https:') {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].url = res.data[i].url.replace(cache.http, cache.https)
              }
            } else if (location.protocol === 'http:' && location.host === 'maketest.51biaoqing.com') {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].url = res.data[i].url.replace(cache.http, cache.test)
              }
            }
            cache[this.detail.categoryCode] = cache[this.detail.categoryCode].concat(res.data)
            this.detailList = cache[this.detail.categoryCode]
            this.changeDetailStatus(1)
            if (res.data.length < this.size) {
              this.detail._end = 1
            } else {
              this.detail._end = 0
            }
          } else {
            this.detail._end = 1
          }
          this.detail._loading = 0
        })
      },
      addImg (v) {
        cache.createDetail = v.createDetail ? cache.createDetail : ''
        cache.images.url = v.url
        cache.images.__path = v.path + '@/' + v.url
        this.$router.go(-1)
      }
    }
  }
</script>

<style>
  .material {
    height: 100vh;
    color: #333;
    overflow: hidden;
    font-weight: 900;
  }
  .material .menu {
    height: 44px;
    line-height: 44px;
    text-align: center;
    background-color: #F7F7F8;
    font-size: .12rem;
  }
  .material .menu div {
    flex: 1;
  }
  .material .menu div.active {
    position: relative;
    color: #31DFCC;
  }
  .material .menu div.active:after {
    position: absolute;
    left: 50%;
    bottom: 5px;
    width: 16px;
    height: 2px;
    border-radius: 3px;
    background-color: #31DFCC;
    transform: translate(-50%, -50%);
    content: '';
  }
  /*.list_item {
    min-height: calc(100% - 88px);
  }*/
  .list_item .flex {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .list_item .item {
    position: relative;
    width: calc((100vw - 100px) / 4);
    height: calc((100vw - 100px) / 4);
    line-height: calc((100vw - 100px) / 4);
    text-align: center;
    margin-bottom: 10px;
    margin-right: 20px;
    box-sizing: border-box;
    transform-style: preserve-3d;
    perspective: 1200px;
  }
  .list_item .item img {
    max-width: calc((100vw - 100px) / 4);
    max-height: calc((100vw - 100px) / 4);
    vertical-align: middle;
  }
  .list_item .box {
    width: calc((100vw - 100px) / 4);
    height: calc((100vw - 100px) / 4);
    margin-top: -8px;
    border: 1px solid #f0f0f0;
    border-radius: 5px;
    box-shadow: 0 0 6px #eee;
    box-sizing: border-box;
    transform: scaleZ(6) rotateX(-22deg);
    background-color: #fff;
  }
  .list_item .box img {
    max-width: calc((100vw - 100px) / 4 - 10px);
    max-height: calc((100vw - 100px) / 4 - 10px);
  }
  .list_item .bg {
    width: calc((100vw - 100px) / 4 - 14px);
    height: 14px;
    margin: 0 auto;
    border: 1px solid #f0f0f0;
    border-radius: 5px;
    box-shadow: 0 0 6px #eee;
    /*transform: scaleZ(10) rotateX(-90deg);*/
  }
  .list_item .item_r {
    height: calc((100vw - 50px) / 4 + 30px);
  }
  .four {
    height: calc(100% - 88px);
    overflow-y: auto;
    overflow-x: hidden;
  }
  .four .item:nth-child(4n) {
    margin-right: 0;
  }
  .three:nth-child(3n) {
    margin-right: 0;
  }
  .list_item .mr {
    width: calc((100vw - 16px) / 4);
    margin-right: 8px;
    text-align: center;
    background-color: #F2F2F2;
    font-size: .12rem;
  }
  .list_item .mr .submenu {
    height: 44px;
    line-height: 44px;
  }
  .list_item .mr .submenu.active {
    position: relative;
    background-color: #fff;
    font-size: .14rem;
  }
  .list_item .mr .submenu.active:after {
    position: absolute;
    left: 0;
    top: 50%;
    width: 2px;
    height: 16px;
    margin-top: -8px;
    background-color: #31DFCC;
    content: '';
  }
/*  .list_item img {
    width: 100%;
    vertical-align: middle;
  }*/
  .list_item .viewtext {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    pointer-events: none;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    text-align: center;
    color: #999;
    background-color: #fff;
    font-size: .10rem;
  }
  .list_item .scroll {
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100vh - 88px);
  }
  .list_item .min_four { min-height: calc(100vh - 150px);padding-left: 10px; }
  .list_item .scroll::-webkit-scrollbar { width: 0; }
  .material ._copyright {
    font-weight: 400;
  }
/*  .material .item_active {
    border: 2px solid #31DFCC;
  }*/
</style>
