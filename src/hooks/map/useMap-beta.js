import { hierarchy } from 'd3-hierarchy'
import TreeTable from './TreeTable'
import LogicTree from './LogicTree-beta.js'

const useMap = (content, name, nodeMap, mapStyleId) => {
  const timerTag = `[TIMER] > ${name} > `
  console.time(timerTag)
  const hierarchyData = hierarchy(content)
  // TODO content 变动的patchFlags的还原
  let renderData
  if (mapStyleId === 'MAPID-TreeTable') {
    const treeTable = new TreeTable()
    renderData = treeTable.create(hierarchyData)
  }
  const logicTree = new LogicTree(nodeMap)
  console.timeEnd(timerTag)
  renderData = logicTree.create(hierarchyData)
  console.timeEnd(timerTag)
  return renderData
}

export default useMap
