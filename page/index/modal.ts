import '@ali/dingtalk-jsapi/entry/mobile';
import { getENV } from '@ali/dingtalk-jsapi/lib/env';
import { compareVersion } from '@ali/dingtalk-jsapi/lib/sdk/sdkLib';
import openLink from '@ali/dingtalk-jsapi/api/biz/util/openLink';
import navToMiniApp from '@ali/dingtalk-jsapi/api/biz/navigation/navigateToMiniProgram';
import { EventEmitter2 } from 'eventemitter2';

let isFloatMiniAppOpen = false;
const AUTH_MINI_APPID = '5000000000174977';
const AUTH_BACK_DATA = 'AUTH_BACK_DATA';
const { platform, version, appType } = getENV();
const emitter = new EventEmitter2();


/**
 * 唤起统一授权小程序 请求参数定义
 *
 */
export interface INavigateToMiniProgramParams {
  appId?: string;  // 小程序miniAppId，可不填
  path: string;   // 打开小程序页面path，授权为pages/home/home; 取消授权为pages/cancel/index
  extraData?: object; // 唤起授权小程序需要传递的业务参数，详细见文档
  /* 目标小程序启动相关的参数 */
  ddAppParams?: any;  // 小程序启动相关参数，可不填
  panelHeight?: string; // 半屏小程序高度，默认百分之67 "percent67"
  /* 调试用参数，线上会忽略 */
  deployVersion?:string;
  buildId?: string;
  float?: boolean; // 是否需要半屏，默认true
}


function isInMiniApp() {
  return appType === 'MINI_APP';
}

/**
 * 对象转查询字符串
 * @return {object}
 * */
function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .map((key) => {
      return ''.concat(encodeURIComponent(key), '=').concat(encodeURIComponent(obj[key]));
    })
    .join('&');
}

/**
 * 是否支持半屏打开
 * @return {boolean}
 */
function isSupportFloat() {
  if (platform === 'android') {
    // 安卓大于5.1.39版本都支持半屏打开
    return compareVersion(version || '', '5.1.39');
  } else {
    // ios下
    if (isInMiniApp()) {
      // 小程序内不支持半屏打开
      return compareVersion(version || '', '6.0.5');
    }
    // h5下
    return compareVersion(version || '', '5.1.40');
  }
}

/**
 * 是否支持webview间消息传递
 * @return {boolean|*}
 */
function isSupportSendMsg() {
  if (isInMiniApp()) {
    // 小程序情况下，iOS下会存在canIUse判断能用，其实却不能用的情况
    if (platform === 'android') {
      return dd.canIUse('navigateToMiniProgram') && dd.canIUse('navigateBackMiniProgram');
    }
    if (platform === 'ios') {
      return compareVersion(version || '', '6.0.5');
    }
    return false;
  } else {
    // h5情况下
    return platform === 'android'? compareVersion(version || '', '5.1.39') : compareVersion(version || '', '5.1.40');
  }
}

function navigateToMiniProgram(opt: any) {
  if (isInMiniApp()) {
    return dd.navigateToMiniProgram(opt);
  }
  const buildId = opt.ddAppParams ? opt.ddAppParams.buildId : '';
  if(opt && opt.ddAppParams){
    delete opt.ddAppParams.deployVersion;
    delete opt.ddAppParams.buildId;
  }
  // H5打开小程序情况下存在双端不一致问题，ios走的是opt.path参数走extraData; android走的是ddAppParams的page参数（page/index?xxx）, 有path时拿不到extraData的数据，也拿不到page的数据。
  // TODO 需要发版解决不一致问题 @零封 @序元
  if (platform === 'android') {
    delete opt.path;
  }

  return navToMiniApp({
    ...opt,
    buildId
  });
}

/**
 * 添加isSendMsg到url上
 * @param url
 * @return {string}
 */
function addIsSendMsgParam2Url(url: string) {
  if (url.indexOf('&') === -1) {
    return `${url}?isSendMsg=true`;
  }
  return `${url}&isSendMsg=true`;
}

/**
 * 打开钉钉统一授权小程序
 * @category biz Helpers
 * @param {INavigateToMiniProgramParams} opt - 唤起授权小程序入参
 * @support mob web
 * @example
 * // 小程序唤起授权小程序，半屏高度为375px
 * openAuthMiniApp({
 *  path: 'pages/home/home',
 *  panelHeight: '375'
 * })
 *
 * // 小程序唤起授权小程序，半屏高度为百分之75，并传递业务参数extraData
 * openAuthMiniApp({
 *  panelHeight: 'percent75',
 *  path: 'pages/home/home',
 *  extraData:{
 *    id:'xxx',
 *    name:'ssssss'
 *  }
 * })
 *
 * // H5 唤起授权小程序，半屏高度为百分之75，并传递业务参数extraData
 * openAuthMiniApp({
 *  panelHeight: 'percent75',
 *  path: 'pages/home/home',
 *  extraData:{
 *    id:'xxx',
 *    name:'ssssss'
 *  }
 * }).then((res)=>{
 *  // 处理返回数据
 * })
 *
 * @return {Promise<any>}
 */

export function openAuthMiniApp(opt: INavigateToMiniProgramParams) {
  return new Promise((resolve, reject) => {
    const {path, panelHeight = 'percent67', float = true } = opt;
    if(!path){
      throw 'path is required，auth is pages/home/home , cancel auth is pages/cancel/index;'
    }
    const isSendMsg = isSupportSendMsg();
    const isFloat = isSupportFloat();
    const newPath = `${path}?${objectToQueryString(opt.extraData)}`;
    const appId = opt.appId || AUTH_MINI_APPID;
    isFloatMiniAppOpen = true;
    if (isSendMsg) {
      // 支持传递数据，用navigateToMiniProgram打开新页面
      const ddAppParams: any = {
        // 安卓情况下，页面路径需要通过page参数传入
        page: newPath,
        panelHeight,
        deployVersion: opt.deployVersion,
        buildId: opt.buildId,
      };

      if (float && isFloat) {
        ddAppParams.ddMode = 'float';
      }
      navigateToMiniProgram({
        ...opt,
        appId, // 统一授权小程序miniAppId
        path:opt.path,
        ddAppParams,
      }).catch(() => {
        // 不能用navigateToMiniProgram打开时的补救措施
        openAppByOpenLink(appId, newPath, panelHeight).catch((err) => {
          isFloatMiniAppOpen = false;
          reject({
            err,
            message: 'openLink failed',
          });
        });
      });
    } else {
      openAppByOpenLink(appId, newPath, panelHeight).catch((err) => {
        isFloatMiniAppOpen = false;
        reject({
          err,
          message: 'openLink failed',
        });
      });
    }

    if (!isInMiniApp()) {
      // h5接收数据
      registerResumeHandler(resolve);
    }
  });
}

function openAppByOpenLink(miniAppId: string, path: string, panelHeight: any) {
  if (isSupportSendMsg()) {
    path = addIsSendMsgParam2Url(path);
  }
  // 不支持传递数据，用openLink打开新页面
  let url = `dingtalk://dingtalkclient/action/open_mini_app?miniAppId=${miniAppId}&page=${encodeURIComponent(
    path,
  )}`;

  if (isSupportFloat()) {
    url += `&ddMode=float&panelHeight=${panelHeight}`;
  }

  return openLink({
    url,
    enableShare: false,
  });
}

let resumeHandler: any = null;
/**
 * H5情况下注册接收消息的事件
 */
function registerResumeHandler(resolve: any) {
  // 清除之前遗留的事件
  document.removeEventListener('resume', resumeHandler);
  resumeHandler = (res: any) => {
    if (!isFloatMiniAppOpen) {
      return;
    }
    isFloatMiniAppOpen = false;
    const data = getResponseData(res);
    resolve(data);
    document.removeEventListener('resume', resumeHandler);
  };
  document.addEventListener('resume', resumeHandler);
}

/**
 * 监听授权小程序返回结果的方法，在app.onLunch或app.onShow里调用。
 * @params res {object} onLunch或 onShow的入参
 * @params callback {function} 回调方法，可对返回数据二次处理，callback必须有return值（处理后给到page.onShow的数据）
 * @support mob
 * @example
 * // app.ts 的onLaunch里调用
 * onLaunch(options) {
 *   console.log('App Launch', options);
 *  onAuthAppBack(options, (data) => {
 *     // 这里可以对返回数据做二次处理，之后需要把数据返回到page.onShow
 *     dd.alert({
 *       title: 'app is onAppShow have data ：' + JSON.stringify(data),
 *     });
 *     return data;
 *   });
 * }
 * */
export function onAuthAppBack(
  res: any,
  callback = (r: any) => {
    return r;
  },
) {
  if (!isFloatMiniAppOpen) {
    return;
  }
  isFloatMiniAppOpen = false;
  let data = getResponseData(res);
  data = callback ? callback(data) : data;
  emitter && emitter.emit(AUTH_BACK_DATA, data);
}

/**
 * 处理授权数据，在调用小程序页面的onShow中使用
 * @params fn {function} 回调函数，入参为onAuthAppBack的callback处理后的数据
 * @example
 * // page.onShow 方法里调用
 * onShow(e) {
      disposeAuthData((options)=>{
        // 拿到授权小程序返回数据进行后面的逻辑处理
        dd.alert({
          title:'disposeAuthData',
          content:JSON.stringify(options)
        })
      })
    }
 * */
export function disposeAuthData(fn: any) {
  if(emitter && !emitter.hasListeners(AUTH_BACK_DATA)){
    emitter.on(AUTH_BACK_DATA, (options) => {
      fn(options);
      // 取消监听
      emitter.off(AUTH_BACK_DATA, fn);
      emitter.removeListener(AUTH_BACK_DATA, fn);
    });
  }
}

function getResponseData(res: any) {
  if (isInMiniApp()) {
    return res && res.referrerInfo && res.referrerInfo.extraData;
  }
  let data: any = {};
  // H5情况下
  if (platform === 'android') {
    // 安卓 H5情况下
    const referrerInfo = res && res.detail && res.detail.referrerInfo;

    try {
      data = JSON.parse(referrerInfo);
    } catch (e) {}
    return data.extraData;
  }
  // iOS H5情况下
  const referrerInfo = res && res.detail && res.detail.data && res.detail.data.referrerInfo;
  try {
    data = JSON.parse(referrerInfo);
  } catch (e) {}
  return data.extraData;
}

