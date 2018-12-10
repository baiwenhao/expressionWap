<template>
  <div id="make" class="make" :class="{ 'make_dev' : header }">
    <div id="range" v-show="!buildImg">
      <div class="pd" style="text-align: center;height: 218px;">
        <img :src="bodyActiveSrc">
      </div>
      <div id="areaBox" class="area">
        <div style="font-size: 16px;" id="area" ref="area" contenteditable="true" @input="autoHeight('input')" @focus="autoHeight('focus')" @blur="autoHeight('blur')"></div>
      </div>
      <div class="range_box">
        <div class="prev">
          <img ref="prev" @click="change('prev')" :src="prev">
        </div>
        <div class="next">
          <img ref="next" @click="change('next')" :src="next">
        </div>
      </div>
      <div id="tips_animate" class="tips animate">
        <img :src="text">
      </div>
    </div>
    <div v-show="!buildImg" class="text_info flex">
      <div><img style="width: 15px;height: 11px;margin-right: 10px;" :src="p1" />字体大小</div>
      <div class="text_common_btn" :class="{ 'text_common_active': name === 'small' }" @click="change('small')">小</div>
      <div class="text_common_btn" :class="{ 'text_common_active': name === 'normal' }" @click="change('normal')">中</div>
      <div class="text_common_btn" :class="{ 'text_common_active': name === 'big' }" @click="change('big')">大</div>
    </div>
    <div v-show="!buildImg" class="img_info flex">
      <div><img style="width: 15px;height: 15px;margin-right: 10px;" :src="p2" />图片质量</div>
      <div class="text_common_btn" :class="{ 'text_common_active': pic === 'hd' }" @click="change('hd')">高清版</div>
      <div class="text_common_btn" :class="{ 'text_common_active': pic === 'blur' }" @click="change('blur')">模糊版</div>
    </div>
    <div id="view" style="display: none;">
      <div style="height: 23px;"></div>
      <div id="buildImg" class="pd"></div>
    </div>
    <div class="bg">
      <img class="btn" v-show="!buildImg" @click="build" :src="buildBtn">
      <div id="share_3" v-show="!pc && buildImg" style="display: flex;margin-bottom: 12px;padding-top: 15px;justify-content: center;">
        <i class="no">i</i><span>长按图片，保存至相册</span>
      </div>

      <div id="share_1" style="display: none;">
        <div style="display: flex;padding-top: 15px;justify-content: center;">
          <i class="no">i</i><span>长按图片，保存至相册</span>
        </div>
      </div>
      <div id="share_2" style="display: none;">
        <div style="display: flex;justify-content: center;">
          快转发到朋友圈收获点赞吧</span>
        </div>
      </div>
      <div v-show="buildImg">
        <div class="flex" style="margin-top: 24px;">
          <div class="bbb" v-show="pc" sytle="width: 48%;height: auto;" @click="again">
            <img style="height: auto;width: 100%;" :src="pc3">
          </div>
          <div class="bbbb" style="margin-right: 10px;" v-show="!pc" @click="again">
            <img :src="pc3">
          </div>
          <div class="bbbb" v-show="!pc" @click="build($event, 'share')">
            <img :src="pc4">
          </div>
          <div class="bbb" sytle="width: 48%;height: auto;" v-show="pc" @click="saveFile">
            <img style="height: auto;width: 100%;" :src="saves">
          </div>
        </div>
        <div v-show="pc" class="flex">
          <div class="bbb" @click="build($event, 'share')">
            <img :src="ff" style="height: auto;width: 100%;">
          </div>
        </div>
      </div>
    </div>
    <div v-show="!buildImg" class="title"><i class="ico"></i>牛人日记</div>
    <div v-show="!buildImg" id="waterfall" class="waterfall">
      <ul class="w1 water_items"></ul>
      <ul class="w2 water_items"></ul>
    </div>
    <div v-show="!buildImg" id="loadingText" class="loading_text">正在加载</div>
    <div v-if="pc" id="bottom" class="bottom" @click="getApp">
      <div class="_bottom">
        <div class="c1"><img :src="bar" /></div>
        <div class="c2"><img :src="logo" /></div>
      </div>
    </div>
    <div id="swiper-container" ref="swiper" class="swiper-container">
      <div class="swiper-wrapper" @click="hideSwiper">
        <div class="swiper-slide" v-for="v in list">
          <img :src="v">
        </div>
      </div>
    </div>
    <div id="shareGif">
      朋友圈暂不支持动图表情，我们已经为您生成图片表情
    </div>
    <div class="nav" v-show="header">
      <img @click="backEvent" class="back" :src="back">
      <div class="center">全名记仇</div>
    </div>
  </div>
</template>

<script>
  import back from '@assets/back.png'
  import logo from '@assets/logo.png'
  import bar from '@assets/bar.png'
  import { show, hide } from 'loading'
  import { save, setCanvas, postData, api, getDiary, data, imgBase64 } from '@common/canvas_edit'
  import html2canvas from 'html2canvas'
  import buildBtn from './build_btn.png'
  import p1 from './pic_1.png'
  import p2 from './pic_2.png'
  import prev from './prev.png'
  import next from './next.png'
  import edit from './tips.png'
  import pc3 from './pc_01.png'
  import pc4 from './pc_02.png'
  import saves from './save.png'
  import text from './text.png'
  import ff from './ff.png'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'

  const list = []
  let _id = ''
  const date = (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日，'
  export default {
    data () {
      return {
        header: false,
        list: [],
        page: 1,
        lock: 0,
        index: 0,
        name: 'normal',
        pic: 'hd',
        num: '',
        buildImg: 0,
        saves,
        text,
        back,
        body: [],
        bodyActive: {},
        bodyActiveSrc: '',
        pc: false,
        ff,
        p1,
        p2,
        pc3,
        pc4,
        buildBtn,
        bar,
        edit,
        logo,
        prev,
        next
      }
    },
    created () {
      this.pc = data.pc
      this.header = data.header
      this.getList()
    },
    mounted () {
      setTimeout(() => {
        const bottom = document.querySelector('#bottom')
        if (bottom) {
          const make = document.querySelector('#make')
          make.style.paddingBottom = bottom.offsetHeight + 'px'
        }
      }, 1000)
      document.title = '全民记仇'
      setCanvas((res, uuid) => {
        show()
        _id = uuid
        this.body = res
        this.bodyActive = this.body[this.index]
        this.bodyActiveSrc = this.bodyActive.highUrl
        const img = new Image()
        img.src = this.bodyActive.highUrl
        img.onload = () => {
          hide()
        }
        this.$refs.area.innerHTML = date + this.bodyActive.word
        this.setState()
      })
      this.$refs.area.addEventListener('focus', () => {
        document.querySelector('#tips_animate').style.display = 'none'
      })
    },
    methods: {
      backEvent () {
        if (this.buildImg === 1) {
          window.history.go(-1)
        } else {
          if (window.webkit && window.webkit.messageHandlers) {
            window.webkit.messageHandlers.jsHandler.postMessage('{"cmd":"close"}')
          } else {
            window.location.href = 'soqu://app/closeme'
          }
        }
      },
      hideSwiper () {
        const swiper = document.querySelector('#swiper-container')
        swiper.style.display = 'none'
      },
      change (t) {
        switch (t) {
          case 'small':
            this.name = 'small'
            this.$refs.area.style.fontSize = '12px'
            break
          case 'normal':
            this.name = 'normal'
            this.$refs.area.style.fontSize = '16px'
            break
          case 'big':
            this.name = 'big'
            this.$refs.area.style.fontSize = '20px'
            break
          case 'hd':
            this.pic = 'hd'
            this.bodyActiveSrc = this.bodyActive.highUrl
            break
          case 'blur':
            this.pic = 'blur'
            this.bodyActiveSrc = this.bodyActive.blurUrl
            break
          case 'next':
            if (this.body[this.index += 1]) {
              this.bodyActive = this.body[this.index]
              this.bodyActiveSrc = this.pic === 'hd' ? this.bodyActive.highUrl : this.bodyActive.blurUrl
              this.$refs.area.innerHTML = date + this.bodyActive.word
            }
            this.setState()
            break
          case 'prev':
            if (this.body[this.index -= 1]) {
              this.bodyActive = this.body[this.index]
              this.bodyActiveSrc = this.pic === 'hd' ? this.bodyActive.highUrl : this.bodyActive.blurUrl
              this.$refs.area.innerHTML = date + this.bodyActive.word
            }
            this.setState()
            break
        }
      },
      setState () {
        if (this.index === this.body.length - 1) {
          this.$refs.next.style.display = 'none'
        } else {
          this.$refs.next.style.display = 'block'
        }
        if (this.index === 0) {
          this.$refs.prev.style.display = 'none'
        } else {
          this.$refs.prev.style.display = 'block'
        }
        data.id = this.bodyActive.id
      },
      autoHeight (t) {
        const top = document.querySelector('#areaBox')
        const par = document.querySelector('#make')
        const s = document.body || document.documentElement
        if (!this.num) this.num = top.offsetHeight
        switch (t) {
          case 'input':
            par.classList.add('add_height')
            s.scrollTop = top.offsetHeight + 66
            break
          case 'focus':
            par.classList.add('add_height')
            s.scrollTop = top.offsetHeight + 66
            break
          case 'blur':
            par.classList.remove('add_height')
            s.scrollTop = 0
            break
        }
      },
      build (e, share) {
        show()
        if (share && share === 'share') {
          e.target.style.display = 'none'
          data.fd.append('moments', true)
          const url = data.fd.get('imgUrl')

          postData(api('build'), data.fd, (res) => {
            hide()
            res = res.data
            if (data.env) {
              if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.jsHandler) {
                show()
                imgBase64(res.url, 'anonymous').then((b64) => {
                  hide()
                  // const base64 = b64.replace('data:image/png;base64,', '')
                  const url = res.url.replace('http://memepic.51biaoqing.com/', '')
                  window.webkit.messageHandlers.jsHandler.postMessage('{ "cmd": "save", "map": { "imgName": "' + url + '", "isGif": "' + res.isGif + '", "aspectRatio": "' + (res.width / res.height).toFixed(2) + '" }}')
                })
              } else {
                alert(1)
                const href = 'soqu://app/h5-make?imgName=' + res.imgName + '&isGif=' + res.isGif + '&aspectRatio=' + (res.width / res.height).toFixed(2)
                window.location.href = href
              }
            } else {
              const img = new Image()
              img.src = res.url
              this.buildImg = 1
              img.onload = () => {
                const view = document.querySelector('#view')
                const build = document.querySelector('#buildImg')
                const make = document.querySelector('#make')
                view.style.display = 'block'
                build.innerHTML = ''
                build.appendChild(img)
                make.style.backgroundColor = '#fff'
                document.querySelector('#share_3').style.display = 'none'
                document.querySelector('#share_2').style.display = 'block'
                document.querySelector('#share_1').style.display = 'block'
                if (/\.(gif)$/.test(url)) {
                  document.querySelector('#shareGif').style.display = 'block'
                }
              }
            }
          })
        } else {
          html2canvas(document.querySelector('.area'), {
            // useCORS: true
          }).then((canvas) => {
            const src = canvas.toDataURL({
              format: 'image/png',
              multiplier: 1
            })

            data.fd = new FormData()
            data.fd.append('id', this.bodyActive.id)
            data.fd.append('word', document.querySelector('#area').innerHTML)
            data.fd.append('deviceToken', _id)
            data.fd.append('wordImg', src)
            data.fd.append('imgUrl', this.pic === 'hd' ? this.bodyActive.highUrl : this.bodyActive.blurUrl)
            data.fd.append('size', this.name === 'small' ? 1 : this.name === 'big' ? 3 : 2)
            data.fd.append('quality', this.pic === 'hd' ? 1 : 2)

            postData(api('build'), data.fd, (res) => {
              res = res.data
              if (data.env) {
                if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.jsHandler) {
                  show()
                  imgBase64(res.url, 'anonymous').then((b64) => {
                    hide()
                    const base64 = b64.replace('data:image/png;base64,', '')
                    const url = res.url.replace('http://memepic.51biaoqing.com/', '')
                    window.webkit.messageHandlers.jsHandler.postMessage('{ "cmd": "save", "map": { "base64": "' + base64 + '", "imgName": "' + url + '", "isGif": "' + res.isGif + '", "aspectRatio": "' + (res.width / res.height).toFixed(2) + '" }}')
                  })
                } else {
                  const href = 'soqu://app/h5-make?imgName=' + res.imgName + '&isGif=' + res.isGif + '&aspectRatio=' + (res.width / res.height).toFixed(2)
                  window.location.href = href
                }
              } else {
                hide()
                const img = new Image()
                img.src = res.url
                img.onload = () => {
                  const view = document.querySelector('#view')
                  const build = document.querySelector('#buildImg')
                  const make = document.querySelector('#make')
                  view.style.display = 'block'
                  build.innerHTML = ''
                  build.appendChild(img)
                  make.style.backgroundColor = '#fff'
                  this.buildImg = 1
                }
              }
            })
          })
        }
      },
      again () {
        window.location.reload()
      },
      saveFile () {
        save()
      },
      getApp () {
        window.location.assign('http://a.app.qq.com/o/simple.jsp?pkgname=com.soqu.client&ckey=CK1393939922486')
      },
      getList () {
        getDiary({
          page: this.page
        }, (res) => {
          res = res.data
          for (let i = 0; i < res.list.length; i++) {
            list.push(res.list[i].imageUrl)
          }
          this.list = list
          this.loadImg(res.list)
        })

        window.addEventListener('scroll', () => {
          const load = document.querySelector('#loadingText')
          const top = window.pageYOffset + window.innerHeight + 40

          if (top > document.body.offsetHeight && load && !this.lock) {
            this.page += 1
            this.lock = 1
            getDiary({
              page: this.page
            }, (res) => {
              res = res.data
              if (res.list.length) {
                for (let i = 0; i < res.list.length; i++) {
                  list.push(res.list[i].imageUrl)
                }
                this.loadImg(res.list)
              } else {
                load.innerHTML = '全部加载完成'
              }
            })
          }
        })
      },
      loadImg (arr) {
        const w = (document.querySelector('#make').offsetWidth - 12) / 2
        const water = document.querySelector('#waterfall')
        const ul = water.querySelectorAll('ul')
        const objs = []
        let obj = ''
        let loadIndex = 0
        for (let i = 0; i < arr.length; i++) {
          const img = new Image()
          img.index = i
          img.src = arr[i].imageUrl
          objs.push({ img })
          img.onload = () => {
            loadIndex += 1
            const isWeixin = () => {
              return /micromessenger/.test(navigator.userAgent.toLowerCase())
            }
            img.addEventListener('click', (e) => {
              if (isWeixin()) {
                wx.previewImage({
                  current: e.target.src,
                  urls: list
                })
              } else {
                const swiper = document.querySelector('#swiper-container')
                const index = list.indexOf(e.target.src)
                swiper.style.display = 'block'
                swiper.style.width = window.innerWidth + 'px'
                swiper.style.height = window.innerHeight + 'px'
                new Swiper('.swiper-container', {
                  initialSlide: index,
                  observer: true,
                  observeParents: true
                })
              }
            })

            if (loadIndex === arr.length - 1) {
              this.lock = 0
              for (let j = 0; j < objs.length; j++) {
                if (ul[0].offsetHeight > ul[1].offsetHeight) {
                  obj = ul[1]
                } else {
                  obj = ul[0]
                }
                const li = document.createElement('li')
                li.style.height = w * objs[j].img.height / objs[j].img.width
                li.appendChild(objs[j].img)
                obj.appendChild(li)
              }
            }
          }
        }
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
  .make.make_dev {
    padding-top: 50px;
  }
  .make .bottom img {
    width: 100%;
  }
  .make .box {
    position: relative;
  }
  .make .btn {
    height: 77px;
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
    padding-right: 12px;
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
    padding: 0 2em;
    display: flex;
    height: 44px;
    line-height: 44px;
    margin: 0 12px;
    font-size: 16px;
    border-radius: 24px;
    box-shadow: 0 2px 1px #01DACA;
    color: #fff;
    white-space: nowrap;
    background-color: #01DACA;
  }
  .make .bb2 {
    margin-top: 12px;
    padding: 0 2em;
    display: flex;
    height: 44px;
    line-height: 44px;
    margin: 0 12px;
    font-size: 16px;
    border-radius: 24px;
    box-shadow: 0 2px 1px #FF5675;
    color: #fff;
    white-space: nowrap;
    background-color: #FF5675;
  }
  .make .no {
    width: 16px;
    height: 16px;
    line-height: 16px;
    margin-right: 4px;
    text-align: center;
    overflow: hidden;
    border-radius: 12px;
    color: #fff;
    font-weight: 900;
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
    position: relative;
    margin: 0 43px;
  }
  #view img {
    width: 100%;
  }
  .add_height {
    min-height: 150vh;
  }
  #range {
    position: relative;
    margin: 0 43px;
    padding-top: 23px;
  }
  #range .pd img {
    max-height: 100%;
    max-width: 100%;
  }
  #range .range_box {
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    margin-top: -20px;
  }
  #range .range_box div {
    width: 40px;
    height: 40px;
  }
  #range .range_box img {
    width: 100%;
  }
  #range .range_box .prev {
    float: left;
    margin-left: -40px;
  }
  #range .range_box .next {
    float: right;
    margin-right: -40px;
  }
  #range .tips {
    position: absolute;
    left: 50%;
    bottom: -40px;
    margin-left: -80px;
  }
  #range .tips img {
    width: 162px;
    height: 49px;
  }
  .text_info {
    margin-top: 15px;
    margin-bottom: 10px;
    align-items: center;
  }
  .text_common_btn {
    flex: 1;
    height: 38px;
    line-height: 38px;
    margin-left: 10px;
    text-align: center;
    font-size: 14px;
    border-radius: 3px;
    border: 2px solid #fff;
    background-color: #fff;
  }
  .text_common_active {
    border-color: #01DACA;
  }
  .img_info {
    margin-bottom: 15px;
    align-items: center;
  }
  .bg {
    text-align: center;
    margin-top: 12px;
    padding: 0 15px;
    background-color: #fff;
  }
  .waterfall {
    overflow: hidden;
    /*display: flex;*/
    /*justify-content: center;*/
    /*align-items: end;*/
    position: relative;
    margin-bottom: 30px;
    background-color: #fff;
  }
  .w1 {
    float: left;
  }
  .w2 {
    float: right;
  }
  .water_items {
    max-width: 314px;
    width: calc((100vw - 12px) / 2);
    box-sizing: border-box;
  }
  .water_items li {
    overflow: hidden;
    width: 100%;
    margin-bottom: 10px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 3px;
  }
  .water_items img {
    width: 100%;
  }
  .make .title {
    height: 44px;
    line-height: 44px;
    padding: 0 15px;
    font-size: 16px;
    background-color: #fff;
  }
  .make .ico {
    width: 4px;
    height: 10px;
    background-color: #01DACA;
    float: left;
    margin-top: 16px;
    margin-left: 4px;
    margin-right: 6px;
  }
  .pd {
    padding: 12px;
    background: #fff;
  }
  #buildImg.pd {
    border: 1px solid #eee;
    border-radius: 3px;
  }
  .icon-chexiao {
    color: #fff;
    font-size: 18px;
    margin-right: 6px;
  }
  .view_num {
    position: fixed;
    left: 0;
    right: 0;
    text-align: center;
  }
  .view_num span {
    margin: 0 auto;
  }
  .loading_text {
    line-height: 40px;
    text-align: center;
  }
  .bbb img, .bbbb img {
    height: 100%;
  }
  .bbbb {
    height: 45px;
  }
  #make .swiper-container {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    display: none;
  }
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #000;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .swiper-slide img {
    max-width: 100%;
    max-height: 100%;
  }
  .animate {
    pointer-events: none;
    transform: scale(.9);
    animation: 1s scaleBtn infinite;
    transform-origin: center top;
    opacity: .8;
  }
  @keyframes scaleBtn {
    from，to { transform: scale(.8); }
    50% { transform: scale(1); }
  }
  #shareGif {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    line-height: 20px;
    text-align: center;
    display: none;
  }
  .nav {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 50px;
    max-width: 640px;
    font-size: 16px;
    font-weight: 900;
    color: #333;
    background-color: #fff;
    z-index: 2;
  }
  .nav .center {
    position: absolute;
    left: 50%;
    top: 0;
    line-height: 50px;
    transform: translateX(-50%);
  }
  .nav .back {
    float: left;
    width: 9px;
    padding-top: 17px;
    padding-left: 12px;
    padding-bottom: 16px;
    padding-right: 16px;
  }
</style>
