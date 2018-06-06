export const _canvas = {
  allowTouchScrolling: !0,
  // backgroundColor: '#F2F2F2',
  selection: !0,
  isDrawingMode: !1,
  preserveObjectStacking: !0
}

export const _rect = {
  hasControls: !1,
  selectable: !1,
  transparentCorners: !1,
  hoverCursor: 'default',
  fill: '#fff'
}

export const _control = {
  cornerShape: 'circle',
  // cornerStyle: 'circle',
  borderDashArray: [10, 4],
  cornerSize: parseFloat(43),
  // cornerColor: 'green',
  // borderColor: '#04DFD0',
  // cornerStrokeColor: '#000',
  // cornerBackgroundColor: 'rgba(46, 230, 217, .6)',
  transparentCorners: 0,
  padding: 0,
  // rotatingPointOffset: 0,
  _controlsVisibility: {
    tl: 0,
    tr: 1,
    br: 1,
    bl: 1,
    ml: 0,
    mt: 0,
    mr: 0,
    mb: 0,
    mtr: 0
  }
}

import up from '../assets/up.svg'
import remove from '../assets/del.svg'
import rotate from '../assets/rotate2.svg'
import resize from '../assets/resizes.svg'
import down from '../assets/down.svg'
import acute from '../assets/acute.svg'
import repair from '../assets/repair-tools-cross.svg'

export const Icons = {
  settings: {
    borderColor: '#01DFD0'
  //   cornerSize: 25,
  //   cornerShape: 'rect',
  //   cornerBackgroundColor: 'black',
  //   cornerPadding: 10
  },
  tl: {
    icon: up
  },
  tr: {
    icon: remove
    // settings: {
      // cornerBackgroundColor: 'rgba(000, 000, 000, .5)'
    // }
  },
  bl: {
    icon: rotate
  },
  br: {
    icon: resize
  },
  mb: {
    icon: down
  },
  mt: {
    icon: acute
  },
  mr: {
    icon: repair
  }
}

export const Controls = {
  tl: {
    action: 'moveUp',
    cursor: 'pointer'
  },
  tr: {
    action: 'remove',
    cursor: 'pointer'
  },
  bl: {
    action: 'rotate',
    cursor: 'pointer'
  },
  br: {
    action: 'scale',
    cursor: 'pointer'
  },
  mb: {
    action: 'moveDown',
    cursor: 'pointer'
  },
  mr: {
    action: (e, target) => {
      target.set({
        left: 200
      })
      c.renderAll()
    },
    // strokeDashArray: [5, 5],
    // stroke: 'black',
    cursor: 'pointer'
  },
  mt: {
    action: {
      'rotateByDegrees': 30
    },
    cursor: 'pointer'
  }
}
