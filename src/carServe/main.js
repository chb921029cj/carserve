import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import http from "./service/http";
// 引入静态资源
// 样式初始化、字体图标
import "@/carServe/assets/css/reset.css";
// 引入雪碧图样式文件
import "@/carServe/assets/css/sprite.scss";
// 引入VantUI样式和按需引入VantUI组件
import 'vant/lib/index.css';
// 引入重置VantUI库的样式文件
import "@/carServe/assets/css/resetVantui.scss";
// 引入iconfont字体文件
import "@/carServe/assets/css/iconfont.css";
import {
  Tab,
  Tabs,
  Toast,
  Icon,
  Button,
  Divider,
  Dialog,
  NavBar,
  Popup,
  Overlay,
  Notify,
  ShareSheet,
  IndexBar,
  IndexAnchor,
  Cell,
  Loading
} from "vant";
Vue
  .use(Loading)
  .use(Tab)
  .use(Tabs)
  .use(Toast)
  .use(Icon)
  .use(Button)
  .use(Divider)
  .use(Dialog)
  .use(NavBar).use(Popup).use(Overlay).use(Notify).use(ShareSheet).use(IndexBar).use(IndexAnchor).use(Cell);

const preventHandler = e => {
  e.preventDefault();
};
Vue.directive("roll", {
  componentUpdated(el, binding) {
    if (binding.value) {
      document
        .getElementsByTagName("body")[0]
        .addEventListener("touchmove", preventHandler, {
          passive: false
        });
    } else {
      document
        .getElementsByTagName("body")[0]
        .removeEventListener("touchmove", preventHandler, {
          passive: false
        });
    }
  }
});

Vue.config.productionTip = false;
Vue.prototype.$Http = http;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");