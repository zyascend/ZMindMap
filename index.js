const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let W = window.innerWidth
let H = window.innerHeight
let rootItem = undefined

class Item {
  constructor({ x, y, width=100, height=50, text='test', level, _id } = {}) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.text = text
    this.level = level
    this._id = _id
    this.children = []
  }

  addChild(child) {
    this.children.push(child)
  }
}

const drawItems = (ctx, item) => {
  item.width = ctx.measureText(item.text).width
  ctx.fillText(item.text, item.x, item.y)
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
    endY = child.y + 5

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
  ctx.font = '40px Arial'
  ctx.fillStyle = '#FFF'
  ctx.textBaseline="bottom"
  drawItems(ctx, rootItem)
  drawLines(ctx, rootItem)
}

const initData = () => {
  rootItem = new Item({
    x: W/2,
    y: H/2,
    level: 0,
    _id: 0
  })
  rootItem.addChild(new Item({
    x: W/2 + 200,
    y: H/2 - 100,
    level: 1,
    text: '21',
    _id: 0
  }))
  rootItem.addChild(new Item({
    x: W/2 + 200,
    y: H/2 + 100,
    level: 0,
    text: '测试文本',
    _id: 1
  }))
}

const resize = () => {
  W = canvas.width = window.innerWidth
	H = canvas.height = window.innerHeight
  initData()
  draw()
}

window.onload = () => {
  window.onresize = resize
  resize()
}