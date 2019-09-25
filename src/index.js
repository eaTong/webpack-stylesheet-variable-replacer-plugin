'use strict';
const {extractVariableSelection, getScriptTemplate} = require('./utils');
const defaultOption = {
  fileName: 'webpack-variable-replacer-[hash].js',
  matchVariables: {},
  publicPath: '',
  htmlFileName: 'index.html',
  buildPath: ''
};

class VariableReplacer {
  constructor(options) {
    this.options = {...defaultOption, ...options};
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('VariableReplacer', (compilation, callback) => {
      const assets = compilation.assets;
      const {matchVariables} = this.options;
      let templateString = '';
      Object.keys(assets).forEach((key) => {
        if (/\.css$/.test(key)) {
          const styleAsset = assets[key];
          templateString += extractVariableSelection(styleAsset.children ? styleAsset.children[0]._value : assets[key]._value, matchVariables);
        }
      });
      const {fileName, buildPath} = this.options;
      const output = `${buildPath}${fileName}`.replace('[hash]', compilation.hash);
      templateString = getScriptTemplate(matchVariables, templateString);
      compilation.assets[output] = {
        source: () => templateString,
        size: () => templateString.length
      };
      this.injectToHTML(compilation);
      callback();
    });
  }

  injectToHTML(compilation) {
    const {publicPath, fileName, htmlFileName} = this.options;
    const htmlAsset = compilation.getAsset(htmlFileName);
    const htmlTemp = htmlAsset.source.source().replace(`</body>`, `<script type="text/javascript" src="${publicPath + fileName}"></script></body>`);
    compilation.assets[htmlFileName] = {
      source: () => htmlTemp,
      size: () => htmlTemp.length
    }
  }
}

module.exports = VariableReplacer;
