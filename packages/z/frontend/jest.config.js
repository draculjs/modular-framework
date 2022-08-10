module.exports = {

  //setupFiles: ["./tests/setup.js"],

  "testMatch": ["**/?(*.)+(spec|test).[jt]s?(x)"],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js", "json", "jsx", "ts", "tsx", "node", "vue"
  ],

  transform: {
    // process `*.vue` files with `vue-jest`
    ".*\\.(vue)$": "vue-jest",
    // process js with `babel-jest`
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    "\\.(gql|graphql)$": "jest-transform-graphql"
  },

  transformIgnorePatterns: [
    "/node_modules/(?!vuetify|vue-map-chart|@ci)"
  ],

  preset: '@vue/cli-plugin-unit-jest'
}
