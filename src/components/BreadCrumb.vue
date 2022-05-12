<template>
  <div class="bread-wrapper">
    <template v-for="item in list" :key="item.id">
      <router-link :to="`/app/folder/${ item.id }`" active-class="link-active" class="link">
        <span>{{ item.name }}</span>
      </router-link>
      <SvgIcon class="icon" icon="arrow-right" />
    </template>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

export default defineComponent({
  name: 'BreadCrumb',
  components: {
    SvgIcon
  },
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

<style lang="scss">
@import '../assets/css/handler';
.bread-wrapper {
  align-items: center;
  width: 100%;
  @include horiFlex;
  .link {
    position: relative;
    box-sizing: border-box;
    max-width: 220px;
    padding: 0 4px;
    overflow: hidden;
    font-size: 16px;
    line-height: 22px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    border-radius: 4px;
    @include font_color(fc_bread);
  }
  .link-active {
    @include font_color(fc_bread_active);
  }
  .icon {
    width: 14px;
    height: 14px;
    margin: 0 6px;
    fill: #92929c;
    &:last-child {
      display: none;
    }
  }
}
</style>
