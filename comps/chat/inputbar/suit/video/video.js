let msgType = require("../../../msgtype");

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

		// 未启用
		sendVideo(){
			var me = this;
			wx.chooseVideo({
				sourceType: ["album", "camera"],
				maxDuration: 60,
				camera: "back",
				success(res){
					me.triggerEvent(
						"newVideoMsg",
						{
							msg: msg,
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
