<!-- 卡卷使用详情 -->
<template>
  <div class="detail" :style="{height}">
    <div class="detail-header">
      <van-nav-bar class="mine-nav" title="卡劵使用详情">
        <van-icon slot="left" name="arrow-left" @click="hanleBack"></van-icon>
      </van-nav-bar>
      <div class="detail-top">
        <div>
          <span>使用完成</span>
          <span>结算单号:{{object.detailCode}}</span>
        </div>

        <div class="icon icon-xiugai"></div>
      </div>
    </div>

    <better-scroll class="detail-scroll" ref="detailScroll">
      <ul>
        <li class="detail-scroll-li">
          <div>
            <p>{{object.supplierName}}</p>
            <div>
              <div class="icon icon-detail"></div>
              <span>{{object.productName}}</span>
            </div>
            <ul>
              <li>
                <span>{{object.addr}}</span>
                <span class="icon icon-addr" @click="handleUrl('addr')"></span>
              </li>
              <li v-if="object.phone">
                <span>电话：{{object.phone}}</span>
                <span class="icon icon-tele" @click="handleUrl('tele')"></span>
              </li>
              <li>
                <span>手机：{{object.tel}}</span>
                <span class="icon icon-mobile" @click="handleUrl('mobile')"></span>
              </li>
            </ul>
          </div>
          <div>
            <p>订单详情</p>
            <ul>
              <li>
                <span>第三方订单编号</span>
                <span>{{object.usingNo}}</span>
              </li>
              <li>
                <span>下单时间</span>
                <span>{{object.usingTime}}</span>
              </li>
              <li>
                <span>支付方式</span>
                <span>卡劵兑换</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </better-scroll>
    <van-popup
      id="TelDetail"
      v-model="TelDetail"
      round
      position="bottom"
      :close-on-click-overlay="!overlay"
      :overlay="overlay"
    >
      <div @click="handleTel">呼叫 {{mobile}}</div>
      <div @click="TelDetail = false">取消</div>
    </van-popup>
  </div>
</template>

<script>
import BetterScroll from "@/carServe/components/BetterScroll.vue";
export default {
  data() {
    return {
      height: document.documentElement.clientHeight + "px",
      TelDetail: false,
      overlay: true,
      mobile: "15366512811",
      detailId: this.$route.params.detailId,
      object: null
    };
  },

  components: { BetterScroll },

  computed: {},

  mounted() {
    this.getUsedDetail();
  },

  methods: {
    async getUsedDetail() {
      let res = await this.$Http.getUsedDetail({ supplierId: this.detailId });
      this.object = res;
    },
    handleTel() {
      function clickA(href) {
        let a = document.createElement("a");
        a.setAttribute("href", href);
        document.body.appendChild(a);
        a.click();
      }
      clickA(`tel:${this.mobile}`);
    },
    //返回键
    hanleBack() {
      this.$router.go(-1);
    },
    handleUrl(type) {
      function clickA(href) {
        var a = document.createElement("a");
        a.setAttribute("href", href);
        document.body.appendChild(a);
        a.click();
      }
      switch (type) {
        case "addr":
          clickA(
            `https://uri.amap.com/marker?position=${this.object.lng},${this.object.lat}&name=${this.object.supplierName}&mode=car`
          );
          break;
        case "tele":
          this.mobile = this.object.phone;
          this.TelDetail = true;

          // clickA("tel:025-85949998");
          break;
        case "mobile":
          this.mobile = this.object.tel;
          this.TelDetail = true;
          break;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.detail {
  padding-top: 388px;
  &-header {
    background: #3379ff;
    position: fixed;
    top: 0;
    width: 750px;
    .mine-nav {
      background: #3379ff;
      width: 750px;
      height: 88px;
      line-height: 88px;
      .van-nav-bar__title {
        font-size: 36px;
        color: #fff;
      }
      .van-icon {
        color: #fff;
        margin-top: -4px;
      }
    }
    .detail-top {
      width: 750px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 30px;
      height: 300px;
      color: #fff;
      & > div:first-child {
        flex: 1;
        & > span:first-child {
          display: flex;
          flex-direction: column;
          font-size: 36px;
        }
        & > span:last-child {
          font-size: 20px;
        }
      }
    }
  }

  &-scroll {
    height: 100%;
    position: relative;
    top: -50px;
    &-li {
      padding: 30px;
      padding-bottom: 0px;
      & > div {
        width: 690px;
        padding: 30px;
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0px 5px 5px 0px rgba(216, 216, 216, 0.75);
      }
      & > div:first-child {
        height: 500px;
        padding: 30px;
        p {
          font-size: 28px;
          color: #333333;
          font-weight: bold;
          padding-bottom: 10px;
        }
        & > div:nth-child(2) {
          margin-top: 20px;
          display: flex;
          flex-direction: row;
          align-items: center;
          span {
            align-self: flex-start;
            margin-left: 20px;
            font-size: 28px;
            color: 333333;
          }
        }
        ul {
          padding-top: 20px;
          li {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: 80px;
            & > span:first-child {
              font-size: 22px;
              color: #666;
              -webkit-box-flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            & > span:last-child {
              margin-left: 20px;
            }
          }
        }
      }
      & > div:last-child {
        padding: 40px 30px 100px 30px;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0px 5px 5px 0px rgba(216, 216, 216, 0.75);
        margin-top: 20px;
        p {
          font-size: 28px;
          color: #333;
          padding-bottom: 20px;
        }
        ul {
          li {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            font-size: 24px;
            line-height: 48px;
            & > span:first-child {
              color: #999;
            }
            & > span:last-child {
              color: #333;
            }
          }
        }
      }
    }
  }
  #TelDetail.van-popup {
    display: flex;
    flex-direction: column;
    align-items: center;
    left: 30px;
    background: rgba(0, 0, 0, 0);
    width: 690px;
    // height: 200px;
    // padding: 30px;
    & > div {
      width: 690px;
      height: 88px;
      background: #fff;
      border-radius: 44px;
      color: #3379ff;
      font-size: 30px;
      line-height: 88px;
      text-align: center;
    }
    & > div:last-child {
      margin: 20px 0;
    }
  }
}
</style>
<style >
.detail .van-nav-bar__title {
  font-size: 36px;
  line-height: 88px;
  color: #fff;
}
.detail .van-icon-arrow-left {
  font-size: 36px;
  color: #333;
}
</style>