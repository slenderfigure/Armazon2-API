const sku = productName => {
  const LIMIT = 7;
  let initial = productName[0];
  let ending = productName[productName.length - 1];
  let code = '';

  code = [...Array(LIMIT - 2).keys()].map(() => {
    let needle = [
      Math.floor(Math.random() * (57  - 48 + 1) ) + 48,
      Math.floor(Math.random() * (122 - 97 + 1) ) + 97,
      Math.floor(Math.random() * (57  - 48 + 1) ) + 48,
      Math.floor(Math.random() * (122 - 97 + 1) ) + 97,
      Math.floor(Math.random() * (57  - 48 + 1) ) + 48,
      Math.floor(Math.random() * (122 - 97 + 1) ) + 97
    ];

    return String.fromCharCode(needle[Math.floor(Math.random() * needle.length)])
  }).join('');

  return (initial + code + ending).toUpperCase();
}

module.exports = sku;