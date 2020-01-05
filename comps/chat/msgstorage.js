let Disp = require("../../utils/Dispatcher");
let msgPackager = require("msgpackager");
let msgType = require("msgtype");
let msgStorage = new Disp();
let disp = require("../../utils/broadcast");
import TIM from 'tim-wx-sdk';
msgStorage.saveReceiveMsg = function(receiveMsg){
    if (receiveMsg != null) {
        for (var index = 0; index < receiveMsg.length; index++) {
            var obj = receiveMsg[index];
            var type = obj.type;
            this.saveMsg(obj, type, null);
        }
    }

};
msgStorage.saveMsg = function(sendableMsg, type, receiveMsg){
    //console.log('sendableMsgsendableMsg', sendableMsg)
    let me = this;
    let myName = wx.getStorageSync("myUsername");
    let sessionKey;
    // 仅用作群聊收消息，发消息没有 receiveMsg
    if(receiveMsg && receiveMsg.type == "groupchat"){
        sessionKey = receiveMsg.to + myName;
    }
    // 群聊发 & 单发 & 单收
    else{
        sessionKey = sendableMsg.from == myName
            ? sendableMsg.to + myName
            : sendableMsg.from + myName;
    }
    let curChatMsg = wx.getStorageSync(sessionKey) || [];
    let renderableMsg = msgPackager(sendableMsg, type, myName);
    if(type == msgType.AUDIO) {
        renderableMsg.msg.length = sendableMsg.body.length;
        renderableMsg.msg.token = sendableMsg.accessToken;
    }
    curChatMsg.push(renderableMsg);
    //console.log('renderableMsgrenderableMsg', renderableMsg)
    if(type == msgType.AUDIO){
        renderableMsg.msg.token = sendableMsg.accessToken;
        //如果是音频则请求服务器转码
        // wx.downloadFile({
        // 	url: sendableMsg.body.body.url,
        // 	header: {
        // 		"X-Requested-With": "XMLHttpRequest",
        // 		Accept: "audio/mp3",
        // 		Authorization: "Bearer " + sendableMsg.accessToken
        // 	},
        // 	success(res){
        // 		// wx.playVoice({
        // 		// 	filePath: res.tempFilePath
        // 		// });
        // 		renderableMsg.msg.url = res.tempFilePath;

        // 		save();
        // 	},
        // 	fail(e){
        // 		console.log("downloadFile failed", e);
        // 	}
        // });
    }
    // else{
    // 	save();
    // }

    save();
    function save(){
        wx.setStorage({
            key: sessionKey,
            data: curChatMsg,
            success(){
                if (type == msgType.AUDIO || type == msgType.VIDEO) {
                    disp.fire('em.chat.audio.fileLoaded');
                }
                me.fire("newChatMsg", renderableMsg, type, curChatMsg, sessionKey);
            }
        });
    }
};

module.exports = msgStorage;
