import { hierarchy } from 'd3-hierarchy'
import useMapStore from '@/store/map'
import TreeTable from './TreeTable'
import LogicTree from './LogicTree'

const useMap = (content, mapStyleId = 'MAPID-TreeTable') => {
  const hierarchyData = hierarchy(content)
  const store = useMapStore()
  const { measureSvg } = store.selections
  const { mainSvg } = store.selections
  if (mapStyleId === 'MAPID-TreeTable') {
    const treeTable = new TreeTable(measureSvg, mainSvg)
    return treeTable.create(hierarchyData)
  }
  const logicTree = new LogicTree(measureSvg)
  return logicTree.create(hierarchyData)
}

export default useMap
