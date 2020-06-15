<!-- 卡劵详情 -->
<template>
  <div class="cardCoupon" :class="[index===2?'ele-gray':'']">
    <div class="cardCoupon-container icon icon-card-nouse">
      <div class="card-info">
        <div class="info-left">
          <div class="card-name">{{cardCoupon.productName}}</div>
          <div class="card-time">
            有效期
            <span>{{cardCoupon.startDate.split(' ')[0]}} - {{cardCoupon.endDate.split(' ')[0]}}</span>
          </div>
        </div>
        <div
          @click="handleShop"
          class="info-right blue"
          v-if="index!==1"
          :class="[index===0?'blue':index===1?'grey':'grey']"
        >{{index===0?'选择适用门店':index===1?'':'已过期'}}</div>
      </div>
      <div class="card-code" @click="handleDetail(cardCoupon)">
        <div class="code-number">
          券码：
          <span>{{cardCoupon.detailCode}}</span>
        </div>
        <div class="use-rule">
          {{index===0?'使用规则':index===1?'使用详情':''}}
          <i
            class="iconfont icon-arrow-right"
            v-if="index!==2"
          ></i>
        </div>
      </div>
      <!-- <div class="cardCoupon-top" @click="handleShop">
        <div>
          <p>免费洗车劵</p>
          <span>有效期2020.03.11-2020.04.11</span>
        </div>
        <div v-if="index===0">选择适用门店</div>
      </div>
      <div class="cardCoupon-bottom" @click="handleDetail">
        <div>劵码:AS12D5965212210</div>
        <div>{{index===0?"使用规则":index===1?"使用详情":"已失效"}}</div>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardCoupon: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {
    handleShop() {
      if (this.index === 2 || this.index === 1) return;
      this.$emit("Map")
    },
    handleDetail(object) {
      let _this = this;
      _this.$emit("handleDetail", _this.index, object);
      return;
      switch (_this.index) {
        case 0:
          _this.$router.push("/CarShop");
          break;
        case 1:
          _this.$router.push("/Detail");
          break;
        case 2:
          console.log(2);
          break;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.cardCoupon {
  padding: 14px 30px;
  width: 100%;
  .cardCoupon-container {
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
    // border-radius: 10px;
    // padding: 30px;
    // .cardCoupon-top {
    //   display: flex;
    //   flex-direction: row;
    //   align-items: center;
    //   justify-content: space-between;
    // }
    // .cardCoupon-bottom {
    //   display: flex;
    //   flex-direction: row;
    //   align-items: center;
    //   justify-content: space-between;
    // }
  }
}
.ele-gray {
  -webkit-filter: grayscale(100%); /* webkit */
  -moz-filter: grayscale(100%); /*firefox*/
  -ms-filter: grayscale(100%); /*ie9*/
  -o-filter: grayscale(100%); /*opera*/
  filter: grayscale(100%);
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  filter: gray; /*ie9- */
  color: #ccc;
}
.icon-card-nouse {
  // margin-bottom: 30px;
  padding: 0 14px;
  .card-info {
    width: 100%;
    height: 140px;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-align: center;
    -webkit-box-pack: center;
    .info-left {
      -webkit-box-flex: 1;
      .card-name {
        color: #333333;
        font-size: 30px;
      }
      .card-name.grey {
        color: #999999;
      }
      .card-time {
        color: #999999;
        font-size: 18px;
      }
    }
    .info-right {
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      border-radius: 25px;
      color: #ffffff;
    }
    .info-right.blue {
      background: #3b70f4;
    }
    .info-right.grey {
      background: #d6d6d6;
    }
  }
  .card-code {
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-align: center;
    -webkit-box-pack: center;
    width: 100%;
    height: 80px;
    .code-number {
      -webkit-box-flex: 1;
      font-size: 30px;
      color: #3b70f4;
    }
    .code-number.grey {
      color: #999999;
    }
    .use-rule {
      font-size: 18px;
      color: #999999;
    }
  }
}
</style>