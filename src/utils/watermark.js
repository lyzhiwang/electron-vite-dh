/**
 * 版本：0.2
 * 作者：赵梦昕
 * 使用：使用全局变量 _Wa调用toWatermark()方法
 * 参数：Watermark.toWatermark() 第一个参数请传递图片的路径或者file[0]对象，
 *      后面三个参数分别是水印元素canvas(cw)，水印图片canvas(cr)，图片的配置(img)，
 *      具体配置内容参考Watermark的config属性
 *      如果想配置输出图片的最大宽高度，请配置config.img.size
 * 基础使用：Watermark.toWatermark(url|file,callback)
 * 回调返回值：加过水印的base64图片
 * 注意：请在服务器环境下使用。
 * **/

var Watermark = {
  config: {
    cw: {
      id: 'watermark',
      el: null,
      w: 640,
      h: 390,
      ctx: null,
      font: '50px 黑体',
      color: 'rgba(100,100,100,0.5)',
      text: '该证件本产品专用',
      rotate: 31
    },
    cr: {
      id: 'repeat-watermark',
      el: null,
      w: '',
      h: '',
      ctx: null
    },
    img: {
      file: null,
      base64: null,
      el: null,
      w: '',
      h: '',
      size: 1600
    },
    lr: {
      id: 'last-watermark',
      el: null,
      w: '',
      h: '',
      ctx: null
    }
  },
  initElement: function (el, idstr) {
    var body = document.querySelector('body')
    var canvas = document.createElement(el)
    canvas.setAttribute('id', idstr)
    canvas.style.display = 'none'
    body.appendChild(canvas)
  },
  initCanvas: function (cav) {
    this.initElement('canvas', cav.id)
    cav.el = document.getElementById(cav.id)
    cav.el.width = cav.w
    cav.el.height = cav.h
    // 返回一个用于在画布上绘图的环境
    cav.ctx = cav.el.getContext('2d')
    // 画布清除
    cav.ctx.clearRect(0, 0, cav.w, cav.h)
  },
  initWatermark: function () {
    this.initCanvas(this.config.cw)
    this.config.cw.ctx.font = this.config.cw.font
    this.config.cw.ctx.rotate((-1 * this.config.cw.rotate * Math.PI) / 180)
    this.config.cw.ctx.fillStyle = this.config.cw.color
    this.config.cw.ctx.fillText(this.config.cw.text, -170, 350)
    this.config.cw.ctx.rotate((this.config.cw.rotate * Math.PI) / 180) // 坐标系还原
  },
  initRepeat: function () {
    this.initCanvas(this.config.cr)
    this.config.cr.ctx.drawImage(
      this.config.img.el,
      0,
      0,
      this.config.cr.w,
      this.config.cr.h
    )
    var pat = this.config.cr.ctx.createPattern(this.config.cw.el, 'repeat') // 在指定的方向上重复指定的元素
    this.config.cr.ctx.fillStyle = pat
    this.config.cr.ctx.fillRect(0, 0, this.config.cr.w, this.config.cr.h)
    return this.config.cr.el.toDataURL('image/jpeg')
  },
  replaceOption: function (oldOption, newOption) {
    Object.keys(newOption).forEach(function (key) {
      if (newOption[key] !== '') oldOption[key] = newOption[key]
    })
  },
  checkReport: function () {
    this.initElement('canvas', 'test')
    // 判断浏览器是否支持canvas标签
    if (document.getElementById('test').getContext('2d')) return true
    else return false
  },
  count: function (w, h) {
    this.config.img.w = w
    this.config.img.h = h

    // 等比例缩放图片
    var s = this.config.img.size
    // if (w > s) {
    //   h = (s * h) / w
    //   w = s
    // }
    // if (h > s) {
    //   w = (s * w) / h
    //   h = s
    // }

    h = (s * h) / w
    w = s
    w = (s * w) / h
    h = s
    this.config.cr.w = w
    this.config.cr.h = h
  },
  checkImg: function (img64, callback) {
    // 如果图片放大则 将图片恢复大小
    if (
      this.config.cr.w > this.config.img.w ||
      this.config.cr.h > this.config.img.h
    ) {
      this.config.lr.w = this.config.img.w
      this.config.lr.h = this.config.img.h
      var img = new Image()
      img.src = img64
      var that = this
      img.onload = function () {
        that.initCanvas(that.config.lr)
        that.config.lr.ctx.drawImage(
          img,
          0,
          0,
          that.config.lr.w,
          that.config.lr.h
        )
        callback(that.config.lr.el.toDataURL('image/jpeg'))
      }
    } else {
      callback(img64)
    }
  },
  loadImg: function (url, callback) {
    // 加载图片获取图片真实宽度和高度并等比例缩放,返回值为加过水印图片的base64
    var img = new Image()
    img.src = url
    var that = this
    img.onload = function () {
      that.config.img.el = img
      that.count(img.width, img.height)
      that.initWatermark()
      var img64 = that.initRepeat()
      // 检查图片是否放大，如果放大则还原
      that.checkImg(img64, callback)
    }
  },
  toWatermark: function (url, callback, setting) {
    if (setting.cwOption) this.replaceOption(this.config.cw, setting.cwOption)
    if (setting.crOption) this.replaceOption(this.config.cr, setting.crOption)
    if (setting.imgOption) this.replaceOption(this.config.img, setting.imgOption)

    if (!this.checkReport()) {
      alert('您的浏览器不支持canvas，请换个浏览器试试')
      return false
    }
    var that = this

    if (typeof url === 'string') {
      // 传递的是url路径
      that.loadImg(url, callback)
    } else {
      // 传递的是文件上传的file对象
      var file = url
      // 创建对象
      var fReader = new FileReader()
      // 读取图片
      fReader.readAsDataURL(file)
      // 读取图片过程
      fReader.onload = function () {
        that.loadImg(fReader.result, callback)
      }
    }
  }
}
export default Watermark
