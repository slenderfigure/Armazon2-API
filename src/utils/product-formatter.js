const formatProducts = async ([products, options, variants, media]) => {
  const _options = product => {
    return options.filter(o => o.productId === product.id)
      .map(option => option.option);
  }
  
  const _variants = product => {
    return variants.filter(v => v.productId === product.id)
      .map(variant => {
        delete variant.productId;
        return variant;
      });
  }

  const _media = product => {
    let filtered = media.filter(m => m.productId === product.id)
      .map(m => {
        delete m.productId;
        delete m.variantId;
        return m;
      });

    return {
      images: filtered.filter(file => file.mediaType === 'image'),
      videos: filtered.filter(file => file.mediaType === 'video')
    }
  }

  return products.map(product => {
    product['options']  = _options(product);
    product['variants'] = _variants(product);
    product['media']    = _media(product);
    product['images']   = product['media'].images.map(i => i.src);

    return product;
  });
}

module.exports = formatProducts;