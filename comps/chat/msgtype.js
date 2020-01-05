module.exports = {
	TEXT: 'TIMTextElem', //消息类型：文本消息
    // EMOJI: "emoji",
    IMAGE: 'TIMImageElem', //消息类型：图片消息
    VIDEO: 'TIMVideoFileElem',
    AUDIO: 'TIMSoundElem', //消息类型：音频消息
    LOCATION: 'TIMLocationElem', //消息类型：视频消息
    FILE: 'TIMFileElem', //文件消息
	chatType: {
		SINGLE_CHAT: 'C2C', //C2C（Client to Client, 端到端）会话 TIM.TYPES.CONV_C2C
		CHAT_ROOM: 'GROUP', //GROUP（群组）会话
	},
};
