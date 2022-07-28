<template>
  <svg :class="className" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>
<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    id: { type: [String, Number] },
    class: { type: String },
    icon: { type: String, required: true }
  },
  setup(props) {
    const className = computed(() => {
      if (props.class) {
        return `svg-icon ${props.class}`
      }
      return 'svg-icon'
    })
    const iconName = computed(() => {
      return `#icon-${props.icon}`
    })
    return {
      className,
      iconName
    }
  }
})
</script>

<style scoped>
.svg-icon {
  overflow: hidden;
  fill: currentColor;
}
</style>
