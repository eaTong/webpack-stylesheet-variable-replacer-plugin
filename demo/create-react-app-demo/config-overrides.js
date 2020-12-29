const WebpackVariableReplacer = require('webpack-stylesheet-variable-replacer-plugin');

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.plugins.push(new WebpackVariableReplacer({
    htmlFileName: 'index.html', // if your application has a html file , It's used for inject javascript file.
    publicPath: config.output.publicPath, // as you need to inject javascript file , this is path prefix for visite the file for replace variable.
    matchVariables: { // It's a key-value Object , key is only alias for your variable , such as I use 'main' for main color I use in application.
      // notice that value is the original value in your style, not target you want to replace.
      main: '#282c34',
    }
  }));
  return config;
}
