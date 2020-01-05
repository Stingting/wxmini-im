import TIM from 'tim-wx-sdk';
let msgType = require("../../../msgtype");
let disp = require("../../../../../utils/broadcast");
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
		inputMessage: "",		// render input 的值
		userMessage: "",		// input 的实时值
	},

	methods: {
		focus(){
			this.triggerEvent("inputFocused", null, { bubbles: true });
		},

		blur(){
			this.triggerEvent("inputBlured", null, { bubbles: true });
		},

		isGroupChat(){
			return this.data.chatType == msgType.chatType.CHAT_ROOM;
		},

		getSendToParam(){
			return this.isGroupChat() ? this.data.username.groupId : this.data.username.your;
		},

		// bindinput 不能打冒号！
		bindMessage(e){
			this.setData({
				userMessage: e.detail.value
			});
		},

		emojiAction(emoji){
			var str;
			var msglen = this.data.userMessage.length - 1;
			if(emoji && emoji != "[del]"){
				str = this.data.userMessage + emoji;
			}
			else if(emoji == "[del]"){
				let start = this.data.userMessage.lastIndexOf("[");
				let end = this.data.userMessage.lastIndexOf("]");
				let len = end - start;
				if(end != -1 && end == msglen && len >= 3 && len <= 4){
					str = this.data.userMessage.slice(0, start);
				}
				else{
					str = this.data.userMessage.slice(0, msglen);
				}
			}
			this.setData({
				userMessage: str,
				inputMessage: str
			});
		},

		sendMessage(){
			let me = this;

			String.prototype.trim=function()
			{
			     return this.replace(/(^\s*)|(\s*$)/g, '');
			}
			if(!this.data.userMessage.trim()){
				return;
			}

            let message = tim.createTextMessage({
                to: 'user1',
                conversationType: TIM.TYPES.CONV_C2C,
                payload: {
                    text: this.data.userMessage
                }
            });
// 2. 发送消息
            let promise = tim.sendMessage(message);
            promise.then(function(imResponse) {
                // 发送成功
                console.log(imResponse);
            }).catch(function(imError) {
                // 发送失败
                console.warn('sendMessage error:', imError);
            });

			this.triggerEvent(
				"newTextMsg",
				{
					msg: message,
					type: TIM.TYPES.MSG_TEXT,
				},
				{
					bubbles: true,
					composed: true
				}
			);
			//
			this.setData({
				userMessage: "",
				inputMessage: "",
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
