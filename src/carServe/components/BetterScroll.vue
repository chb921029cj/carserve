<!-- better-scroll滚动组件 -->
<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "BetterScroll",

  props: {
    // 1 滚动时候派发scroll事件，会截流
    // 2 滚动时候实时派发scroll事件，不会截流
    // 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
    probeType: {
      type: Number,
      default: 1
    },
    // 点击列表是否派发click事件
    click: {
      type: Boolean,
      default: true
    },
    // 是否开启横向滚动
    scrollX: {
      type: Boolean,
      default: false
    },
    // 是否派发滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 列表数据
    data: {
      type: Array,
      default: null
    },
    // 是否派发滚动到底部的事件（上拉加载）
    pullup: {
      type: Boolean,
      default: false
    },
    // 是否派发顶部下拉事件（下拉刷新）
    pulldown: {
      type: Boolean,
      default: false
    },
    // 是否派发滚动开始事件
    beforeScroll: {
      type: Boolean,
      default: false
    },
    // 数据更新后，属性scroll的延时
    refreshDelay: {
      type: Number,
      default: 20
    }
  },

  watch: {
    // 监听数据变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    }
  },

  mounted() {
    // 保证在DOM渲染完毕后初始化better-scroll
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },

  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      // better-scroll初始化
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX
      });

      // 是否派发滚动事件
      if (this.listenScroll) {
        this.scroll.on("scroll", pos => {
          this.$emit("scroll", pos);
        });
      }

      // 是否派发上拉加载事件
      if (this.pullup) {
        this.scroll.on("scrollEnd", () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit("scrollEnd");
          }
        });
      }

      // 是否派发下拉刷新事件
      if (this.pulldown) {
        this.scroll.on("touchEnd", pos => {
          if (pos.y > 50) {
            this.$emit("pulldown");
          }
        });
      }

      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },
    disable() {
      // 代理better-scroll的disable方法
      this.scroll && this.scroll.disable();
    },
    enable() {
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.enable();
    },
    refresh() {
      // 代理better-scroll的refresh方法
      this.refresh && this.scroll.refresh();
    },
    scrollTo() {
      // 代理better-scroll的scrollTo方法
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      // 代理better-scroll的scrollToElement方法
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  }
};
</script>

<style scoped>
</style>