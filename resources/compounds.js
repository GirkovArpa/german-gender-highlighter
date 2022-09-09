export default function isCompound(word) {
  const compounds = [
    "am",
    'ans',
    "an's",
    'im',
    'ins',
    "in's",
    'aufs',
    "auf's",
    'zum',
    'zur',
    'beim',
    'vom',
    'fürs',
    "für's",
    'ums',
    "um's",
    'durchs',
    "durch's"
  ];
  const regex = new RegExp('^' + compounds.join('$|^') + '$', 'i');
  return regex.test(word);
}

console.log(isCompound('Immer'));