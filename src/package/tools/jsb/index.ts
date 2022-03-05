/*
 * @Description: cocos原生反射机制sdk
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2021-09-18 18:05:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-20 15:39:20
 */
declare global {
  interface Window {
    adInteractBridge: {
      Bridge: typeof Bridge
    }
  }
}
class CocosBridge {
  /******************************* native端注册接口 *******************************/
  /**
   * @description: QQ登录
   * @param {*}
   * @return {*}
   */
  loginQQ(){}
  /**
   * @description: 微信登录
   * @param {*}
   * @return {*}
   */  
  loginWechat(){}
  /**
   * @description: 
   * @param {string} eventName 事件名
   * @param {string} data 需要统计的参数
   * @return {*}
   */  
  reportEvent(eventName, data){}
  /**
   * @description: 设备震动
   * @param {int} count 次数
   * @param {int} type 类型 1=轻度 | 2=中度 | 其他=强震动
   * @return {*}
   */
  shakeDevice(count, type){}
  /**
   * @description: 预加载激励视频
   * @param {string} posid 广告位id
   * @param {int} limit 奖励卡秒
   * @return {*}
   */
  preloadRewardedAd(posid, limit){}
  /**
   * @description: 展示激励视频
   * @param {string} posid 广告位id
   * @return {*}
   */
  showRewardedAd(posid){}
  /**
   * @description: 打印日志信息，用于测试
   * @param {string} msg 日志消息
   * @return {*}
   */
  logcatMessage(msg){}
  /******************************* native端注册接口 *******************************/

  /******************************* cocos端注册接口 *******************************/
  /**
   * @description: 登录回调
   * @param {string} res 服务后台返回登录结果
   * @return {*}
   */
  onLoginResult(res){}
  /**
   * @description: 广告加载流程完成回调
   * @param {string} posid 广告位id
   * @return {*}
   */
  onAdLoadCompleted(posid){}
  /**
   * @description: 奖励下发
   * @param {string} posid 广告位id
   * @return {*}
   */
  onAdRewarded(posid){}
  /**
   * @description: 广告页面关闭回调
   * @param {string} posid 广告位id
   * @return {*}
   */
  onAdClose(posid){}
  /**
   * @description: 中断事件回调
   * @param {int} type 中断类型
   * @return {*}
   */
  onInterrupt(type){}
  /**
   * @description: 恢复回调
   * @param {*}
   * @return {*}
   */
  onResume(){}
  /******************************* cocos端注册接口 *******************************/
}

function init() {
  const bridge = new CocosBridge({ material_id: '1', scene_id: '1' })
  return bridge
}

const Bridge = init()

export {Bridge}