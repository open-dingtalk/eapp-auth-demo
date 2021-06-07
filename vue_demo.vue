<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <button v-on:click="openMiniApp">打开授权弹窗</button>
  <button v-on:click="cancelMiniApp">打开取消授权弹窗</button>
</template>

<script>
import {
  openAuthMiniApp,
} from "dingtalk-design-libs/biz/openAuthMiniApp";
export default {
  methods: {
    openMiniApp() {
      openAuthMiniApp({
        panelHeight: "percent75",
        path: "pages/home/home", //不要改,这里是小程序dingwlanwvdmrtjjwdmd下的一个页面地址
        extraData: {
          clientId: "dingwlanwvdmrtjjwdmd", // 应用ID(唯一标识)
          corpId: "ding9f50b15bccd16741", //三方企业ID
          rpcScope: "Contact.User.Read",
          fieldScope: "Contact.User.mobile",
          type: 0,
          ext: JSON.stringify({}),
          from: "",
        },
      }).then((res) => {
        // 处理返回数据
        console.log(res);
      });
    },

    cancelMiniApp() {
      openAuthMiniApp({
        path: "pages/cancel/index",
        extraData: {
          clientId: "dingwlanwvdmrtjjwdmd", // 应用ID(唯一标识)
          corpId: "ding9f50b15bccd16741", //三方企业ID
          rpcScope: "Contact.User.Read",
          fieldScope: "Contact.User.mobile",
          type: 0,
          ext: JSON.stringify({}),
          from: "",
        },
      }).then((res) => {
        // 处理返回数据
        console.log(res);
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
