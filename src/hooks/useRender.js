// import * as d3 from './d3'
import useDrawMap from './useDrawMap'
import useZoomMap from './useZoomMap'

const useRender = () => {
  useDrawMap()
  useZoomMap.registerZoom()
  useZoomMap.fitView()
}

export default useRender
