<!-- 高德地图 -->
<template>
  <div :style="{height}" class="map">
    <header ref="header">
      <van-nav-bar class="map-nav" title="选择门店">
        <div slot="left" @click="handleCity">
          <span>{{currentCity.regionName}}</span>
          <van-icon :name="cityDetail?'arrow-up':'arrow-down'"></van-icon>
        </div>
      </van-nav-bar>
    </header>
    <div id="map-container"></div>
    <van-popup v-model="mapDetail" class="popup1" round position="bottom" :overlay="overlay">
      <div @click="gotoGde">
        <p>{{addr.name}}</p>
        <div>{{addr.addr}}</div>
      </div>
      <div class="icon icon-tele" @click="handleTel(false,addr)"></div>
    </van-popup>
    <van-popup
      v-model="cityDetail"
      class="popup2"
      position="bottom"
      :overlay="overlays"
      :style="{height:popHeight+'px'}"
    >
      <div>
        <div>
          <p>定位/最近访问</p>
          <div>
            <span @click="handleSelectCity(locationCity,false)">
              <i class="icon icon-gddw-gps"></i>
              {{locationCity.regionName}}
            </span>
            <span
              v-if="currentCity.regionName!==locationCity.regionName"
              @click="handleSelectCity(currentCity,false)"
            >{{currentCity.regionName}}</span>
          </div>
        </div>
        <div>
          <p>热门城市</p>
          <div>
            <span
              v-for="(temp,index) in hotCity"
              :key="index"
              @click="handleSelectCity(temp,false)"
            >{{temp.regionName}}</span>
          </div>
        </div>
      </div>

      <van-index-bar :index-list="indexList">
        <template v-for="(temp,index) in city">
          <van-index-anchor :index="temp.w" />
          <van-cell
            v-for="(ci,indexs) in temp.options"
            :key="indexs"
            :title="ci.regionName"
            @click="handleSelectCity(ci)"
          />
        </template>
      </van-index-bar>
    </van-popup>
    <div class="loading-container" v-if="showLoading">
      <van-loading>
        <div slot="default">
          <img :src="require('../../assets/images/gif.gif')" alt width="100" height="100" />
          <span>加载中...</span>
        </div>
      </van-loading>
    </div>
    <van-popup
      id="TelDetail"
      v-model="TelDetail"
      round
      position="bottom"
      :close-on-click-overlay="!overlay"
      :overlay="overlay"
    >
      <div @click="handleTel">呼叫 {{mobile}}</div>
      <div @click="handleTelFalse">取消</div>
    </van-popup>
  </div>
</template>

<script>
import AMap from "AMap";
import AMapUI from "AMapUI";
export default {
  name: "App",
  data() {
    return {
      time: this.$route.params.time
        ? this.$route.params.time
        : localStorage.getItem("new_time"),
      detailCode: this.$route.params.detailCode
        ? this.$route.params.detailCode
        : localStorage.getItem("new_detailCode"),
      productId: this.$route.params.productId
        ? this.$route.params.productId
        : localStorage.getItem("new_productId"),
      mobile: "",
      TelDetail: false,
      showLoading: false,
      href:
        "https://uri.amap.com/marker?position=118.978213,31.992057&name=洗车店",
      addr: {},
      overlays: false,
      overlay: true,
      mapDetail: false,
      cityDetail: false,
      cityShow: false,
      height: document.documentElement.clientHeight + "px",
      ss: "",
      marker: [
        [118.978213, 31.992057, "1号洗车店", "玄武区-富贵山4号103附近"],
        [118.537387, 32.089841, "2号洗车店", "秦淮区-紫金路与紫金西路交叉路口"],
        [118.838137, 31.938464, "3号洗车店", "江宁区-万科金域左侧"]
      ],
      popHeight: 0,
      indexList: [],
      city: null,
      currentCity: {},
      locationCity: {},
      hotCity: [],
      isFirst: true,
      mapObjs: null
    };
  },
  mounted() {
    let _this = this;
    _this.showLoading = true;
    if (this.$route.params.productId) {
      localStorage.setItem("new_productId", this.$route.params.productId);
      localStorage.setItem("new_time", this.$route.params.time);
      localStorage.setItem("new_detailCode", this.$route.params.detailCode);
    }
    _this.$nextTick(() => {
      let height =
        document.documentElement.clientHeight - _this.$refs.header.offsetHeight;
      _this.popHeight = height;
    });

    _this.getCitys(() => {
      _this.initChooseAmpMap(_this.currentCity);
    });

    window.addEventListener(
      "popstate",
      () => {
        if (this.cityShow) {
          this.cityDetail = false;
          this.cityShow = false;
          this.$router.push({
            name: "Map",
            params: { productId: this.productId }
          });
          return;
        }
      },
      false
    );
  },
  methods: {
    async getCitys(callback) {
      let _this = this;
      let res = await this.$Http.findRegionCities();

      let ENcode = "abcdefghijklmnopqrstuvwxyz".split("");
      let citys = [];
      ENcode.forEach(v => {
        citys.push({
          w: v,
          options: []
        });
      });
      ENcode.forEach(v => {
        _this.indexList.push(v);
      });
      res.forEach(v => {
        let index = ENcode.findIndex(py => py === v.pinyin.slice(0, 1));
        citys[index].options.push(v);
      });
      _this.city = JSON.parse(JSON.stringify(citys));
      let ress = await this.$Http.findHotRegions();
      _this.hotCity = JSON.parse(JSON.stringify(ress));
      _this.showLoading = false;

      let resCurrentCity = await _this.getLocalCity();

      _this.locationCity = JSON.parse(
        JSON.stringify(res.filter(v => resCurrentCity.city === v.regionName))
      )[0];
      _this.currentCity = JSON.parse(
        JSON.stringify(res.filter(v => resCurrentCity.city === v.regionName))
      )[0];
      callback();
    },
    handleTelFalse() {
      this.TelDetail = false;
      this.mapDetail = true;
    },
    handleTel(type = true, object) {
      if (type) {
        function clickA(href) {
          let a = document.createElement("a");
          a.setAttribute("href", href);
          document.body.appendChild(a);
          a.click();
        }
        clickA(`tel:${this.mobile}`);
      } else {
        console.log(object);
        this.mobile = object.tele;
        this.mapDetail = false;
        this.TelDetail = true;
      }
    },
    handleSelectCity(c, type = true) {
      console.log(c)
      this.currentCity = c;
      this.cityDetail = false;
      this.cityShow = false;
      this.showLoading = true;
      this.$Http.addUsedTimes({ regionCode: c.regionCode });
      this.initAmpMap(c, false);
    },
    handleCity() {
      this.cityDetail = !this.cityDetail;
      this.cityShow = !this.cityShow;
    },
    gotoGde() {
      this.$router.push({
        name: "CarShop",
        params: {
          supplierId: this.addr.supplierId,
          productId: this.productId,
          detailCode: this.detailCode,
          time: this.time
        }
      });
    },
    initAmpMap(city) {
      let _this = this;
      _this.initChooseAmpMap(city, false);
    },

    getLocalCity() {
      let p = new Promise((resolve, reject) => {
        try {
          let center = [];
          //获得定位当前城市

          AMap.plugin("AMap.CitySearch", function() {
            let geolocation = new AMap.CitySearch();
            geolocation.getLocalCity((a, b) => {
              resolve(b);
            });
            // 使用geocoder做地理/逆地理编码
          });
        } catch (e) {
          resolve(e);
        }
      });
      return p;
    },
    async initChooseAmpMap(city, type = true) {
      let _this = this;
      /**
       * 设置当前的高德地图
       */
      if (type) {
        _this.mapObjs = new AMap.Map("map-container", {
          resizeEnable: true,
          zoom: 13
        });
      }

      _this.mapObjs.setCity(city.regionName);
      //鼠标点击事件,设置地图中心点及放大显示级别
      var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30)
      });
      let param = {
        city: city.regionCode,
        productId: _this.productId
      };
      let markers = await _this.$Http.findSuppliers(param);
      let marker = [];
      markers.forEach((v, i) => {
        var icon = new AMap.Icon({
          size: new AMap.Size(62, 80), // 图标尺寸
          // image: "//webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png", // Icon的图像
          image: require("../../assets/img/cc.png"), // Icon的图像
          // imageOffset: new AMap.Pixel(0, -60), // 图像相对展示区域的偏移量，适于雪碧图等
          imageSize: new AMap.Size(30, 40) // 根据所设置的大小拉伸或压缩图片
        });
        _this.$Http
          .getSupplierDetail({
            supplierId: v.supplierId
          })
          .then(res => {
            marker.push(
              new AMap.Marker({
                position: new AMap.LngLat(v.lng, v.lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                // icon:
                //   "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
                icon,
                offset: new AMap.Pixel(-13, -30),
                // offset: new AMap.Pixel(0, -10),
                extData: {
                  lnt: v.lng,
                  lat: v.lat,
                  name: v.supplierName,
                  addr: v.addr,
                  supplierId: v.supplierId,
                  tele: res.tel
                }
              })
            );
            _this.mapObjs.add(marker[i]);
            AMap.event.addListener(marker[i], "click", function(e) {
              console.log(e.target.getExtData());
              marker.forEach(v => {
                v.setIcon(icon);
              });
              var icons = new AMap.Icon({
                size: new AMap.Size(62, 80), // 图标尺寸
                // image: "//webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png", // Icon的图像
                image: require("../../assets/img/map-yellow.png"), // Icon的图像
                // imageOffset: new AMap.Pixel(0, -60), // 图像相对展示区域的偏移量，适于雪碧图等
                imageSize: new AMap.Size(30, 40) // 根据所设置的大小拉伸或压缩图片
              });
              marker[i].setIcon(icons);
              _this.mapDetail = true;
              _this.href = `https://uri.amap.com/marker?position=${
                e.target.getExtData().lnt
              },${e.target.getExtData().lat}&name=${
                e.target.getExtData().name
              }`;
              _this.addr = Object.assign(
                {},
                {
                  x: e.lnglat.lng,
                  y: e.lnglat.lat,
                  name: e.target.getExtData().name,
                  addr: e.target.getExtData().addr,
                  supplierId: e.target.getExtData().supplierId,
                  tele: e.target.getExtData().tele
                }
              );
            });
            _this.showLoading = false;
          });
      });
      // _this.mapObjs.setFitView();
      AMap.event.addListener(_this.mapObjs, "click", function(e) {
        _this.mapDetail = false;
      });
      _this.mapObjs.on("complete", () => {
        // _this.$toast.clear();
        _this.showLoading = false;
      });
    }
  },
  destroyed() {
    window.removeEventListener("popstate", () => {}, false);
  }
};
</script>
<style lang='scss' scoped>
.map {
  .popup1.van-popup {
    display: flex;
    flex-direction: row;
    align-items: center;
    left: 15px;
    width: 720px;
    height: 200px;
    padding: 35px 30px;
    box-shadow: 0 -3px 15px 0 rgba($color: #000000, $alpha: 0.05);
    border-radius: 4px 4px 0 0;
    & > div:first-child {
      flex: 1;
      p {
        color: #333333;
        font-size: 32px;
        font-weight: bold;
      }
      div {
        color: #666666;
        font-size: 18px;
      }
    }
  }
  .popup2.van-popup {
    & > div:first-child {
      background: #f1f1f1;
      & > div:first-child {
        background: #f1f1f1;
        padding: 30px;
        p {
          font-size: 30px;
          color: #666;
        }
        div {
          margin-top: 30px;
          display: flex;
          flex-direction: row;
          & > span {
            // width: 150px;
            padding: 0 57px;
            height: 70px;
            background: #fff;
            color: #333;
            font-size: 28px;
            line-height: 70px;
            text-align: center;
            &:not(:first-child) {
              margin-left: 30px;
            }
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            i {
              margin-right: 10px;
            }
          }
        }
      }
      & > div:nth-child(2) {
        background: #f1f1f1;
        padding: 30px;
        p {
          font-size: 30px;
          color: #666;
        }
        div {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex;
          & > span {
            margin-top: 30px;
            padding: 0 30px;
            width: 200px;
            height: 70px;
            background: #fff;
            color: #333;
            font-size: 28px;
            line-height: 70px;

            &:not(:nth-child(3n + 1)) {
              margin-left: 30px;
            }

            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }
        }
      }
    }
  }
  header {
    height: 88px;
    .map-nav {
      background: #fff;
      position: fixed;
      top: 0;
      z-index: 100;
      width: 750px;
      height: 88px;
      line-height: 88px;
      .van-nav-bar__title {
        color: red;
        height: 88px;
        line-height: 88px;
      }
      .van-nav-bar__left {
        & > div {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        span {
          display: inline-block;
          max-width: 200px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
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
#map-container {
  width: 100%;
  height: 100%;
}
</style>
<style >
.map header .van-nav-bar__left i {
  display: inline-block;
  margin-left: 10px;
  color: #ccc;
}
.map header .van-nav-bar__title {
  height: 88px;
  line-height: 88px;
}
</style>