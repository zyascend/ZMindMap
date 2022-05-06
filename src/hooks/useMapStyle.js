const colorMap = {
  0: {
    svgBg: '#eeeef3',
    pathStroke: '#5856d5',
    rootRectFill: '#5856d5',
    subRootRectFill: '#0CAFFF',
    leafRectFill: 'transparent',
    rootFoDivFontColor: '#fff',
    subRootFoDivFontColor: '#fdfafa',
    leafFoDivFontColor: '#4B4B4B'
  }
}

export function getStyle (styleName = '0') {
  const colors = colorMap[styleName]
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
