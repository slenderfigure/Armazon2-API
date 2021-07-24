const sku = require('./sku');

const saveProductVariant = async (conn, variants, productId) => {
  if (!variants) return;

  variants = typeof variants === 'string' ? JSON.parse(variants) : variants;

  const optionsQ = `INSERT INTO tbl_option_values
  (optionId, productId, value, colorCode) VALUES(?,?,?,?);`;
  const variantsQ = `CALL spAddProductVariant(?,?,?,?,?,?,?,?);`;

  for (let option of variants.options) {
    await conn.execute(optionsQ, [
      option.option,
      productId,
      option.value,
      option.colorCode || null
    ]);
  }

  for (let combination of variants.combinations) {
    await conn.execute(variantsQ, [
      productId,
      combination.option1 || null,
      combination.option2 || null,
      combination.option3 || null,
      combination.name,
      sku(combination.name),
      combination.price,
      combination.stock
    ]);
  }
}

module.exports = saveProductVariant;