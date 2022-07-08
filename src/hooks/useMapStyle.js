import useWebsiteStore from '@/store/website'

const websiteStore = useWebsiteStore()
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

export function getStyleList() {
  return colorArrays.map(style => Object.values(style))
}

export default function useMapStyle(styles = { colorId: 'COLOR-Sakura-2' }) {
  const { colorId } = styles
  const allColors = websiteStore.styles.colorList
  const {
    style: { colors }
  } = allColors.find(item => item.id === colorId)
  return {
    svgStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.bgSvg
    },
    pathStyle: {
      stroke: colors.path,
      fill: 'none',
      strokeWidth: '1.5px'
    },
    imageStyle: {
      display: 'none'
    },
    rectStyle: node => {
      let style = {
        stroke: colors.border,
        strokeWidth: `${node.strokeWidth}px`
      }
      switch (node.depth) {
        case 0:
          style = { ...style, fill: colors.bgRoot }
          break
        case 1:
          style = { ...style, fill: colors.bgSubRoot }
          break
        default:
          style = { ...style, fill: colors.bgLeaf }
      }
      return style
    },
    textStyle: node => {
      const _fontSize = node.depth === 0 ? 16 : 14
      const _lineHeight = _fontSize + 2
      let style = {
        fontSize: `${_fontSize}px`,
        lineHeight: `${_lineHeight}px`,
        textAnchor: 'start',
        whiteSpace: 'initial'
      }
      switch (node.depth) {
        case 0:
          style = { ...style, color: colors.textRoot }
          break
        case 1:
          style = { ...style, color: colors.textSubRoot }
          break
        default:
          style = { ...style, color: colors.textLeaf }
      }
      return style
    }
  }
}
