let Disp = require("../../utils/Dispatcher");
let msgPackager = require("msgpackager");
let msgType = require("msgtype");
let msgStorage = new Disp();
let disp = require("../../utils/broadcast");
msgStorage.saveReceiveMsg = function (receiveMsg) {
    if (receiveMsg != null) {
        for (var index = 0; index < receiveMsg.length; index++) {
            var obj = receiveMsg[index];
            var type = obj.type;
            this.saveMsg(obj, type, null);
        }
    }

};
msgStorage.saveMsg = function (sendableMsg, type, receiveMsg) {
    //console.log('sendableMsgsendableMsg', sendableMsg)
    let me = this;
    let myName = wx.getStorageSync("myUsername");
    let sessionKey;
    // 仅用作群聊收消息，发消息没有 receiveMsg
    if (receiveMsg && receiveMsg.type == "groupchat") {
        sessionKey = receiveMsg.to + myName;
    }
    // 群聊发 & 单发 & 单收
    else {
        sessionKey = sendableMsg.from == myName
            ? sendableMsg.to + myName
            : sendableMsg.from + myName;
    }
    let curChatMsg = wx.getStorageSync(sessionKey) || [];
    let renderableMsg = msgPackager(sendableMsg, type, myName); //消息封装
    curChatMsg.push(renderableMsg);
    wx.setStorage({
        key: sessionKey,
        data: curChatMsg,
        success() {
            me.fire("newChatMsg", renderableMsg, type, curChatMsg, sessionKey);
        }
    });
};

module.exports = msgStorage;
