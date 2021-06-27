//index.js
const latitude = 34.746046;
const longitude = 113.659618;
const scale = 9.5;
Page({
  data: {
    avatarUrl: "./user-unlogin.png",
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    openid: "",
    showLogin: true,
    //
    latitude,
    longitude,
    mapWidth: "",
    mapHeight: "",
    scale,
    markers: [],
    keyword: "",
    activeMarker: {},
    userInfo: null,
  },

  onLoad: function ({ scene }) {
    if (Date.now() > new Date("2021-06-22 12:30").getTime()) {
      this.setData({
        showLogin: false,
      });
    }
    console.log(scene);

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
    this.onLogin(scene);
  },

  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: "展示用户信息", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const { userInfo } = res;
        const alreadyInfo = this.data.userInfo;
        this.setData({
          avatarUrl: userInfo.avatarUrl,
          hasUserInfo: true,
          userInfo: {
            ...alreadyInfo,
            ...userInfo,
          },
        });
        this.saveUserInfo({
          userInfo: { ...alreadyInfo, ...userInfo },
        });
      },
      fail(e) {
        console.log(e, "======");
      },
    });
  },

  onCancel() {
    wx.showToast({
      title: "此网站只能扫码登录",
      icon: "none",
    });
  },

  onLogin(scene) {
    wx.login({
      success: (res) => {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: "https://www.moluoyingxiong.tech/bot-server/getOpenId",
            data: {
              code: res.code,
            },
            success: (user) => {
              console.log(user.data, "<-----user.data");
              const { openid } = user.data;
              const alreadyInfo = this.data;
              this.setData({
                userInfo: {
                  ...alreadyInfo,
                  openid,
                  scene,
                },
              });
            },
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
  },

  saveUserInfo(userInfo) {
    wx.request({
      url: "https://www.moluoyingxiong.tech/bot-server/saveUserInfo",
      method: "post",
      data: userInfo,
      success(res) {},
    });
  },

  onGetOpenid: function () {
    const { openid } = this.data.userInfo;
    this.setData({ openid });
  },
  onMyLocation() {
    wx.getLocation({
      type: "gcj02",
    }).then(({ latitude, longitude }) => {
      this.setData({
        latitude,
        longitude,
      });
    });
  },
  record() {
    wx.showToast({
      title: "功能暂未开放。",
      icon: "none",
    });
  },
  toCateDetail() {
    wx.showToast({
      title: "功能暂未开放。",
      icon: "none",
    });
  },
});
