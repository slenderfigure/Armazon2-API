const path = require('path');
const sharp = require('sharp');

const fetchImage = async (req, res) => {
  try {
    let dir = path.join('uploads', req.params.dir, req.params.name);
    let image = await sharp(dir)
    let meta = await image.metadata();
    let buffer = await image
      .resize({ 
        width: +req.params.s || meta.width,
        fit: 'contain'
      })
      .webp()
      .toBuffer();

    res.contentType('image/jpeg').send(buffer);
  } catch (e) {
    res.status(404).send(); 
  }
}

module.exports = fetchImage;