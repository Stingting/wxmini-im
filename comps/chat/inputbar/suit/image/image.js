let msgType = require("../../../msgtype");
let disp = require("../../../../../utils/broadcast");
import TIM from 'tim-wx-sdk';
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
		openCamera(){
			var me = this;
			wx.chooseImage({
				count: 1,
				sizeType: ["original", "compressed"],
				sourceType: ["camera"],
				success(res){
					me.upLoadImage(res);
				}
			});
		},

		sendImage(){
			var me = this;
			wx.chooseImage({
				count: 1,
				sizeType: ["original", "compressed"],
				sourceType: ["album"],
				success(res){
					me.upLoadImage(res);
				},
			});
		},

		isGroupChat(){
			return this.data.chatType == msgType.chatType.CHAT_ROOM;
		},

		getSendToParam(){
			return this.isGroupChat() ? this.data.username.groupId : this.data.username.your;
		},

		upLoadImage(res){
			var me = this;
			var tempFilePaths = res.tempFilePaths;
			wx.getImageInfo({
				src: res.tempFilePaths[0],
				success(r){
                    let message = tim.createImageMessage({
                        to: 'user1',
                        conversationType: TIM.TYPES.CONV_C2C,
                        payload: {
                            file: res
                        },
                        onProgress: function(event) { console.log('file uploading:', event) }
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
                    me.triggerEvent(
                        "newImageMsg",
                        {
                            msg: message,
                            type: TIM.TYPES.MSG_IMAGE
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
});
