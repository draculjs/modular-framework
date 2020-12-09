const path = require('path');
module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config, { configType }) => {

    //GRAPHQL
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      use: ['graphql-tag/loader'],
      //include: path.resolve(__dirname, '../'),
    });

    //SASS
    config.module.rules.push({
      test: /\.s[ac]ss$/i,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });



    // Return the altered config
    return config;
  },
}
