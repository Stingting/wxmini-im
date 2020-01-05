let msgType = require("../../../msgtype");
var tim = getApp().globalData.tim;
Component({
	properties: {
		username: {
			type: Object,
			value: {},
		},
		chatType: {
			type: String,
			value: msgType.chatType.SINGLE_CHAT,
		},
	},
	data: {

	},
	methods: {
		isGroupChat(){
			return this.data.chatType == msgType.chatType.CHAT_ROOM;
		},

		getSendToParam(){
			return this.isGroupChat() ? this.data.username.groupId : this.data.username.your;
		},

		sendVideo(){
			var me = this;
			wx.chooseVideo({
				sourceType: ["album", "camera"],
				maxDuration: 60,
				camera: "back",
				success(res){
                    let message = tim.createVideoMessage({
                        to: me.getSendToParam(),
                        conversationType: msgType.chatType.SINGLE_CHAT,
                        payload: {
                            file: res
                        }
                    })
                    let promise = tim.sendMessage(message);
                    promise.then(function(imResponse) {
                        // 发送成功
                        console.log("发送视频成功===" + JSON.stringify(imResponse));
                    }).catch(function(imError) {
                        // 发送失败
                        console.warn('sendMessage error:', imError);
                    });

					me.triggerEvent(
						"newVideoMsg",
						{
							msg: message,
							type: msgType.VIDEO
						},
						{
							bubbles: true,
							composed: true
						}
					);
				}
			});
		},
	},

	// lifetimes
	created(){},
	attached(){},
	moved(){},
	detached(){},
	ready(){},
});
