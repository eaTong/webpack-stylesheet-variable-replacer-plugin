// vue.config.js
const WebpackVariableReplacer = require('webpack-stylesheet-variable-replacer-plugin')

module.exports = {
  chainWebpack: config => {
    config.plugin('webpack-stylesheet-variable-replacer-plugin').use(WebpackVariableReplacer).tap(args => {
      console.log(args)
      args[0] = {matchVariables: {main: '#42b983'}, injectToEntry: true}
      return args
    })
  }
}
