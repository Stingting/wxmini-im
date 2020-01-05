//app.js
import TIM from 'tim-wx-sdk'; // 微信小程序环境请取消本行注释，并注释掉 import TIM from 'tim-js-sdk';
import COS from 'cos-wx-sdk-v5'; // 微信小程序环境请取消本行注释，并注释掉 import COS from 'cos-js-sdk-v5';
import {genTestUserSig} from 'utils/GenerateTestUserSig';
App({
  onLaunch: function () {
      let msgStorage = require("comps/chat/msgstorage");
// 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
      let options = {
          SDKAppID: 1400302002 // 接入时需要将0替换为您的即时通信应用的 SDKAppID
      };
      let tim = TIM.create(options); // SDK 实例通常用 tim 表示
// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
      tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
// tim.setLogLevel(1); // release级别，SDK 输出关键信息，生产环境时建议使用

// 将腾讯云对象存储服务 SDK （以下简称 COS SDK）注册为插件，IM SDK 发送文件、图片等消息时，需要用到腾讯云的 COS 服务

// 微信小程序环境，注册 COS SDK
      tim.registerPlugin({'cos-wx-sdk': COS}); // 微信小程序环境请取消本行注释，并注释掉 tim.registerPlugin({'cos-js-sdk': COS});

// 监听事件，如：
      tim.on(TIM.EVENT.SDK_READY, function(event) {
          // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
          console.log(`============${event.name}==================`);
      });

      tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
          // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
          // event.name - TIM.EVENT.MESSAGE_RECEIVED
          // event.data - 存储 Message 对象的数组 - [Message]
          console.log("====================received===" + JSON.stringify(event.data))
          msgStorage.saveReceiveMsg(event.data);
      });

      tim.on(TIM.EVENT.MESSAGE_REVOKED, function(event) {
          // 收到消息被撤回的通知
          // event.name - TIM.EVENT.MESSAGE_REVOKED
          // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
      });

      tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function(event) {
          // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
          // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
          // event.data - 存储 Conversation 对象的数组 - [Conversation]
      });

      tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function(event) {
          // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
          // event.name - TIM.EVENT.GROUP_LIST_UPDATED
          // event.data - 存储 Group 对象的数组 - [Group]
      });

      tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, function(event) {
          // 收到新的群系统通知
          // event.name - TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED
          // event.data.type - 群系统通知的类型，详情请参见 GroupSystemNoticePayload 的 <a href="https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/Message.html#.GroupSystemNoticePayload"> operationType 枚举值说明</a>
          // event.data.message - Message 对象，可将 event.data.message.content 渲染到到页面
      });

      tim.on(TIM.EVENT.PROFILE_UPDATED, function(event) {
          // 收到自己或好友的资料变更通知
          // event.name - TIM.EVENT.PROFILE_UPDATED
          // event.data - 存储 Profile 对象的数组 - [Profile]
      });

      tim.on(TIM.EVENT.BLACKLIST_UPDATED, function(event) {
          // 收到黑名单列表更新通知
          // event.name - TIM.EVENT.BLACKLIST_UPDATED
          // event.data - 存储 userID 的数组 - [userID]
      });

      tim.on(TIM.EVENT.ERROR, function(event) {
          // 收到 SDK 发生错误通知，可以获取错误码和错误信息
          // event.name - TIM.EVENT.ERROR
          // event.data.code - 错误码
          // event.data.message - 错误信息
      });

      tim.on(TIM.EVENT.SDK_NOT_READY, function(event) {
          // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
          // event.name - TIM.EVENT.SDK_NOT_READY
      });

      tim.on(TIM.EVENT.KICKED_OUT, function(event) {
          // 收到被踢下线通知
          // event.name - TIM.EVENT.KICKED_OUT
          // event.data.type - 被踢下线的原因，例如 :
          //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
          //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
          //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢
      });

// 开始登录
      tim.login({userID: 'christine', userSig: genTestUserSig('christine').userSig});
      wx.setStorageSync('myUsername', 'christine');
      this.globalData.tim = tim;

      wx.navigateTo({
        url: 'pages/chatroom/chatroom'
      })

  },
  globalData: {
    tim : null
  }
})