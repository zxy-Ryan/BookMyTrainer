Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#E67E22",
    list: [{
      pagePath: "/pages/index/firstpage/firstpage",
      iconPath: "/images/icons8-home-page-64.png",
      selectedIconPath: "/images/icons8-home-page-64-selected.png",
      text: "首页"
    },{
      pagePath:  "/pages/trainers-intro/Introduction",
        iconPath: "/images/icons8-task-64.png",
        selectedIconPath:"/images/icons8-task-64-selected.png",
      text: "教练"
    },{
      pagePath: "/pages/index/index",
      iconPath: "/images/icons8-customer-64.png",
      selectedIconPath: "/images/icons8-customer-64-selected.png",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log("到这里",data)
      // console.log("url到这里", data, this, selected)
      // wx.navigateTo({ url: data.path, })
      // wx.navigateTo({
      //   url: "/miniprogram/pages/trainers/Introduction",
      // })



      // wx.switchTab({
      //   url: url,
      //   success(res) {
      //     let page = getCurrentPages().pop();
      //     if (page == undefined || page == null) {
      //       return
      //     }
      //     page.onLoad();
      //   }
      // })
      // wx.switchTab({url})
      wx.switchTab({
        url: url,
        success: function (e) {
          let page = getCurrentPages().pop();
          console.log('page',page)
          if (page == undefined || page == null) return;
        }
      })
      




      this.setData({
        selected: data.index
      })
      
    },
    onShow: function () {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }

  },


  
  
})