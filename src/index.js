'use strict';
const {extractVariableSelection, getScriptTemplate, getRegExp} = require('./utils');
const {ConcatSource} = require("webpack-sources");
const defaultOption = {
  fileName: 'webpack-variable-replacer-[hash].js',
  matchVariables: {},
  publicPath: '',
  htmlFileName: '',// tell me where the entry html file is
  buildPath: '',
  nextSupport: false, // if your server was built by next.js , nextSupport should be true
  injectToEntry: false,// if inject functions to all entry files
  excludeEntry: null,
  specifyEntry: null
};

class VariableReplacer {
  constructor(options) {
    this.options = {...defaultOption, ...options};
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('VariableReplacer', (compilation, callback) => {
      const assets = compilation.assets;
      const {matchVariables, htmlFileName, nextSupport, injectToEntry} = this.options;
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

      if (htmlFileName) {
        compilation.assets[output] = {
          source: () => resolvedTemplateString,
          size: () => resolvedTemplateString.length
        };
        this.injectToHTML(compilation, resolvedTemplateString);
      }
      if (injectToEntry || nextSupport) {
        this.injectToEntry(compilation, resolvedTemplateString);
      }
      callback();
    });
  }

  injectToHTML(compilation) {
    const {publicPath, fileName, htmlFileName} = this.options;
    const htmlAsset = compilation.getAsset(htmlFileName);
    const htmlTemp = htmlAsset.source.source().replace(`</body>`, `<script type="text/javascript" src="${`${publicPath}${fileName}`.replace('[hash]', compilation.hash)}"></script></body>`);
    compilation.assets[htmlFileName] = {
      source: () => htmlTemp,
      size: () => htmlTemp.length
    }
  }

  injectToEntry(compilation, templateString) {
    const onlyEntryPoints = {
      entrypoints: true,
      errorDetails: false,
      modules: false,
      assets: false,
      children: false,
      chunks: false,
      chunkGroups: false
    };
    const entryPoints = compilation.getStats().toJson(onlyEntryPoints).entrypoints;
    const {excludeEntry, specifyEntry} = this.options;

    Object.keys(entryPoints).forEach(entryName => {
      var entryAssets = entryPoints[entryName].assets;
      entryAssets.forEach(assetName => {
        if (/\.js$/.test(assetName) && (!specifyEntry || getRegExp(specifyEntry).test(assetName)) && !(excludeEntry && getRegExp(excludeEntry).test(assetName))) {
          const assetSource = compilation.assets[assetName];
          if (!assetSource._hasInjected) {
            const resolvedSource = new ConcatSource(assetSource, templateString);
            resolvedSource._hasInjected = true;
            compilation.assets[assetName] = resolvedSource;
          }
        }
      })
    })
  }
}


module.exports = VariableReplacer;
