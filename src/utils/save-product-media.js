const saveProductMedia = async (
  conn, 
  files,
  media, 
  productId, 
  variantId
) => {
  if (!media || !files) return;

  media = typeof media === 'string' ? JSON.parse(media) : media;

  const mediaQ = `CALL spAddProductMedia(?,?,?,?,?,?,?);`;

  for (let file of files) {
    let fileData = media.data.find(f => f.name === file.originalname);

    await conn.execute(mediaQ, [ 
      productId,
      variantId || null,
      file.fileURL,
      null, // alt file src/url
      file.mimetype.match(/image|video/)[0], // file type (image, video)
      fileData.order,
      fileData.isFeatured
    ]);
  }
}

module.exports = saveProductMedia;