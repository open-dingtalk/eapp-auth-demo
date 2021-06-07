import { openAuthMiniApp, disposeAuthData} from 'dingtalk-design-libs/biz/openAuthMiniApp';
// const app = getApp();

Page({
    data:{
    },
    onShow(e) {
      disposeAuthData((options)=>{
        dd.alert({
          title:'disposeAuthData',
          content:JSON.stringify(options)
        })
      })
    },
    onTap() {
      const path = 'pages/home/home';
      return openAuthMiniApp({
          appId: '5000000000174977', //'5000000000371217', //5000000000174977',
          path,
          panelHeight: 'percent50',
/*          deployVersion: '0.1.2105251749.7037',
          protocol: '1.0',
          buildId:'2392045',*/
          extraData:{
            clientId:'dingwlanwvdmrtjjwdmd',
            clientType:0,
            corpId:'ding9f50b15bccd16741',
            rpcScope:'Contact.User.Read',
            fieldScope:'Contact.User.mobile',
            type:0,
            ext: JSON.stringify({}),
            from:''
          }
      });
    },
  onOrgTap() {
    const path = 'pages/home/home'; //'page/index/index';
    return openAuthMiniApp({
      appId: '5000000000174977', //'5000000000371217', //5000000000174977',
      path,
      panelHeight: 'percent50',
      /*          deployVersion: '0.1.2105251749.7037',
                protocol: '1.0',
                buildId:'2392045',*/
      extraData:{
        clientId:'suitejtxqmzlvvubpokgq', //'dingwlanwvdmrtjjwdmd',
        clientType:0,
        corpId:'ding027f45142432fbd135c2f4657eb6378f', //'ding9f50b15bccd16741',
        rpcScope:'Contact.ManagementGroup.Read', //'Contact.User.Read',
        //fieldScope:'Contact.User.mobile',
        type:0,
        ext: JSON.stringify({}),
        from:''
      }
    });
  },
    onTapMini() {
      const path = 'page/index/index';
      dd.navigateToMiniProgram({
        appId: '5000000000371217',
        ddAppParams: {
          ddMode: 'float',
          panelHeight: 'percent75'
        },
        path: path,
        extraData: {
          clientId:'dingwlanwvdmrtjjwdmd',
          clientType:0,
          corpId:'ding9f50b15bccd16741',
          rpcScope:'Contact.User.Read',
          fieldScope:'Contact.User.mobile',
          type:0,
          ext:JSON.stringify({})
        },
        success (res) {
          dd.alert({
            content: res,
          });
          console.log("navigateToMiniProgram succ" + JSON.stringify(res));
        },
        fail (err) {
          dd.alert({content: "navigateToMiniProgram fail" + JSON.stringify(err),});
        }
      });
    },

    onCancelTap(){
      return openAuthMiniApp({
        float:false,
/*        deployVersion: '0.1.2104091638.17536',
        protocol: '1.0',
        buildId:'2279609',*/
        extraData:{
          clientId:'dingwlanwvdmrtjjwdmd',
          ext: JSON.stringify({}),
          from:'aaa'
        }
      });
    }
});
