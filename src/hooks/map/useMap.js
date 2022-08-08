import { hierarchy } from 'd3-hierarchy'
import TreeTable from './TreeTable'
import LogicTree from './LogicTree'

const useMap = (content, mapStyleId) => {
  const hierarchyData = hierarchy(content)
  // TODO 当导图风格变多的时候 怎么优雅地处理？
  // 考虑proxy策略模式？
  let renderData
  if (mapStyleId === 'MAPID-TreeTable') {
    const treeTable = new TreeTable()
    renderData = treeTable.create(hierarchyData)
    return renderData
  }
  const logicTree = new LogicTree()
  renderData = logicTree.create(hierarchyData)
  return renderData
}

export default useMap
