import useWebsiteStore from '@/store/website'

const websiteStore = useWebsiteStore()

export default function useMapStyle(styles) {
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
