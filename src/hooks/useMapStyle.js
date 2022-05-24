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
        fontSize: '14px',
        lineHeight: '14px'
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
      'https://xmind.works/assets/vendors/snowbird/resource/markers/tagMarkers/tag-red.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/tagMarkers/tag-orange.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/tagMarkers/tag-yellow.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/tagMarkers/tag-green.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/tagMarkers/tag-blue.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/tagMarkers/tag-dark-purple.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/tagMarkers/tag-grey.svg?v=0.0.25'
    ]
  },
  {
    category: '优先级',
    imgs: [
      'https://xmind.works/assets/vendors/snowbird/resource/markers/priorityMarkers/priority-1.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/priorityMarkers/priority-2.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/priorityMarkers/priority-3.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/priorityMarkers/priority-4.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/priorityMarkers/priority-5.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/priorityMarkers/priority-6.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/priorityMarkers/priority-7.svg?v=0.0.25'
    ]
  },
  {
    category: '任务',
    imgs: [
      'https://xmind.works/assets/vendors/snowbird/resource/markers/taskMarkers/task-start.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/taskMarkers/task-oct.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/taskMarkers/task-3oct.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/taskMarkers/task-half.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/taskMarkers/task-5oct.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/taskMarkers/task-7oct.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/taskMarkers/task-done.svg?v=0.0.25'
    ]
  },
  {
    category: '标记',
    imgs: [
      'https://xmind.works/assets/vendors/snowbird/resource/markers/flagMarkers/flag-red.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/flagMarkers/flag-orange.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/flagMarkers/flag-yellow.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/flagMarkers/flag-green.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/flagMarkers/flag-blue.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/flagMarkers/flag-purple.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/flagMarkers/flag-gray.svg?v=0.0.25'
    ]
  },
  {
    category: '符号',
    imgs: [
      'https://xmind.works/assets/vendors/snowbird/resource/markers/symbolMarkers/c_symbol_heart.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/symbolMarkers/c_symbol_like.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/symbolMarkers/c_symbol_dislike.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/symbolMarkers/c_symbol_heart.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/symbolMarkers/symbol-pin.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/symbolMarkers/symbol-idea.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/symbolMarkers/symbol-lightning.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/symbolMarkers/c_symbol_telephone.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/symbolMarkers/c_symbol_pen.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/symbolMarkers/symbol-run.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/symbolMarkers/symbol-exclam.svg?v=0.0.25',
      'https://xmind.works/assets/vendors/snowbird/resource/markers/symbolMarkers/symbol-question.svg?v=0.0.25'
    ]
  }
]
