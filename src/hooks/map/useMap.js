import { hierarchy } from 'd3-hierarchy'
import TreeTable from './TreeTable'
import LogicTree from './LogicTree'

const useMap = (content, mapStyleId = 'MAPID-TreeTable') => {
  const hierarchyData = hierarchy(content)
  if (mapStyleId === 'MAPID-TreeTable') {
    const treeTable = new TreeTable()
    return treeTable.create(hierarchyData)
  }
  const logicTree = new LogicTree()
  return logicTree.create(hierarchyData)
}

export default useMap
