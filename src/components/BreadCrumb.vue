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
import '@/assets/pic/arrow-right.svg'

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
  width: 100%;
  @include horiFlex;
  align-items: center;
  .link {
    position: relative;
    overflow: hidden;
    max-width: 220px;
    box-sizing: border-box;
    padding: 0px 4px;
    border-radius: 4px;
    @include font_color(fc_bread);
    cursor: pointer;
    font-size: 16px;
    line-height: 22px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .link-active {
    @include font_color(fc_bread_active);
  }
  .icon {
    width: 14px;
    height: 14px;
    margin: 0px 6px;
    fill: #92929c;
    &:last-child {
      display: none;
    }
  }
}
</style>
