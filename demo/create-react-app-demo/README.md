# 在`create-react-app`中使用`webpack-stylesheet-variable-replacer-plugin` 

## 第一步：引入`react-app-rewired`
`create-react-app`中无法直接修改webpack配置，所以需要引入`react-app-rewired`来实现覆盖webpack配置（也有其他方案，此处只演示使用`react-app-rewired`的方式）

1、下载包 ： ` npm install react-app-rewired --save-dev`

2、 在根目录中创建文件： `config-overrides.js`;

3、 将以下文件贴入 `config-overrides.js`中
```javascript
module.exports = function override(config, env) {
  //do stuff with the webpack config...
  return config;
}
```
4、 修改`package.json`文件：
``` 
  /* package.json */
  "scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test",
+   "test": "react-app-rewired test",
    "eject": "react-scripts eject"
}
```
最终效果如下：
```json
{
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  }
```
## 第二步：配置`webpack-stylesheet-variable-replacer-plugin` 

1、安装包 ：`npm i webpack-stylesheet-variable-replacer-plugin -D`

2、在 `config-overrides.js`中引入包：
```javascript
const WebpackVariableReplacer = require('webpack-stylesheet-variable-replacer-plugin'); 
```
3、 在override方法中加入webpackVariableReplacer配置
```javascript
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
```
## 第三步 界面中加入换肤代码
```html
<button onClick={()=> window.replaceStyleVariable({main: getRandomColor()})}>replace random color</button>
```
```javascript
function getRandomColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length === 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
```
## 第四步 开始愉快的玩耍吧，没有更多了。
