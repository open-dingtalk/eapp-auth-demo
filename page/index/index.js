import {
  openAuthMiniApp,
  disposeAuthData,
} from "dingtalk-design-libs/biz/openAuthMiniApp";
let app = getApp();

//内网穿透工具介绍:
// https://open-doc.dingtalk.com/microapp/debug/ucof2g
//替换成开发者后台设置的安全域名
let domain = "http://localhost:3000";
let url = domain + "/login";

Page({
  data: {
    corpId: "",
    authCode: "",
    userId: "",
    userName: "",
    hideList: true,
  },
  loginSystem() {
    dd.showLoading();
    dd.getAuthCode({
      success: (res) => {
        this.setData({
          authCode: res.authCode,
        });
        //dd.alert({content: "step1"});
        dd.httpRequest({
          url: url,
          method: "POST",
          data: {
            authCode: res.authCode,
          },
          dataType: "json",
          success: (res) => {
            // dd.alert({content: "step2"});
            console.log("success----", res);
            let userId = res.data.result.userId;
            let userName = res.data.result.userName;
            this.setData({
              userId: userId,
              userName: userName,
              hideList: false,
            });
          },
          fail: (res) => {
            console.log("httpRequestFail---", res);
            dd.alert({ content: JSON.stringify(res) });
          },
          complete: (res) => {
            dd.hideLoading();
          },
        });
      },
      fail: (err) => {
        // dd.alert({content: "step3"});
        dd.alert({
          content: JSON.stringify(err),
        });
      },
    });
  },
  onLoad() {
    let _this = this;

    this.setData({
      corpId: app.globalData.corpId,
    });
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    //dd.alert({content: "step1"});
  },
  onShow(e) {
    disposeAuthData((options) => {
      dd.alert({
        title: "disposeAuthData",
        content: JSON.stringify(options),
      });
    });
  },
  openCancelPage() {
    return openAuthMiniApp({
      path: "pages/cancel/index",  // 不要改
      panelHeight: "percent50",
      extraData: {
        clientId: "dingwlanwvdmrtjjwdmd", // 应用ID(唯一标识)
        corpId: "ding9f50b15bccd16741", //三方企业ID
        rpcScope: "Contact.User.Read",
        fieldScope: "Contact.User.mobile",
        type: 0,
        ext: JSON.stringify({}),
        from: "",
      },
      success: (res) => {
        console.log(JSON.stringify(res));
      },
      fail: (res) => {
        console.log(JSON.stringify(res));
      },
    });
  },
  openApp() {
    console.log("openAuthMiniApp", openAuthMiniApp);
    return openAuthMiniApp({
      path: "pages/home/home", // 不要改
      panelHeight: "percent50",
      extraData: {
        clientId: "dingwlanwvdmrtjjwdmd", // 应用ID(唯一标识)
        corpId: "ding9f50b15bccd16741", //三方企业ID
        rpcScope: "Contact.User.Read",
        fieldScope: "Contact.User.mobile",
        type: 0,
        ext: JSON.stringify({}),
        from: "",
      },
    });
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: "My App",
      desc: "My App description",
      path: "pages/index/index",
    };
  },
});
