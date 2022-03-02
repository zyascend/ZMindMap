<template>
  <div class="bread-wrapper">
    <template v-for="(item, index) in list" :key="item.id">
      <router-link :to="`/app/folder/${ item.id }`">
        <span>{{ item.name }}</span>
      </router-link>
      <span v-if="showSeparator(index)">/</span>
    </template>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
// import { defineComponent, onMounted, ref, onUnmounted } from 'vue'

export default defineComponent({
  name: 'BreadCrumb',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  setup (props) {
    const showSeparator = computed(() => index => index !== props.list.length - 1)
    return {
      showSeparator
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '../assets/css/mixin';
.map-container {
  @include wh100;
  .main-svg{
    @include wh100;
    background-color: #eeeef3;
    text {
      fill: #4B4B4B;
      cursor: default;
    }
    rect {
      stroke: blue;
      stroke-width: 2px;
      fill: transparent;
      opacity: 0;
    }
    image {
      opacity: 0;
    }
    .g-hover {
      rect {
        opacity: 0.5;
      }
    }
    .g-selected {
      rect, image {
        opacity: 1;
      }
    }
    .g-editting {
      rect {
        opacity: 1;
      }
      image,text {
        opacity: 0;
      }
    }
    .foreignDiv {
      display: inline-block;
      outline: none;
      width: max-content;
      min-width: 22px;
      padding: 1px;
      white-space: pre;
    }
  }
}
</style>
