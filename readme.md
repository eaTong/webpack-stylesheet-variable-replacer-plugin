## webpack-stylesheet-variable-replacer-plugin
easy to change css variable with only one function:`window.replaceVariable`,
config example:
[react-starter](https://github.com/eaTong/react-starter)

### how to (3 steps)

- **step1** import plugin 

> const VariableReplacerPlugin =require('webpack-stylesheet-variable-replacer-plugin'); 

- **step2** define plugin in webpack plugin config

> new VariableReplacerPlugin({matchVariables: {main: '#456789'}})

- **step3** call function anywhere you like

> window.replaceStyleVariable({main:'#987654'})

## zh-cn (中文说明)

### 简单三步实现网页换肤功能

- **第一步** 引入包 

> const VariableReplacerPlugin =require('webpack-variable-replacer-plugin'); 

- **第二步** 定义webpack plugin

> new VariableReplacerPlugin({matchVariables: {main: '#456789'}})

- **第三步** 任何地方调用方法实现换肤

> window.replaceStyleVariable({main:'#987654'})
