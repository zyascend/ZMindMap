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
