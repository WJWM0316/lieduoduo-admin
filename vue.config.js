const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  lintOnSave: true,
  productionSourceMap: false,
  configureWebpack: {
    entry: {
      vendors: ['vue', 'vue-router', 'axios', 'vuex']
    },
    resolve: {
      alias: {
        PACKJSON: resolve('./'),
        '@': resolve('src'),
        IMAGES: resolve('src/assets/images'),
        UTIL: resolve('src/util'),
        API: resolve('src/api'),
        STORE: resolve('src/store'),
        COMPONENTS: resolve('src/components'),
        CONFIGS: resolve('src/configs'),
        STYLES: resolve('src/styles'),
        ICONFONT: resolve('src/assets/iconfont'),
        FILTERS: resolve('src/filters'),
        COLORS: resolve('src/eleui/colors')
      }
    },
    plugins: []
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')
  }
}
// 当 prefetch 插件被禁用时，你可以通过 webpack 的内联注释手动选定要提前获取的代码区块
// import(/* webpackPrefetch: true */ './someAsyncComponent.vue')
