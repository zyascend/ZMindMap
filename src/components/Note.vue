<template>
  <div class="note-container">
    <div class="doc-main">
      <h1 class="name">{{ data.name }}</h1>
      <div class="content">
        <div class="note-node" v-show="node.show" v-for="node in noteList" :key="node.id">
          <div class="indent" v-for="i in node.level" :key="`${index}-${i}`" />
          <div class="node-content">
            <div
              class="action-wrapper"
              @click="toggleCollapse(node.id)"
              v-if="node.children.length || node._children.length ">
              <svg-icon icon="triangle" :class="`${node.collapsed ? 'icon-collapsed' : ''}`"/>
            </div>
            <div class="bullet-wrapper">
              <div class="bullet" />
            </div>
            <div class="text-wrapper">
              <span>{{ node.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
// import { useStore } from 'vuex'
// import { useTreeData, useRender, useKeydownEvent } from '../hooks'
import SvgIcon from '@/components/SvgIcon.vue'
import { note } from '@/mock/note'
import '@/assets/pic/triangle.svg'

export default defineComponent({
  name: 'Note',
  components: {
    SvgIcon
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    // const store = useStore()
    const noteList = ref(props.data.content)
    const originData = note
    onMounted(() => {
    })
    onUnmounted(() => {
      document.onkeydown = undefined
    })
    const toggleCollapse = _id => {
      console.log('toggleCollapse> ', _id)
      const flattendList = []
      // const iter = list => {
      //   if (!list || !list.length) return
      //   for (const v of list) {
      //     if (v.id === _id) {
      //       if (v.collapsed) v.collapsed = false
      //       else {
      //         v.collapsed = true
      //       }
      //       [v.children, v._children] = [v._children, v.children]
      //     }
      //     flattendList.push(v)
      //     iter(v.children)
      //   }
      // }
      const toggleShow = (list, isParentNotShow = false) => {
        if (!list || !list.length) return
        for (const v of list) {
          // 如果父节点不显示 那么子节点也不显示
          if (isParentNotShow) {
            v.show = false
            toggleShow(v.children, true)
          }
          if (v.pid === _id) {
            v.show = !v.show
            toggleShow(v.children, v.show)
          }
          toggleShow(v.children)
        }
      }
      toggleShow(originData)
      const iter = list => {
        if (!list || !list.length) return
        for (const v of list) {
          flattendList.push(v)
          iter(v.children)
        }
      }
      iter(originData)
      console.log(flattendList)
      noteList.value = flattendList
    }
    return {
      noteList,
      toggleCollapse
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../assets/css/mixin';
.note-container {
  @include wh100;
  .doc-main {
    max-width: 872px;
    min-height: calc(100vh - 252px);
    padding: 0 55px 140px;
    margin: 0 auto;
    .name {
      min-height: 42px;
      color: #16181a;
      font-size: 34px;
      font-weight: 600;
      line-height: 48px;
      padding: 62px 0 0;
      margin-bottom: 27px;
    }
    .content {
      width: 100%;
      @include vertFlex;
      align-items: center;
      .note-node {
        width: 100%;
        @include horiFlex;
        align-items: center;
        transition: .1s all;
        transition-timing-function: cubic-bezier(0.3, 1.02, 0.68, 1.01);
        .indent {
          width: 26px;
          height: 30px;
          padding-left: 1px;
          box-sizing: border-box;
          border-left: 1px solid #dee0e3;
          transform: translateX(8px);
        }
        .node-content {
          position: relative;
          flex: 1;
          @include horiFlex;
          align-items: center;
          .action-wrapper {
            @include centerFlex;
            z-index: 2;
            position: absolute;
            top: 0;
            left: -33px;
            width: 30px;
            height: 30px;
            cursor: pointer;
            background: #fff;
            .icon-collapsed {
              transform: rotate(-90deg);
            }
            &:hover {
              svg {
                display: block;
              }
            }
            svg {
              display: block;
              width: 12px;
              height: 12px;
              transition: .2s ease all;
            }
          }
          .bullet-wrapper {
            width: 18px;
            height: 18px;
            @include centerFlex;
            .bullet {
              width: 6px;
              height: 6px;
              background-color: #646a73;
              border-radius: 3px;
            }
          }
          .text-wrapper {
            flex: 1;
            height: 30px;
            box-sizing: border-box;
            padding: 2px 0 2px 8px;
            line-height: 26px;
            color: #1d1d1f;
          }
        }
      }
    }
  }
}
</style>
