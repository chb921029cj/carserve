<!-- 代办工单 -->
<template>
  <div class="login-container" :style="{height}">
    <!-- <better-scroll class="login-container-scroll" ref="myScroll">
      <ul>
    <li>-->
    <div class="login-bg"></div>
    <div class="login-header">太平洋保险 | 车主权益通</div>
    <div class="login-logo">
      <div class="icon icon-login-logo"></div>
    </div>
    <div class="login-inputbox">
      <div class="blank">
        <!-- <div class="icon icon-login-username"></div> -->
        <img :src="require('../../assets/images/login-username.png')" alt />
        <div class="boxflex">
          <input
            id="username"
            type="text"
            placeholder="请输入您的车牌号"
            v-model.trim="username"
            @focus="f('username')"
          />
        </div>
      </div>
      <div class="blank">
        <!-- <div class="icon icon-login-password"></div> -->
        <img :src="require('../../assets/images/login-password.png')" alt />

        <div class="boxflex">
          <input
            id="password"
            type="password"
            placeholder="请输入您的密码"
            v-model.trim="password"
            @focus="f('password')"
          />
        </div>
      </div>
    </div>
    <div class="login-loginbtn" @click="login">登录</div>
    <div class="loading-container background" v-if="showLoading">
      <van-loading>
        <div slot="default">
          <img :src="require('../../assets/images/gif.gif')" alt width="100" height="100" />
          <span>加载中...</span>
        </div>
      </van-loading>
    </div>
    <!-- </li>
      </ul>
    </better-scroll>-->
  </div>
</template>

<script>
import BetterScroll from "@/carServe/components/BetterScroll.vue";
export default {
  name: "Loginpage",

  mixins: [],

  components: { BetterScroll },

  props: {},

  data() {
    return {
      height: document.documentElement.clientHeight + "px",
      timer: null,
      showLoading: false,
      username: "",
      password: "",
      currentH: document.documentElement.clientHeight + "px"
    };
  },

  computed: {},

  watch: {},

  created() {
    // const that = this;
    // that.timer = setInterval(function() {
    //   if (document.readyState === "complete") {
    //     that.showLoading = false;
    //     that.timer = null;
    //   }
    // }, 100);
  },

  mounted() {
    localStorage.removeItem("new_token");
  },

  destroyed() {},

  methods: {
    f(selector) {
      let _this = this;
      var dom = document.getElementById("selector");
      if (dom) {
        setTimeout(function() {
          dom.scrollIntoView(true);
          dom.scrollIntoViewIfNeeded();
        }, 500);
      }
    },
    async login() {
      let _this = this;
      try {
        if (!_this.username) {
          _this.$dialog.alert({
            message: "请输入车牌号"
          });
          return;
        }
        if (!_this.password) {
          _this.$dialog.alert({
            message: "请输入密码"
          });
          return;
        }
        let param = {
          username: this.username,
          // username: "京Q2HK82",
          password: this.password
          // password: "Q2HK82"
        };

        let res = await this.$Http.login(param);

        if (res) {
          console.log(res);
          localStorage.setItem("new_token", res);
          _this.$router.push("/Mine");
        }
      } catch (err) {
        _this.$dialog.alert({
          message: err
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  // height: 100%;
  position: relative;
  background: #ffffff;
  .login-bg {
    // position: absolute;
    width: 100%;
    height: 535px;
    left: 0;
    top: 0;
    z-index: 0;
    background: url(../../assets/images/login-bg.png);
    background-size: 100%;
  }
  .login-header {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100px;
    line-height: 100px;
    color: #ffffff;
    text-align: center;
    font-size: 32px;
  }
  .login-logo {
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 400px;
    background: url(../../assets/images/login-logobg.png);
    background-size: 100%;
    width: 234px;
    height: 224px;
    padding-top: 17px;
    margin-left: -112px;
    display: flex;
    text-align: center;
    display: -webkit-box;
    -webkit-box-pack: center;
  }
  .login-inputbox {
    // position: absolute;
    margin-top: 100px;
    width: 100%;
    padding: 0 55px;
    .blank {
      width: 100%;
      height: 94px;
      border-bottom: 1px solid #e2e2e2;
      display: -webkit-box;
      -moz-box-orient: horizontal;
      -webkit-box-align: center;
      -webkit-box-pack: center;
      padding-left: 22px;
      img {
        width: 32px;
        height: 36px;
      }
      .boxflex {
        -webkit-box-flex: 1;
        margin-left: 25px;
        input {
          width: 100%;
          border: 0;
          background: none;
          height: 94px;
          line-height: 94px;
          font-size: 28px;
          color: #333333;
        }
        input::placeholder {
          color: #a6a6a6;
        }
      }
    }
  }
  .login-loginbtn {
    margin: 150px auto;
    width: 640px;
    height: 88px;
    line-height: 88px;
    background-image: -webkit-linear-gradient(
      0deg,
      rgb(72, 147, 252) 0%,
      rgb(59, 112, 244) 100%
    );
    border-radius: 44px;
    text-align: center;
    color: #ffffff;
    font-size: 32px;
  }
  .background {
    z-index: 10;
    background: #fff;
  }
}
</style>
