let msgType = require("msgtype");
import util from '../../utils/util';
module.exports = function(sendableMsg, type, myName){
    var time = util.formatTime(new Date(sendableMsg.time * 1000));
    var msg = {};
    msg.type = type;
    if(type == msgType.TEXT) {
        //文本消息
         msg.data = sendableMsg.payload.text;
    } else if (type == msgType.IMAGE) {
        //图片消息
        msg.url = sendableMsg.flow == 'in' ? sendableMsg.payload.imageInfoArray[0].imageUrl:sendableMsg.payload.imageInfoArray[0].url; //图片路径
        msg.format = sendableMsg.payload.imageFormat; //图片格式
    } else if (type == msgType.AUDIO) {
        //音频消息
        msg.url = sendableMsg.payload.url;
        msg.length = sendableMsg.payload.second; //音频时长，单位：秒
    } else if (type == msgType.VIDEO) {
        //视频消息
        msg.url = sendableMsg.payload.videoUrl;//remoteVideoUrl
        msg.thumbUrl = sendableMsg.payload.thumbUrl;//缩略图地址
        msg.format = sendableMsg.payload.videoFormat; //视频文件格式
    }
    else if (type == msgType.FILE){
        //文件消息
         msg.data = [{data: "[当前不支持此格式消息展示]", type: msgType.FILE}];
    }
	var renderableMsg = {
		info: {
			from: sendableMsg.from,
			to: sendableMsg.to,
            flow : sendableMsg.flow
		},
		username: sendableMsg.from == myName ? sendableMsg.to : sendableMsg.from,
		yourname: sendableMsg.from,
		msg: msg,
		style: sendableMsg.from == myName ? "self" : "",
		time: time,
		mid: sendableMsg.type + sendableMsg.ID,
		chatType: sendableMsg.conversationType, //会话类型，C2C,
        status : sendableMsg.status //消息状态 ： unSend(未发送)success(发送成功)fail(发送失败)
	};
	return renderableMsg;

};
