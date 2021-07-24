const express = require('express');
const fileUploader = require('../middleware/file-upload');
const {
  getProducts,
  getSingleProduct,
  addProduct,
  addVariants
} = require('../routes/products.route');

const productRouter = express.Router();

productRouter
  .get('', getProducts)
  .get('/:id', getSingleProduct)
  .post('', fileUploader('media', 'products/', true), addProduct)
  .post('/variants/:id', fileUploader('media', 'products/', true), addVariants);

module.exports = productRouter;