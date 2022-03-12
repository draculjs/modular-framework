const {IgnorePlugin} = require("webpack")

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    plugins: [
      new IgnorePlugin({
        resourceRegExp: /moment$/,
      })
    ]
  },
  chainWebpack: (config) => {
    config.module
        .rule('gql')
        .test(/\.(graphql|gql)$/)
        .use('graphql-tag/loader')
        .loader('graphql-tag/loader')
        .end();
  },

}
