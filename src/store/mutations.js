import * as types from './mutations-types'

export default {
  [types.SETNAV] (state, obj) {
    state.navActive = obj
  },
  [types.HOTMAIN] (state, main) {
    state.hotMain = main
  },
  [types.SELECTED] (state, obj) {
    if (obj.name === 'levels') {
      state.levels = obj.status
    } else if (obj.name === 'flip') {
      state.flip = obj.status
    }
  }
}
