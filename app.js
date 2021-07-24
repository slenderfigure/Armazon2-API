const express = require('express');
const path = require('path');

/** Start Express **/
const app = express();

/** Body Parser **/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Set Response Headers **/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4200');
  res.setHeader(
    'Access-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'
  );
  next();
});

/** Static Image route **/
// app.use('/images/products', express.static(path.join(__dirname, 'uploads/products')));

/** Static Video route **/
app.use('/videos/products', express.static(path.join(__dirname, 'uploads/products')));

/** Mount Routes **/ 
app.use('/images', require('./src/controllers/images.ctrl'));
app.use('/armazon2/api/products', require('./src/controllers/products.ctrl'));

module.exports = app;