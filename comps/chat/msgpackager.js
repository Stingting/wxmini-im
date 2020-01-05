import TIM from 'tim-wx-sdk';
let msgType = require("msgtype");

module.exports = function(sendableMsg, type, myName){
    // TIM.TYPES.MSG_TEXT	文本消息
    // TIM.TYPES.MSG_IMAGE	图片消息
    // TIM.TYPES.MSG_AUDIO	音频消息
    // TIM.TYPES.MSG_VIDEO	视频消息
    // TIM.TYPES.MSG_FILE	文件消息
    // ID: "C2Cuser1-1444580001-10806522-1"
    // clientSequence: 1444580001
    // conversationID: "C2Cuser1"
    // conversationSubType: undefined
    // conversationType: "C2C"
    // flow: "out"
    // from: "christine"
    // geo: {}
    // isPlaceMessage: 0
    // isRead: true
    // isResend: false
    // isRevoked: false
    // isSystemMessage: false
    // messagePriority: 0
    // payload: {text: "tttt"}
    // protocol: "JSON"
    // random: 10806522
    // sequence: 1444580001
    // status: "unSend"
    // time: 1578120299
    // to: "user1"
    // type: "TIMTextElem"
    var date = new Date();
    var Hours = date.getHours();
    var Minutes = date.getMinutes();
    var Seconds = date.getSeconds();
    var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
        + (Hours < 10 ? "0" + Hours : Hours) + ":" + (Minutes < 10 ? "0" + Minutes : Minutes) + ":" + (Seconds < 10 ? "0" + Seconds : Seconds);
	var renderableMsg = {
		info: {
			from: sendableMsg.from,
			to: sendableMsg.to
		},
		username: sendableMsg.from == myName ? sendableMsg.to : sendableMsg.from,
		yourname: sendableMsg.from,
		msg: {
			type: type,
			data: sendableMsg,
		},
		style: sendableMsg.from == myName ? "self" : "",
		time: time,
		mid: sendableMsg.type + sendableMsg.id,
		chatType: sendableMsg.conversationType
	};
	if(type == msgType.IMAGE){
		renderableMsg.msg.size = {
			width: sendableMsg.body.body.size.width,
			height: sendableMsg.body.body.size.height,
		};
	}else if (type == msgType.AUDIO) {
		renderableMsg.msg.length = sendableMsg.body.length;
	}else if (type == msgType.FILE){
		renderableMsg.msg.data = [{data: "[当前不支持此格式消息展示]", type: "txt"}];
		renderableMsg.msg.type = 'txt';
	}
	return renderableMsg;

};
