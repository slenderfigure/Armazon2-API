const express = require('express');
const getProductImage = require('../routes/images.route');

const imagesRouter = express.Router();

imagesRouter.get('/:dir/:s?/:name', getProductImage);

module.exports = imagesRouter;