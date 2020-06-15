<!-- 我的卡卷 -->
<template>
  <div class="mine" :style="{height,paddingTop}">
    <!--标题-->
    <div class="mine-header">
      <header ref="mineHeader">
        <van-nav-bar class="mine-nav" title="我的卡劵">
          <van-icon slot="left" name="arrow-left" @click="hanleBack"></van-icon>
        </van-nav-bar>
      </header>
      <van-tabs v-model="active" ref="mineTab" @click="handleTab">
        <van-tab title="未使用"></van-tab>
        <van-tab title="已使用"></van-tab>
        <van-tab title="已过期"></van-tab>
      </van-tabs>
    </div>

    <div class="mine-container">
      <swiper ref="mySwiper" :options="swiperOptions" class="mine-container-swiper">
        <swiper-slide class="mine-container-swiper-item">
          <ul>
            <template v-if="cardCoupons[0]&&cardCoupons[0].length">
              <li v-for="(temp,index) in cardCoupons[0]" :key="index">
                <card-coupon
                  :cardCoupon="temp"
                  :index="active"
                  @Map="goToMap(temp)"
                  @handleDetail="handleDetail"
                ></card-coupon>
              </li>
            </template>

            <li v-else class="noContent">
              <div>
                <div class="icon icon-quexingtu"></div>
                <span>暂无未使用卡劵</span>
              </div>
            </li>
          </ul>
        </swiper-slide>
        <swiper-slide class="mine-container-swiper-item">
          <ul>
            <template v-if="cardCoupons[1]&&cardCoupons[1].length">
              <li v-for="(temp,index) in cardCoupons[1]" :key="index">
                <card-coupon :cardCoupon="temp" :index="active" @handleDetail="handleDetail"></card-coupon>
              </li>
            </template>
            <li v-else class="noContent">
              <div>
                <div class="icon icon-quexingtu"></div>
                <span>暂无已使用卡劵</span>
              </div>
            </li>
          </ul>
        </swiper-slide>
        <swiper-slide class="mine-container-swiper-item">
          <ul>
            <template v-if="cardCoupons[2]&&cardCoupons[2].length">
              <li v-for="(temp,index) in cardCoupons[2]" :key="index">
                <card-coupon :cardCoupon="temp" :index="active" @handleDetail="handleDetail"></card-coupon>
              </li>
            </template>
            <li v-else class="noContent">
              <div>
                <div class="icon icon-quexingtu"></div>
                <span>暂无已过期卡劵</span>
              </div>
            </li>
          </ul>
        </swiper-slide>
      </swiper>
      <div class="loading-container mine-container-loading" v-if="showLoading">
        <van-loading>
          <div slot="default">
            <img :src="require('../../assets/images/gif.gif')" alt width="100" height="100" />
            <span>加载中...</span>
          </div>
        </van-loading>
      </div>
      <!-- <better-scroll class="mine-container-scroll" ref="mineScroll">
        <ul>
          <li v-for="(temp,index) in cardCoupons[active]" :key="index">
            <card-coupon :cardCoupon="temp" :index="active"></card-coupon>
          </li>
        </ul>
      </better-scroll>-->
    </div>
  </div>
</template>

<script>
let vm = this;
import BetterScroll from "@/carServe/components/BetterScroll.vue";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import cardCoupon from "./cardCoupon.vue";
export default {
  data() {
    return {
      showLoading: false,
      active: 0,
      height: document.documentElement.clientHeight + "px",
      paddingTop: 0,
      cardCoupons: [],
      swiperOptions: {
        Autoplay: false,
        on: {
          // click: () => {
          //   // 通过$refs获取对应的swiper对象
          //   let swiper = this.$refs.mySwiper.$swiper;
          //   let i = swiper.activeIndex;
          //   console.log(i);
          // },
          slideChangeTransitionEnd: () => {
            let swiper = this.$refs.mySwiper.$swiper;
            let i = swiper.activeIndex;
            // setTimeout(() => {
            //   this.showLoading = false;
            // }, 600);
          },
          slideChangeTransitionStart: () => {
            let swiper = this.$refs.mySwiper.$swiper;
            let i = swiper.activeIndex;
            this.active = i;
            this.getHttp(i);
            // this.showLoading = true;
          }
        }
        // Some Swiper option/callback...
      }
    };
  },

  components: { BetterScroll, cardCoupon, Swiper, SwiperSlide },

  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    }
  },
  directives: {
    // swiper: directive
  },
  mounted() {
    let _this = this;

    this.$nextTick(() => {
      _this.paddingTop =
        _this.$refs.mineHeader.offsetHeight +
        _this.$refs.mineTab.$el.offsetHeight +
        "px";
    });
    this.getHttp(0);
  },

  methods: {
    goToMap(object) {
      this.$router.push({
        name: "Map",
        params: {
          productId: object.productId,
          detailCode: object.detailCode,
          time: `${object.startDate.split(" ")[0]} - ${
            object.endDate.split(" ")[0]
          }`
        }
      });
    },
    handleDetail(index, object) {
      let _this = this;
      console.log(index, object);
      switch (index) {
        case 0:
          _this.$router.push({
            name: "CarShop",
            params: {
              object,
              index
            }
          });
          break;
        case 1:
          _this.$router.push({
            name: "Detail",
            params: {
              detailId: object.detailId
            }
          });
          break;
        case 2:
          console.log(2);
          break;
      }
    },
    async getHttp(index) {
      let _this = this;
      _this.showLoading = true;
      let res;
      let param = {
        page: 0,
        size: 999
      };
      switch (index) {
        case 0:
          res = await this.$Http.findDetailsEffective(param);
          break;
        case 1:
          res = await this.$Http.findDetailsUsed(param);
          break;
        case 2:
          res = await this.$Http.findDetailsExpired(param);
          break;
      }
      if (res) {
        _this.cardCoupons[index] = res.content;
        _this.showLoading = false;
      }
    },
    onSwiperSlideChangeTransitionStart(e) {
      console.log(e);
    },
    slideChangeTransitionEnd(e) {
      console.log(e);
    },
    //返回键
    hanleBack() {
      this.$router.go(-1);
    },
    handleTab(e) {
      let _this = this;
      // _this.showLoading = true;
      this.swiper.slideTo(e, 1000, false);
      this.getHttp(e);
      // setTimeout(() => {
      //   this.$nextTick(() => {
      //     _this.showLoading = false;
      //   });
      // }, 1000);
    }
  }
};
</script>
<style lang='scss' scoped>
.mine {
  &-header {
    background: #fff;
    position: fixed;
    top: 0;
    z-index: 100;
    width: 750px;
  }
  &-container {
    height: 100%;
    z-index: 99;
    position: relative;
    &-scroll {
      height: 100%;
    }
    &-swiper {
      height: 100%;
      &-item {
        height: 100%;
        overflow-y: scroll;
        ul {
          height: 100%;
        }
        li.noContent {
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          & > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            span {
              margin-top: 20px;
              color: #333;
            }
          }
        }
        li:first-child {
          padding-top: 14px;
        }
        li:last-child {
          padding-bottom: 14px;
        }
      }
    }
    &-loading {
      background: #fff;
      position: absolute;
      top: 0;
    }
  }
}
</style>
<style >
.mine .van-nav-bar__title {
  font-size: 36px;
  line-height: 88px;
}
.mine .van-icon-arrow-left {
  font-size: 36px;
  color: #333;
}
.van-toast.van-toast--middle {
  background: none;
  width: 300px;
  height: 300px;
}
.van-toast__text {
  color: #333;
}
</style>