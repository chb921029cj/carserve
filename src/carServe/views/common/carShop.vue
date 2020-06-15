<!-- 汽车门店 -->
<template>
  <div class="carShop" :style="{height}">
    <div class="carShop-header icon icon-shop">
      <div class="icon icon-header-back" @click="hanleBack"></div>
      <div class="icon icon-header-share" @click="handleShare"></div>
    </div>

    <better-scroll class="carShop-scroll" ref="carShopScroll">
      <ul>
        <li class="carShop-scroll-li">
          <div>
            <p>{{object.supplierName}}</p>
            <div>
              <span>营业时间：08:00-18:00</span>
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
              <li v-if="object.tel">
                <span>手机：{{object.tel}}</span>
                <span class="icon icon-mobile" @click="handleUrl('mobile')"></span>
              </li>
            </ul>
          </div>
          <div>
            <p>商户服务</p>
            <ul>
              <li v-for="(temp,index) in object.products" :key="index">
                <span>
                  <i class="icon icon-shop-textline" v-if="productId === temp.productId"></i>
                  {{temp.productName}}
                </span>
              </li>
              <!-- <li>
                <span>安全检测</span>
              </li>
              <li>
                <span>轮胎测压</span>
              </li>
              <li>
                <span>四轮定位</span>
              </li>-->
            </ul>
          </div>
        </li>
      </ul>
    </better-scroll>
    <footer>
      <van-button @click="handleUse">立即使用</van-button>
    </footer>
    <van-overlay :show="show">
      <div class="wrapper" @click.stop>
        <div class="detail icon icon-card-popup" @click="show = false">
          <!-- <p>权益劵码</p> -->
          <!-- @click.stop="handleJuanma" -->
          <span
            v-clipboard:copy="detailCode"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >{{detailCode}}</span>
          <span>有效期{{time}}</span>
        </div>
        <!-- <div class="block" @click="show = false" /> -->
      </div>
    </van-overlay>
    <van-overlay :show="imgShow">
      <div class="wrapper" @click.stop id="qrCodeUrl" @click="imgShow = false">
        <!-- <div id="qrCodeUrl" ref="qrCodeUrl" @click="imgShow = false"></div> -->
        <qrcode-vue
          :size="qrdata.size"
          :value="qrdata.qrUrl"
          :logo="qrdata.logo"
          :bgColor="qrdata.bgColor"
          :fgColor="qrdata.fgColor"
        ></qrcode-vue>
        <!-- <div class="block" @click="show = false" /> -->
      </div>
    </van-overlay>
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
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
    <div class="loading-container" v-if="showLoading">
      <van-loading>
        <div slot="default">
          <img :src="require('../../assets/images/gif.gif')" alt width="100" height="100" />
          <span>加载中...</span>
        </div>
      </van-loading>
    </div>
  </div>
</template>

<script>
import qrcodeVue from "qrcode.vue";
import BetterScroll from "@/carServe/components/BetterScroll.vue";

// import QRCode from "qrcodejs2";
export default {
  data() {
    return {
      showLoading: true,
      detailCode: this.$route.params.detailCode
        ? this.$route.params.detailCode
        : localStorage.getItem("new_detailCode"),
      supplierId: this.$route.params.supplierId
        ? this.$route.params.supplierId
        : localStorage.getItem("new_supplierId"),
      productId: this.$route.params.productId
        ? this.$route.params.productId
        : localStorage.getItem("new_productId"),
      time: this.$route.params.time
        ? this.$route.params.time
        : localStorage.getItem("new_time"),
      overlay: true,
      TelDetail: false,
      qrdata: {
        size: 300,
        qrUrl: window.location.href,
        logo: require("../../assets/img/detail.png")
        // bgColor: "",
        // fgColor: ""
      },
      mobile: "",
      imgShow: false,
      show: false,
      height: document.documentElement.clientHeight + "px",
      message: "ASDE23E56987156",
      showShare: false,
      options: [
        [
          { name: "微信", icon: "wechat" },
          { name: "微博", icon: "weibo" },
          { name: "QQ", icon: "qq" }
        ],
        [
          { name: "复制链接", icon: "link" },
          // { name: "分享海报", icon: "poster" },
          { name: "二维码", icon: "qrcode" }
        ]
      ],
      object: {}
    };
  },

  components: { BetterScroll, qrcodeVue },

  computed: {},

  mounted() {
    if (this.$route.params.index === 0) {
      this.showLoading = false;
    } else {
      if (this.$route.params.supplierId) {
        localStorage.setItem("new_supplierId", this.$route.params.supplierId);
      }
      this.getDetail();
    }
  },

  methods: {
    async getDetail() {
      let res = await this.$Http.getSupplierDetail({
        supplierId: this.supplierId
      });

      this.object = JSON.parse(JSON.stringify(res));
      this.$nextTick(() => {
        this.showLoading = false;
      });
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
    creatQrCode() {
      document.getElementById("qrCodeUrl").innerHTML = "";
      let qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: window.location.href, // 需要转换为二维码的内容
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
        src: require("../../assets/img/detail.png")
      });
    },
    handleShare() {
      this.showShare = true;
    },
    //返回键
    hanleBack() {
      this.$router.go(-1);
    },
    handleUrl(type) {
      function clickA(href) {
        let a = document.createElement("a");
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
    },
    handleUse() {
      this.show = true;
    },
    handleJuanma() {},
    onCopy: function(e) {
      this.$notify({
        message: "已经复制卡劵" + e.text,
        type: "success"
      });
      try {
        e.stopPropagation(); //非IE浏览器
      } catch (e) {
        window.event.cancelBubble = true; //IE浏览器
      }
    },
    onSelect(option) {
      let _this = this;
      function clickA(href) {
        console.log(href);
        _this.$notify({
          message: "已复制链接",
          type: "success"
        });
        setTimeout(() => {
          let a = document.createElement("a");
          a.setAttribute("href", href);
          document.body.appendChild(a);
          a.click();
        }, 1000);
      }

      switch (option.name) {
        case "微信":
          _this.$copyText(window.location.href);
          clickA("weixin://");
          break;
        case "微博":
          _this.$copyText(window.location.href);
          clickA("weibo://");
          break;
        case "QQ":
          _this.$copyText(window.location.href);
          clickA("mqq://");
          break;
        case "复制链接":
          _this.$copyText(window.location.href);
          _this.$notify({
            message: "已复制链接",
            type: "success"
          });
          break;
        case "分享海报":
          break;
        case "二维码":
          _this.imgShow = true;
          setTimeout(() => {
            _this.$nextTick(() => {
              // _this.creatQrCode();
            });
          }, 300);

          break;
      }
      this.showShare = false;
    },
    onError: function(e) {}
  }
};
</script>
<style lang='scss' scoped>
.carShop {
  padding-top: 416px;
  padding-bottom: 88px;
  background: #fff;
  &-header {
    position: fixed;
    top: 0;
    & > div {
      position: absolute;
      color: #fff;
      top: 30px;
      font-size: 40px;

      &:first-child {
        left: 30px;
      }
      &:last-child {
        right: 30px;
      }
    }
  }

  &-scroll {
    height: 100%;
    position: relative;
    top: -50px;
    &-li {
      padding: 30px;
      padding-bottom: 30px;
      & > div:first-child {
        width: 690px;
        padding: 30px;
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0px 5px 5px 0px rgba(216, 216, 216, 0.75);
      }
      & > div:first-child {
        // height: 500px;
        padding: 30px;
        p {
          font-size: 34px;
          color: #333333;
          font-weight: bold;
          padding-bottom: 10px;
        }
        & > div:nth-child(2) {
          display: flex;
          flex-direction: row;
          align-items: center;
          span {
            font-size: 22px;
            color: #666666;
          }
        }
        ul {
          margin-top: 20px;
          li {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            // margin: 20px 0;
            height: 80px;
            & > span:first-child {
              font-size: 22px;
              color: #666666;
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
        margin-top: 50px;
        padding: 30px;
        p {
          font-size: 28px;
          font-weight: bold;
          color: #333333;
          padding-bottom: 20px;
        }
        ul {
          li {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: 96px;
            line-height: 96px;
            position: relative;
            font-size: 28px;
            color: #333333;
            .icon {
              position: absolute;
              z-index: 0;
              left: 0;
              top: 50px;
            }
          }
        }
      }
    }
  }
  footer {
    position: fixed;

    left: 30px;
    bottom: 50px;
    width: 690px;
    height: 88px;
    display: flex;
    flex-direction: row;
    & > button {
      flex: 1;
      height: 88px;
      line-height: 88px;
      background-image: -webkit-linear-gradient(
        0deg,
        rgb(72, 147, 252) 0%,
        rgb(59, 112, 244) 100%
      );
      border-radius: 44px;
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .detail {
    width: 566px;
    height: 458px;
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      font-size: 32px;

      margin-top: 20px;
    }
    & > span:first-child {
      margin-top: 130px;
      font-size: 38px;
      font-weight: bold;
      color: #fff;
    }
    & > span:last-child {
      margin-top: 80px;
      font-size: 22px;
      color: #666;
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
#qrCodeUrl img {
  width: 400px;
  height: 400px;
  padding: 10px;
  display: inline-block;
  max-width: 100%;
  height: auto;
  line-height: 1.42857143;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
</style>