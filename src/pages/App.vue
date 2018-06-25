<template>
  <div id="app">
    <router-view />
    <gui-view :show="first" :hide="setShow" />
  </div>
</template>

<script>
  import { getData, setData } from '@common/util'
  import GuiView from '@components/Gui'

  export default {
    data () {
      return {
        first: false
      }
    },
    created () {
      const first = getData('first')
      if (first !== '222') {
        this.first = 1
        setData('first', '222222')
      }
    },
    components: {
      GuiView
    },
    methods: {
      setShow (status) {
        this.first = status
      }
    }
  }
</script>