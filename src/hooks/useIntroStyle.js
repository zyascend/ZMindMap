import { ref, computed } from 'vue'

const threshold = 590
// const thresholdX = 947
// --slogan-svg-offset-y: 0px;
// --slogan-svg-scale-rate: 0.6435;
// --hero-slogan-color-2: rgb(255 55 55);
// --hero-slogan-color-1: rgb(108 105 255);
export default function useIntroStyle() {
  const sloganColorA = ref('rgba(0,0,0,1)')
  const sloganColorB = ref('rgba(0,0,0,1)')
  const sloganOffsetY = ref(104)
  const sloganScaleRate = ref(1)
  const sloganStyle = computed(() => {
    return {
      '--hero-slogan-color-1': sloganColorA.value,
      '--hero-slogan-color-2': sloganColorB.value,
      transform: `translate3d(0,${sloganOffsetY.value}px,0) scale(${sloganScaleRate.value})`
    }
  })
  const updateStyle = scrollTop => {
    let rate = scrollTop / threshold
    if (rate > 1) rate = 1
    sloganColorA.value = `rgba(${rate * 255},${rate * 55},${rate * 55},1)`
    sloganColorB.value = `rgba(${rate * 108},${rate * 105},${rate * 255},1)`
    sloganOffsetY.value = (1 - rate) * 104
    sloganScaleRate.value = 1 - 0.4 * rate
  }
  return [sloganStyle, updateStyle]
}
