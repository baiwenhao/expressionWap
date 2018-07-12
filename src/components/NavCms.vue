<template>
  <nav>
    <div class="flex">
      <button v-for="v in nav" :class="{ 'active': active === v }" @click="pageTab($event, v)">
        <i class="iconfont" :class="v.icon"></i>
        <span>{{ v.name }}</span>
      </button>
    </div>
  </nav>
</template>

<script>
  import { nav } from '../api/data'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        nav
      }
    },
    computed: {
      ...mapGetters({
        active: 'navActive'
      })
    },
    methods: {
      ...mapActions(['setNav']),
      pageTab (e, v) {
        // const status = e.target.classList.contains('active')
        this.active.left = document.querySelector('#scrollHot').scrollLeft
        this.setNav(v)
        // this.$emit('change')
        // this.$router.push({ name: v.type })
      }
    }
  }
</script>

<style>
  nav {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  nav .flex {
    height: .5rem;
    text-align: center;
    box-shadow: 0 -2px 2px #ddd;
    background-color: #fff;
  }
  nav .iconfont {
    font-size: .2rem;
  }
  nav button {
    padding: 0 .22rem;
    color: #666;
    cursor: pointer;
  }
  nav span {
    font-size: .10rem;
    white-space: nowrap;
  }
  nav i {
    display: block;
    padding-top: 2px;
  }
  nav button.active {
    color: #31DFCC;
  }
  nav button.active .iconfont {
    color: #31DFCC;
  }
</style>
