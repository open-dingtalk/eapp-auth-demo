import React from "react";
import logo from "./logo.svg";
import "./App.css";
import dd from 'dingtalk-jsapi';
import { openAuthMiniApp } from "dingtalk-design-libs";
function App() {
  const openMiniApp = () => {
    dd.ready(()=>{
      openAuthMiniApp({
        panelHeight: "percent75",
        path: "pages/home/home", //不要改,这里是小程序dingwlanwvdmrtjjwdmd下的一个页面地址
        extraData: {
          clientId: "dingwlanwxxx", // 应用ID(唯一标识)
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
    })
  };

  const cancelMiniApp = () => {
    dd.ready(()=> {
      openAuthMiniApp({
        path: "pages/cancel/index",
        extraData: {
          clientId: "dingwlanwxxx", // 应用ID(唯一标识)
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
    })
  };
  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <button onClick={openMiniApp}>打开授权弹窗</button>
          <button onClick={cancelMiniApp}>打开取消授权弹窗</button>
          <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
  );
}

export default App;
