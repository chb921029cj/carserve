<template>
  <div id="app" class="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="app-container" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" class="app-container" />
    <router-view name="footer-bar"></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {
    let _this = this;
    //重写系统返回事件
    document.addEventListener(
      "deviceready",
      function() {
        document.addEventListener(
          "backbutton",
          function() {
            _this.historyBack();
          },
          false
        );
      },
      false
    );
  },
  methods: {
    historyBack() {
      if (
        document.body.className === "van-toast--unclickable" ||
        document.body.className === "van-overflow-hidden"
      ) {
        return;
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>