export default function isArticle(word) {
  if (word === "'ne") return true;

  if (/^jede[nmrs]?$/i.test(word)) return true;
  if (/^all?e[nmrs]?$/i.test(word)) return true;
  if (/^dies(e[nmrs]?)?$/i.test(word)) return true;
  if (/^der$|^das$|^die$|^den$|^dem$|^des$/i.test(word)) return true;
  if (/^[mkds]?ein[e']?[mnrs]?$/i.test(word)) return true;
  if (/^ihre?[mrn]?$/i.test(word)) return true;
  if (/^unser?e[nm]?$/i.test(word)) return true;
  if (/^eu[re][re]?[nmr]?$/i.test(word)) return true;
  if (/^ihr(e?[nmr])?$/i.test(word)) return true;

  const others = ['andere', 'anderem', 'anderen', 'anderer', 'anderes', 'anderm', 'andern', 'andre', 'andrem', 'andren', 'andrer', 'andres'];
  const otherRegex = new RegExp('^' + others.join('$|^') + '$', 'i');
  if (otherRegex.test(word)) return true;

  return false;
}

