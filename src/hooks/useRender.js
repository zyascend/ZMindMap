// import * as d3 from './d3'
import { useStore } from 'vuex'
import useDrawMap from './useDrawMap'
import useZoomMap from './useZoomMap'

const useRender = () => {
  const store = useStore()
  const treedData = store.getters.getTreedData
  const selections = store.getters.getSelections
  useDrawMap(treedData, selections)
  useZoomMap.registerZoom(selections)
  useZoomMap.fitView(selections, store.getters.getRefs)
}

export default useRender
