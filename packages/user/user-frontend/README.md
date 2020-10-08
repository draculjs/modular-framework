# ci-user-module
User module made with Vue + Vuetify + i18n + GraphqlClient.  

## Install
```
npm i --save @ci-user-module/frontend
```

## Counterpart
@ci-user-module/api

## Features
- MultiLang: en, es, pt
- Login / SignIn
- Register / SignUp
- User activation by Email
- Recovery Password
- Profile Management
- Profile: Change Avatar
- Profile: Change Password
- User Management
- Group Management
- Role Management
- Dashboard: All about users
- Dashboard: Users Audit
- Dashboard: Sessions by user
- Dashboard: Sessions charts
- Dashboard: Failed Logins

## Roadmap
- Google Login
- Facebook Login
- Github Login
- Improve dashboard
- Sessions details
- Audit details
- ... We are listen ideas

## misc
- Storybook
- Test with jest

# Requisites
- store
- i18n
- vuetify
- apollo client
- router

## DEPENDENCIES
```
  "dependencies": {
    "apollo-cache-inmemory": "^1.6.6",
    "apollo-client": "^2.6.10",
    "apollo-link": "^1.2.14",
    "apollo-link-error": "^1.1.13",
    "apollo-upload-client": "^13.0.0",
    "chart.js": "^2.9.3",
    "chartjs-plugin-labels": "^1.1.0",
    "core-js": "^3.6.5",
    "graphql": "^15.0.0",
    "jwt-decode": "^2.2.0",
    "moment": "^2.26.0",
    "moment-timezone": "^0.5.31",
    "vue": "^2.6.11",
    "vue-chartjs": "^3.5.0",
    "vue-i18n": "^8.18.1",
    "vue-map-chart": "0.0.2",
    "vue-router": "^3.3.2",
    "vuetify": "^2.2.11",
    "vuex": "^3.4.0"
  }
```

## DEV DEPENDENCIES
```
    devDependencies{
        "graphql-tag": "^2.10.3",
        "deepmerge": "^4.2.2"
    }
```

## vue.config.js
Add gql loader
```
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  chainWebpack: (config) => {
    config.module
        .rule('gql')
        .test(/\.(graphql|gql)$/)
        .use('graphql-tag/loader')
        .loader('graphql-tag/loader')
        .end();
  }
}
```

-----------------------------------------------------------------------------

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Storybook
```
npm run storybook
```
