import { hierarchy } from 'd3-hierarchy'
import TreeTable from './TreeTable'
import LogicTree from './LogicTree'

const useMap = (content, mapStyleId = 'MAPID-TreeTable') => {
  const hierarchyData = hierarchy(content)
  // TODO 当导图风格变多的时候 怎么优雅地处理？
  // 考虑proxy策略模式？
  if (mapStyleId === 'MAPID-TreeTable') {
    const treeTable = new TreeTable()
    return treeTable.create(hierarchyData)
  }
  const logicTree = new LogicTree()
  return logicTree.create(hierarchyData)
}

export default useMap
