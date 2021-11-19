import emitter from './mitt'

const useKeydownEvent = () => {
  document.onkeydown = e => {
    console.log('document.onkeydown:', e.keyCode)
    emitter.emit('map-key-down', e)
  }
}

export default useKeydownEvent
