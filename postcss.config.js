module.exports = () => {
  return {
    plugins: {
      // ...
      'postcss-px-to-viewport': {
        // options
        unitToConvert: 'px',
        viewportWidth: 1440, //设计稿的视口宽度
        unitPrecision: 5,
        propList: ['*'],
        viewportUnit: 'vw',
        fontViewportUnit: 'vw',
        selectorBlackList: [],
        minPixelValue: 1,
        mediaQuery: true, // 媒体查询里的单位是否需要转换单位
        replace: true, // 是否直接更换属性值，而不添加备用属性
        exclude: [/views\/lives/],
        include: undefined,
        landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
        // landscapeUnit: 'vw', // 横屏时使用的单位
        // landscapeWidth: 1920 // 横屏时使用的视口宽度
      }
    }
  }
}