const {extractVariableSelection, getScriptTemplate, getRegExp} = require('../src/utils');

const cssStyle = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box
}

.example-line {
  display: flex;
  padding: 10px
}

.example-line .label {
  width: 10em
}

.example-line .display {
  flex: 1
}

.example-line .display.main {
  color: #456789 !important;
  background-color: rgba(0, 0, 0, 0.15);
  
}

.example-line .display.border {
  border: 1px solid #345678;
}

.example-line .display.background {
  background-color: rgba(0, 0, 0, 0.15);
  color: #fff
}
`;
//
console.log(getScriptTemplate(extractVariableSelection(cssStyle, {
  main: '#456789',
  border: '1px solid #345678',
  background: 'rgba(0, 0, 0, 0.15)'
})));


// console.log(getRegExp(['main*.js', 'vendor*', /main.*/]));
