import TreeTable from './TreeTable'
import LogicTree from './LogicTree'
import { hierarchy } from 'd3-hierarchy'
import { useMapStore } from '@/store/map'

const useMap = (content, mapStyleId = 'MAPID-TreeTable') => {
  const hierarchyData = hierarchy(content)
  const store = useMapStore()
  const measureSvg = store.selections.measureSvg
  if (mapStyleId === 'MAPID-TreeTable') {
    const treeTable = new TreeTable(measureSvg)
    return treeTable.create(hierarchyData)
  } else {
    const logicTree = new LogicTree(measureSvg)
    return logicTree.create(hierarchyData)
  }
}

export default useMap
