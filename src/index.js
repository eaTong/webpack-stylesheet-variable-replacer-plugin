'use strict';
const {extractVariableSelection, getScriptTemplate} = require('./utils');
const {ConcatSource} = require("webpack-sources");
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
      if (compilation.name === 'server' || !this.options.nextSupport) {
        Object.keys(assets).forEach((key) => {
          if (/\.css$/.test(key)) {
            const styleAsset = assets[key];
            templateString += extractVariableSelection(styleAsset.source(), matchVariables);
          }
        });
        global.templateString = templateString;
      } else {
        templateString = global.templateString;
      }
      const {fileName, buildPath} = this.options;
      const output = `${buildPath}${fileName}`.replace('[hash]', compilation.hash);
      const resolvedTemplateString = getScriptTemplate(matchVariables, templateString);
      compilation.assets[output] = {
        source: () => resolvedTemplateString,
        size: () => resolvedTemplateString.length
      };
      this.injectToHTML(compilation, resolvedTemplateString);
      callback();
    });
  }

  injectToHTML(compilation, templateString) {
    var onlyEntrypoints = {
      entrypoints: true,
      errorDetails: false,
      modules: false,
      assets: false,
      children: false,
      chunks: false,
      chunkGroups: false
    }
    var entrypoints = compilation.getStats().toJson(onlyEntrypoints).entrypoints;

    Object.keys(entrypoints).forEach(entryName => {
      var entryAssets = entrypoints[entryName].assets;
      entryAssets.forEach(assetName => {
        const assetSource = compilation.assets[assetName];
        if (!assetSource._hasInjected) {
          const resolvedSource = new ConcatSource(assetSource, templateString);
          resolvedSource._hasInjected = true;
          compilation.assets[assetName] = resolvedSource;
        }
      })
    })
  }
}

module.exports = VariableReplacer;
