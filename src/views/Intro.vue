<!-- eslint-disable max-len -->
<template>
  <div class="body-main-content">
    <div class="home">
      <div class="pin-spacer">
        <section :class="`${move ? 'home_hero_2' : 'home_hero'}`">
          <div class="bg">
            <svg
              width="2469"
              height="669"
              viewBox="0 0 2469 669"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                class="hero-bg-line"
                d="M18.5 61.5C362.5 395.5 505.5 420.936 662 403.5C809 387.122 848.546 324.648 880 271.537C935 178.666 867.01 -48.3496 971 92.0367C1041 186.537 883.999 131.877 827.5 206.537C771.5 280.537 892.5 588.536 1238 447.536C1583.5 306.536 1629.88 41.3884 1294.5 83.5367C1016 118.537 849.649 430.314 1503 289.536C1774.5 231.036 1848 -33.5159 1968.5 28.0367C2127 109 1560 595.037 1768 646.537C1905.44 680.567 2125.24 497.597 2201.51 426.5C2277.79 355.403 2406.5 210.5 2450.5 148"
                stroke="url(#paint0_linear_145_39)"
                stroke-width="36"
                stroke-linecap="round"
                style="--stroke-dashoffset: 0"
              ></path>
              <defs>
                <linearGradient
                  id="paint0_linear_145_39"
                  x1="914.999"
                  y1="140.039"
                  x2="2127"
                  y2="617.539"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#E5DCE5"></stop>
                  <stop offset="1" stop-color="#F56060"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="slogan-container">
            <h1
              id="hero_slogan"
              class="home__hero-slogan handwritten"
              :style="sloganStyle"
            >
              思如泉涌<br />成竹在图
            </h1>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import useIntroStyle from '@/hooks/useIntroStyle'
// import { ref, computed } from 'vue'
// const threshold = 590
const thresholdX = 947
const move = ref(false)
const [sloganStyle, updateStyle] = useIntroStyle()
// const sloganColorA = ref('rgba(0,0,0,1)')
// const sloganColorB = ref('rgba(0,0,0,1)')
// const sloganOffsetY = ref(104)
// const sloganScaleRate = ref(1)
// --slogan-svg-offset-y: 0px;
// --slogan-svg-scale-rate: 0.6435;
// --hero-slogan-color-2: rgb(255 55 55);
// --hero-slogan-color-1: rgb(108 105 255)

// const sloganStyle = computed(() => {
//   return {
//     '--hero-slogan-color-1': sloganColorA.value,
//     '--hero-slogan-color-2': sloganColorB.value,
//     transform: `translate3d(0,${sloganOffsetY.value}px,0) scale(${sloganScaleRate.value})`
//   }
// })
window.addEventListener('scroll', ev => {
  const scrollTop =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop
  move.value = scrollTop > thresholdX
  console.log(scrollTop, move.value)
  updateStyle(scrollTop)
})
</script>
<style lang="scss" scoped>
.body-main-content {
  display: block;
  min-height: 100%;
  .home {
    display: block;
    overflow-x: hidden;
    background: #f3f3f6;
    .pin-spacer {
      position: relative;
      inset: 0;
      z-index: auto;
      box-sizing: border-box;
      display: block;
      flex-shrink: 1;
      float: none;
      width: 100%;
      height: 2145px;
      padding: 0 0 947.001px;
      margin: 0;
      overflow: visible;
      .home_hero {
        position: fixed;
        top: 48.001px;
        left: 0;
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        height: 1199px;
        max-height: 1199px;
        padding: 152.985px 0 569.091px;
        margin: 0;
        overflow: hidden;
        transform: translate(0, 0);
      }
      .home_hero_2 {
        position: relative;
        inset: 0 auto auto 0;
        width: 100%;
        max-width: 100%;
        height: 1198.45px;
        max-height: 1198.45px;
        padding: 152.985px 0 569.091px;
        margin: 0;
        overflow: hidden;
        transform: translate(0, 947.001px);
      }
      .home_hero,
      .home_hero_2 {
        .bg {
          position: absolute;
          top: calc(224.60606px + -7.74411vw);
          left: 0;
          z-index: 0;
          width: 100%;
          height: auto;
          text-align: center;
          opacity: 1;
          transform: translate3d(0, 127.75px, 0);
          svg {
            position: absolute;
            width: 2449px;
            max-width: 170%;
            height: auto;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
            .hero-bg-line {
              stroke-dasharray: 5808.7314453125;
              stroke-dashoffset: 5808.73145;
              animation: move 3s ease-in-out forwards;
            }
            @keyframes move {
              0% {
                stroke-dashoffset: 5808.7314453125;
              }
              100% {
                stroke-dashoffset: 0;
              }
            }
          }
        }
        .slogan-container {
          --slogan-svg-scale-rate: 1;
          --slogan-svg-offset-y: 0;
          --hero-slogan-color-1: #000;
          --hero-slogan-color-2: #000;
          position: relative;
          box-sizing: border-box;
          display: flex;
          width: 100%;
          max-width: 1170px;
          padding-right: 30px;
          padding-left: 30px;
          margin-right: auto;
          margin-left: auto;
          #hero_slogan {
            position: relative;
            z-index: 2;
            box-sizing: border-box;
            display: inline-block;
            margin: 1rem auto 0;
            margin-bottom: 0.25rem;
            font-family: NeverMind, NeverMind, Barlow, system-ui, -apple-system,
              'PingFang SC', BlinkMacSystemFont, 'Segoe UI', Roboto,
              'Helvetica Neue', 'Microsoft YaHei', '微软雅黑', '黑体',
              'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', Arial,
              sans-serif;
            font-size: calc(-37.21212px + 15.48822vw);
            font-weight: 700;
            line-height: 1.2 !important;
            color: #000;
            text-align: center;
            letter-spacing: 0.12em;
            background: linear-gradient(
              90deg,
              var(--hero-slogan-color-1),
              var(--hero-slogan-color-2)
            );
            background-clip: text;
            transform: translate3d(0, var(--slogan-svg-offset-y), 0)
              scale(var(--slogan-svg-scale-rate));
            -webkit-text-size-adjust: 100%;
            -webkit-font-smoothing: antialiased;
            -webkit-text-fill-color: transparent;

            --slogan-svg-offset-y: 127.75px;
            --slogan-svg-scale-rate: 1;
            --hero-slogan-color-2: rgba(0, 0, 0, 1);
            --hero-slogan-color-1: rgba(0, 0, 0, 1);
          }
        }
      }
    }
  }
}
</style>
