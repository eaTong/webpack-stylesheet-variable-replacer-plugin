const CSS_REG = /[^}]*\{[^{]*\}/g;
const RULE_REG = /(\w+-)*\w+:/;
const CSS_VALUE_REG = /(\s?[a-z0-9]+\s)*/;
const SAFE_EMPTY_REG = /\s?/;

function extractVariableSelection(styles, matchVariables) {
  styles = styles.replace(/\r|\t|\n/g, '');
  const matchVariableValues = Object.keys(matchVariables).map(item => matchVariables[item]);
  const valueKey = reverseKeyValue(matchVariables);
  const cssExpressions = styles.match(CSS_REG);
  let allExtractedVariable = '';
  const variableReg = getVariablesReg(matchVariableValues);
  if (!cssExpressions || cssExpressions.length === 0) {
    return '';
  }
  for (const expression of cssExpressions) {
    if (variableReg.test(expression)) {
      const selector = expression.match(/[^{]*/)[0];
      if (/^@.*keyframes/.test(selector)) {
        allExtractedVariable += `${selector}{${ extractVariableSelection(expression.replace(/[^{]*\{/, '').replace(/}$/, ''), matchVariables)}}`;
      } else {
        const colorRules = expression.match(combineRegs('g', RULE_REG, SAFE_EMPTY_REG, CSS_VALUE_REG, variableReg));
        if (colorRules) {
          const colorReplaceTemplates = colorRules.map(item => item.replace(variableReg, str => `VARIABLE_REPLACE_${valueKey[str.replace(/\s/g, '').replace(/0?\./, '.')]}`));
          allExtractedVariable += `${selector}{${colorReplaceTemplates.join(';')}}`;
        }
      }
    }
  }
  return allExtractedVariable;
}

function reverseKeyValue(obj) {
  const temp = {};
  Object.keys(obj).forEach(key => {
    temp[obj[key].replace(/\s/g, '').replace(/0?\./, '.')] = key;
  });
  return temp;
}

function getVariablesReg(colors) {
  return new RegExp(colors.map(i => `(${i.replace(/\s/g, ' ?').replace(/\(/g, `\\(`).replace(/\)/g, `\\)`).replace(/0?\./g, `0?\\.`)})`).join('|'));
}

function combineRegs(decorator = '', ...args) {
  const regString = args.map(item => {
    const str = item.toString();
    return `(${str.slice(1, str.length - 1)})`
  }).join('');
  return new RegExp(regString, decorator);
}

function getScriptTemplate(matchVariables, styleStr) {
  return `
    function replaceStyleVariable(replaceVariables) {
      var unionId = '${Math.random() + new Date().getTime()}';
      var option = JSON.parse('${JSON.stringify(matchVariables)}');
      for(var key in replaceVariables){
        option[key] = replaceVariables[key];
      }
      var str = '${styleStr}';
      var style = document.getElementById(unionId);
      if (!style) {
        style = document.createElement('style');
        style.id = unionId;
        document.head.appendChild(style);
      }
      for (var key in option) {
        var reg = new RegExp('VARIABLE_REPLACE_' + key+'\\\\b', 'g');
        str = str.replace(reg, option[key]);
      }
      style.innerText = str;
      
    window.resetStyle = function(){
      var style = document.getElementById(unionId);
      if(style){
        document.head.removeChild(style);
      }
    }
  };
`
}

module.exports = {extractVariableSelection, getScriptTemplate};
