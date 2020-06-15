const TA_API = {
  // 登录
  login: {
    method: "post",
    url: 'authentication/login',
  },
  //分页查看自己有效的权益码
  findDetailsEffective: {
    method: "get",
    url: 'biz/orders/findDetailsEffective',
  },
  //分页查看自己已过期的权益码
  findDetailsExpired: {
    method: "get",
    url: 'biz/orders/findDetailsExpired',
  }, //分页查看自己已过期的权益码
  findDetailsUsed: {
    method: "get",
    url: 'biz/orders/findDetailsUsed',
  },
  //热门城市列表
  findHotRegions: {
    method: "get",
    url: 'base/regions/findHotRegions'
  },
  //全部城市列表
  findRegionCities: {
    method: "get",
    url: 'base/regions/findRegionCities'
  }, //全部城市列表
  addUsedTimes: {
    method: "putParam",
    url: 'base/regions/addUsedTimes'
  }, //全部城市列表
  findSuppliers: {
    method: "get",
    url: 'biz/base/findSuppliers'
  }, //全部城市列表
  getSupplierDetail: {
    method: "getParam",
    url: 'biz/base/getSupplierDetail'
  }, //查看已使用权益详情
  getUsedDetail: {
    method: "getParam",
    url: 'biz/orders/getUsedDetail'
  },

};

export default TA_API;