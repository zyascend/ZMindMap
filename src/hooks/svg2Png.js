import saveSvg from 'save-svg-as-png'

export default function svg2Png(svgId, picName) {
  return new Promise((resolve, reject) => {
    const $svg = document.getElementById(svgId)
    if (!$svg) reject(new Error('SVG未找到'))

    const $mainG = $svg.firstChild
    if (!$mainG) reject(new Error('SVG无子元素'))

    // https://developer.mozilla.org/zh-CN/docs/Web/API/SVGGraphicsElement/getBBox
    // getBBox相对于svg空间 返回不受transform影响的原始宽高
    const gMetrics = $mainG.getBBox()

    const svgMetrics = {
      width: gMetrics.width + 20,
      height: gMetrics.height + 20
    }
    // 不让[saveSvg]中的图片下载操作影响到源svg 需要拷贝副本
    const $clonedSvg = $svg.cloneNode(true)
    const bgColor = $svg.style.backgroundColor
    // 为svg拷贝设置新的尺寸 -> 基于<g>标签的原始大小
    $clonedSvg.setAttribute(
      'style',
      `width:${svgMetrics.width}px;height:${svgMetrics.height}px;background-color:${bgColor}`
    )

    // 计算<g>标签的缩放尺度
    // [+20]的目的是留出一部分边界空隙
    const scale = Math.min(
      svgMetrics.width / (gMetrics.width + 20),
      svgMetrics.height / (gMetrics.height + 10)
    )

    // 计算<g>标签移动的距离
    const svgCenter = { x: svgMetrics.width / 2, y: svgMetrics.height / 2 }
    const gCenter = {
      x: (gMetrics.width * scale) / 2,
      y: (gMetrics.height * scale) / 2
    }

    // <g>标签移动到svg拷贝的中心并适配大小
    const transX = -gMetrics.x * scale + svgCenter.x - gCenter.x
    const transY = -gMetrics.y * scale + svgCenter.y - gCenter.y
    $clonedSvg.firstChild.setAttribute(
      'transform',
      `translate(${transX}, ${transY}) scale(${scale})`
    )

    // 添加水印
    const $waterPrint = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    )
    $waterPrint.setAttribute('x', svgMetrics.width - 150)
    $waterPrint.setAttribute('y', svgMetrics.height - 10)
    // TODO 可以优化 水印的颜色设置为当前背景的反转就不用担心水印看不到了
    $waterPrint.setAttribute('style', 'color:#000;opacity:0.2;font-size:16px;')
    $waterPrint.innerHTML = '@map.kimjisoo.cn'
    $clonedSvg.appendChild($waterPrint)
    // 准备工作完成 开始转换
    resolve($clonedSvg)
  }).then(ele => {
    // saveSvg.saveSvgAsPng 返回转化处理的Promise
    return saveSvg.saveSvgAsPng(ele, `${picName}.png`, {
      excludeCss: true
    })
  })
}
