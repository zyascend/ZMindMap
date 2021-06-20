const canvas = document.getElementById('canvas')
const btn = document.getElementById('add')
const ctx = canvas.getContext('2d')

let W = window.innerWidth
let H = window.innerHeight
let rootItem = undefined
const MAX_WIDTH = 200
const LINE_HEIGHT = 35

class Item {
  constructor({ x, y, width=100, height=50, text='test', level, _id, ctx } = {}) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.text = text
    this.level = level
    this._id = _id
    this.children = []
    this.ctx = ctx
    this.rowArr = [] // 拆分出来的每一行
    this.setRowArray()
    this.setMetrics()
  }
  setRowArray () {
    let allAtr = this.text.split('')
    let rowStrArr = [] // 每一行的文字数组
    for (let i = 0; i < allAtr.length; i++) {
      const currentStr = allAtr[i];
      rowStrArr.push(currentStr);
      const rowStr = rowStrArr.join('');
      if (ctx.measureText(rowStr).width > MAX_WIDTH) {
        rowStrArr.pop(); // 删除最后一个
        this.rowArr.push(rowStrArr.join('')); // 完成一行
        rowStrArr = [currentStr];
        continue;
      }
      // 最后一个字母 直接添加到一行
      if (i === allAtr.length - 1) {
        this.rowArr.push(rowStr); // 完成一行
      }
    }
  }
  addChild (child) {
    this.children.push(child)
  }

  caculate () {
    if (!this.children.length) return
    let childrenHeight = 0
    for ( const child of this.children) {
      child.caculate()
      childrenHeight += child.height
    }
    childrenHeight += (this.children.length - 1) * 5
    this.height = Math.max(this.height, childrenHeight)
    
    this.caculatePos()
  }

  caculatePos () {
    for(let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      if (i == 0) {
        child.y = this.y - (this.height - child.height)/2
      } else {
        child.y = this.children[i-1].y + child.height 
      }
      child.x = this.x + this.width + 60
      child.caculatePos()
    }
  }

  setMetrics () {
    // 计算自己的宽高
    this.height = this.rowArr.length * LINE_HEIGHT + 20
    if (this.rowArr.length == 1) {
      this.width = ctx.measureText(this.text).width
    } else {
      this.width = MAX_WIDTH
    }
  }
}

const drawText = (ctx, item) => {
  const startX = item.x
  const startY = item.y
  for (let i = 0; i < item.rowArr.length; i++) {
    ctx.fillText(item.rowArr[i], startX, startY - (item.rowArr.length - 1 - i) * LINE_HEIGHT);
  }
}

const drawItems = (ctx, item) => {
  drawText(ctx, item)
  if (item.children.length) {
    for (const child of item.children) {
      drawItems(ctx, child)
    }
  }
}

const drawLines = (ctx, item) => {
  if (!item.children.length) return

  ctx.fillStyle = '#fff'
  const { x, y, width, height, text='test', level, _id } = item

  const startX = x
  const startY = y

  const transX = startX + width +  20
  const transY = startY

  let midX = 0
  let midY = 0

  let endX = 0
  let endY = 0

  for (const child of item.children) {
    endX = child.x + child.width
    endY = child.y
    midX = child.x - 20
    midY = endY
    ctx.beginPath()
    ctx.lineTo(startX, startY)
    ctx.lineTo(transX, transY)
    ctx.lineTo(midX, midY)
    ctx.lineTo(endX, endY)
    ctx.lineWidth = 2
    ctx.strokeStyle = "#FFFFFF"
    ctx.stroke()
    ctx.closePath()
    drawLines(ctx, child)
  }
}

const draw = () => {
  ctx.clearRect(0, 0, W, H)
  drawItems(ctx, rootItem)
  drawLines(ctx, rootItem)
}

const initData = () => {
  ctx.font = '30px Arial'
  ctx.fillStyle = '#FFF'
  ctx.textBaseline="bottom"
  rootItem = new Item({
    ctx: ctx,
    x: 100,
    y: H/2,
    level: 0,
    _id: 0
  })
}

const caculateAll = () => {
  rootItem.caculate()
}

const resize = () => {
  W = canvas.width = window.innerWidth
	H = canvas.height = window.innerHeight
  initData()
  draw()
}

const addNewDom = () => {
  console.log('sdadsda')
  rootItem.addChild(new Item({
    level: 1,
    text: 'TESTTEST6666'
  }))
  rootItem.addChild(new Item({
    level: 1,
    text: 'TESTTEST6666'
  }))
  rootItem.addChild(new Item({
    level: 1,
    text: 'TESTTEST6666'
  }))
  rootItem.children[0].addChild(new Item({
    level: 1,
    text: 'TESTTEST6666'
  }))
  rootItem.children[1].addChild(new Item({
    level: 1,
    text: 'TESTTEST6666'
  }))
  caculateAll()
  
  draw()
}

window.onload = () => {
  window.onresize = resize
  resize()
  btn.addEventListener('click', function(){
    console.log('aaaaaaaaaaa')
    addNewDom()
  })
}