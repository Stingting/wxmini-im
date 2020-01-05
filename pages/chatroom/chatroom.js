let disp = require("../../utils/broadcast");

Page({
	data: {
		username: {
			your: "user1",
		},
	},

	// options = 系统传入的 url 参数
	onLoad(options){
		// let username = JSON.parse(options.username);
		let username = {
            your: "user1",
        };
		this.setData({ username: username });
		wx.setNavigationBarTitle({
			title: username.your
		});
	},

	onUnload(){
	},

	onPullDownRefresh: function () {
	  	wx.showNavigationBarLoading();
	    this.selectComponent('#chat').getMore()
	    // 停止下拉动作
	    wx.hideNavigationBarLoading();
	    wx.stopPullDownRefresh();
  	},

});
