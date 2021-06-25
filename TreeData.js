class TreeDataCreater {
  constructor ({ measureSelection, treeStyle, gapY = 5, gapX = 30 } = {}) {
    this.measureSelection = measureSelection
    this.treeStyle = treeStyle
    this.gapY = gapY
    this.gapX = gapX
  }

  create (root) {
    this.measureWidthAndHeight(root)
    this.caculateXY(root)
    console.log('r', root)
    return root
  }

  caculateXY (root) {
    const { depth, childHeight, height, children, width } = root
    if(depth === 0) {
      root.x = 10
      root.y = 365
    }
    if (!children) return
    const { x, y } = root
    const startY = y - (childHeight - (childHeight - children[0].height)/2 - height)
    for(let i = 0; i < children.length; i++) {
      const child = children[i]
      child.x = x + width + this.gapX
      if (i === 0) {
        child.y = startY
      } else {
        const lastChild = children[i-1]
        child.y = lastChild.y + lastChild.height + this.gapY
      }
      this.caculateXY(child)
    }
  }

  measureWidthAndHeight (root) {
    const multiline = this.getMultiline(root.data.name)
    const t = asstSvg.append('text')
    t.selectAll('tspan').data(multiline).enter().append('tspan').text((d) => d).attr('x', 0)
    const tBox = t.node().getBBox()
    t.remove()
    root.width = Math.max(tBox.width, 22)
    root.height = Math.max(tBox.height, 22) * multiline.length
    let childHeight = 0
    if (root.children && root.children.length) {
      for (const child of root.children) {
        this.measureWidthAndHeight(child)
        childHeight += child.childHeight
      }
      childHeight += this.gapY * (root.children.length - 1) 
      root.childHeight = Math.max(childHeight, root.height)
    } else {
      root.childHeight = root.height
    }
  }

  getMultiline (str) {
    const multiline = str.split('\n')
    if (multiline.length > 1 && multiline[multiline.length - 1] === '') {
      multiline.pop()
    }
    return multiline
  }
}