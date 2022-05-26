const colorArrays = [
  {
    svgBg: '#eeeef3',
    rootRectFill: '#5856d5',
    rootFoDivFontColor: '#fff',
    pathStroke: '#5856d5',
    subRootRectFill: '#0CAFFF',
    subRootFoDivFontColor: '#fdfafa',
    leafRectFill: 'transparent',
    leafFoDivFontColor: '#4B4B4B'
  },
  {
    svgBg: '#2C2C2F',
    rootRectFill: '#5856D5',
    rootFoDivFontColor: '#FFF',
    pathStroke: '#5856d5',
    subRootRectFill: '#49494E',
    subRootFoDivFontColor: '#FFF',
    leafRectFill: 'transparent',
    leafFoDivFontColor: '#FFF'
  },
  {
    svgBg: '#FFF',
    rootRectFill: '#597391',
    rootFoDivFontColor: '#FFF',
    pathStroke: '#A0BAD2',
    subRootRectFill: '#FDF2F2',
    subRootFoDivFontColor: '#848289',
    leafRectFill: 'transparent',
    leafFoDivFontColor: '#848289'
  },
  {
    svgBg: '#DFDFDF',
    rootRectFill: '#A53626',
    rootFoDivFontColor: '#FFF',
    pathStroke: '#383833',
    subRootRectFill: '#383833',
    subRootFoDivFontColor: '#FFF',
    leafRectFill: 'transparent',
    leafFoDivFontColor: '#57575B'
  }
]

export function getStyleList () {
  return colorArrays.map(style => Object.values(style))
}

export function getStyle (styleName = 0) {
  const colors = colorArrays[styleName]
  return {
    svgStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.svgBg
    },
    pathStyle: {
      stroke: colors.pathStroke,
      fill: 'none',
      strokeWidth: '1.5px'
    },
    imageStyle: {
      display: 'none'
    },
    rectStyle: node => {
      let style
      switch (node.depth) {
        case 0:
          style = { fill: colors.rootRectFill }
          break
        case 1:
          style = { fill: colors.subRootRectFill }
          break
        default:
          style = { fill: colors.leafRectFill, strokeWidth: '1.5px' }
      }
      return style
    },
    foDivStyle: node => {
      const _fontSize = node.depth === 0 ? 16 : 14
      const _lineHeight = _fontSize + 2
      let style = {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: 'fit-content',
        wordBreak: 'normal',
        textJustify: 'distribute-all-lines',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        overflow: 'hidden',
        fontSize: `${_fontSize}px`,
        lineHeight: `${_lineHeight}px`
      }
      switch (node.depth) {
        case 0:
          style = { ...style, color: colors.rootFoDivFontColor, fontSize: '16px', lineHeight: '16px' }
          break
        case 1:
          style = { ...style, color: colors.subRootFoDivFontColor }
          break
        default:
          style = { ...style, color: colors.leafFoDivFontColor }
      }
      return style
    }
  }
}
export const markerList = [
  {
    category: '颜色',
    imgs: [
      'https://cdn.kimjisoo.cn/pic/svgicons/tag-red.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/tag-orange.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/tag-yellows.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/tag-green.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/tag-blue.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/tag-dark-purple.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/tag-grey.svg'
    ]
  },
  {
    category: '优先级',
    imgs: [
      'https://cdn.kimjisoo.cn/pic/svgicons/priority-1.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/priority-2.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/priority-3.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/priority-4.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/priority-5.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/priority-6.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/priority-7.svg'
    ]
  },
  {
    category: '任务',
    imgs: [
      'https://cdn.kimjisoo.cn/pic/svgicons/task-start.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/task-oct.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/task-3oct.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/task-half.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/task-5oct.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/task-7oct.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/task-done.svg'
    ]
  },
  {
    category: '标记',
    imgs: [
      'https://cdn.kimjisoo.cn/pic/svgicons/flag-red.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/flag-orange.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/flag-yellow.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/flag-green.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/flag-blue.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/flag-purple.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/flag-gray.svg'
    ]
  },
  {
    category: '符号',
    imgs: [
      'https://cdn.kimjisoo.cn/pic/svgicons/c_symbol_heart.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/c_symbol_like.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/c_symbol_dislike.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/c_symbol_heart.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/symbol-pin.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/symbol-idea.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/symbol-lightning.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/c_symbol_telephone.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/c_symbol_pen.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/symbol-run.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/symbol-exclam.svg',
      'https://cdn.kimjisoo.cn/pic/svgicons/symbol-question.svg'
    ]
  }
]

export const mapList = [
  {
    name: 'Logic Tree',
    id: 'MAPID-LogicTree',
    imgUrl: 'https://cdn.kimjisoo.cn/pic/svgicons/logic-tree.svg'
  },
  {
    name: 'Tree Table',
    id: 'MAPID-TreeTable',
    imgUrl: 'https://cdn.kimjisoo.cn/pic/svgicons/tree-table.svg'
  }
]

export const colorList = [
  {
    id: 'COLOR-Energy-2',
    imgUrl: 'https://cdn.kimjisoo.cn/pic/svgicons/colors/energy-2.svg',
    style: {}
  },
  {
    id: 'COLOR-Energy-4',
    imgUrl: 'https://cdn.kimjisoo.cn/pic/svgicons/colors/energy-4.svg',
    style: {}
  },
  {
    id: 'COLOR-Florid-2',
    imgUrl: 'https://cdn.kimjisoo.cn/pic/svgicons/colors/florid-2.svg',
    style: {}
  },
  {
    id: 'COLOR-Sakura-2',
    imgUrl: 'https://cdn.kimjisoo.cn/pic/svgicons/colors/sakura-2.svg',
    style: {}
  }
]
