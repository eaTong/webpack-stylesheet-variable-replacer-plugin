## webpack-stylesheet-variable-replacer-plugin
![http://eatong.oss-cn-beijing.aliyuncs.com/f29b0bd6-3c90-477d-8d77-518c142cf4e9.gif](http://eatong.oss-cn-beijing.aliyuncs.com/f29b0bd6-3c90-477d-8d77-518c142cf4e9.gif)

easy to change css variable with only one function:`window.replaceVariable`,
config example:
[react-starter](https://github.com/eaTong/react-starter)

### how to (3 steps)
- Step1: import plugin in your webpack.config.js(don't forget to install plugin).

``` javascript
const WebpackVariableReplacer = require('webpack-stylesheet-variable-replacer-plugin'); 
```

- step:2: config your plugin: 

``` javascript
module.exports = {
  plugins:[
    // ... your plugin
    new WebpackVariableReplacer({
      htmlFileName: 'index.html', // if your application has a html file , It's used for inject javascript file.
      publicPath: webContextRoot, // as you need to inject javascript file , this is path prefix for visite the file for replace variable.
      matchVariables: { // It's a key-value Object , key is only alias for your variable , such as I use 'main' for main color I use in application.
        // notice that value is the original value in your style, not target you want to replace.
        main: '#33ab9a',
        mainHover: '#54b8a7',
      }
    }),
  ]
}
```



- step3: call function in anywhere in your code.

``` javascript
window.replaceStyleVariable && window.replaceStyleVariable({main: 'blue',mainHover:'red'});
```

This step can be called any where (plugin has been injected to the html file ). The arguments need only one which is the stylesheet variable you want to replace to . Such as you want to change `main` to blue color , your argument will be : '{main:"blue"}',the key for this argument should math your config (step2).
## zh-cn (中文说明)

### 简单三步实现网页换肤功能

- **第一步** 引入包 

> const VariableReplacerPlugin =require('webpack-variable-replacer-plugin'); 

- **第二步** 定义webpack plugin

> new VariableReplacerPlugin({matchVariables: {main: '#456789'}})

- **第三步** 任何地方调用方法实现换肤

> window.replaceStyleVariable({main:'#987654'})
