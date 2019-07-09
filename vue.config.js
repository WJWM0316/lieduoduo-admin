const webpack = require("webpack");
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const resolve = dir => {
  return path.join(__dirname, dir);
};

console.log(process.env.NODE_ENV, "sdf");
module.exports = {
  lintOnSave: false,
  // 去除console
  configureWebpack: config => {
    if (process.env.NODE_ENV !== "test") {
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true, // 注释console
              drop_console: true,
              pure_funcs: ["console.log"] // 移除console
            }
          },
          sourceMap: false,
          parallel: true
        })
      );
    }
    config.entry.vendors = ["vue", "vue-router", "axios", "vuex"];
    config.resolve.alias = {
      PACKJSON: resolve("./"),
      "@": resolve("src"),
      IMAGES: resolve("src/assets/images"),
      UTIL: resolve("src/util"),
      API: resolve("src/api"),
      STORE: resolve("src/store"),
      COMPONENTS: resolve("src/components"),
      CONFIGS: resolve("src/configs"),
      STYLES: resolve("src/styles"),
      ICONFONT: resolve("src/assets/iconfont"),
      FILTERS: resolve("src/filters"),
      COLORS: resolve("src/eleui/colors")
    };
  },
  chainWebpack: config => {
    config.plugins.delete("prefetch");
  }
};
