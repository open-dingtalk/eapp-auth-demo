

import { onAuthAppBack } from 'dingtalk-design-libs/biz/openAuthMiniApp';
App({
  onLaunch(options) {
    console.log('App Launch', options);
    console.log('getSystemInfoSync', dd.getSystemInfoSync());
    console.log('SDKVersion', dd.SDKVersion);
    this.globalData.corpId = options.query.corpId;
  },
  onShow(options) {
    console.log('App Show');
    onAuthAppBack(options, (data) => {
      // 这里可以对返回数据做二次处理，之后需要把数据返回到page.onShow
      dd.alert({
        title: 'app is onAppShow have data ：' + JSON.stringify(data),
      });
      return data;
    });
  },
  onHide() {
    console.log('App Hide');
  },
  globalData: {
    corpId:''
  }
});
