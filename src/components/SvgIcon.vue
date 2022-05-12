<script>
import { defineComponent, computed } from 'vue'
export default defineComponent({
  name: 'SvgIcon',
  props: {
    id: { type: [String, Number] },
    class: { type: String },
    icon: { type: String, required: true }
  },
  setup (props) {
    const className = computed(() => {
      if (props.class) {
        return `svg-icon ${props.class}`
      } else {
        return 'svg-icon'
      }
    })
    const icon = computed(() => {
      return `#icon-${props.icon}`
    })
    return () => (
      <svg class={className.value} aria-hidden='true'>
        <use xlinkHref={icon.value} />
      </svg>
    )
  }
})
</script>

<style scoped>
  .svg-icon {
    overflow: hidden;
    fill: currentColor;
  }
</style>
