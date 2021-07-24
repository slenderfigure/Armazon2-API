const fs = require('fs/promises');
const mysqlDB = require('../db/dbh');
const productFormatter = require('../utils/product-formatter');
const paginationDetails = require('../utils/pagination');
const saveProductVariant = require('../utils/save-product-variant');
const saveProductMedia = require('../utils/save-product-media');
const HttpError = require('../utils/https-error');
const slug = require('../utils/slug');

const SERVER_ERROR = 'Unable to complete the request';
const NOT_FOUND = 'No records found';
const EXISTING_PRODUCT = 'Product with this name already exists';

const getProducts = async (req, res) => {
  try {
    const conn = await mysqlDB.connect();
    const productsQ = 'CALL spGetProducts(?,?);';
    const countQ = `SELECT COUNT(id) as count FROM tbl_products;`;
    
    const limit = !isNaN(+req.query.limit) && (+req.query.limit > 0)
      ? +req.query.limit : null;
    const offset = !isNaN(+req.query.page) && (+req.query.page > 0)
      && ((+req.query.page - 1) * limit)
      ? (+req.query.page - 1) * limit : null;

    const [[ count ]] = await conn.query(countQ);
    const [ resultset ] = await conn.query(productsQ, [ limit, offset ]);
    const products = await productFormatter(resultset);

    res.send({
      ...paginationDetails(count.count, limit, +req.query.page),
      products
    });

    await conn.end();
  } catch (e) {
    // console.log(e);
    res.status(500).send({ error: SERVER_ERROR });
  }
}

const getSingleProduct = async (req, res) => {
  try {
    const conn = await mysqlDB.connect();
    const productQ = 'CALL spGetProduct(?)';
    const [ resultset ] = await conn.query(productQ, [ req.params.id ]);
    const product = await productFormatter(resultset);
 
    if (!product[0]) throw new HttpError(NOT_FOUND, 404);

    res.send(product[0]);

    await conn.end();
  } catch (e) {
    const message = e.code === 404 ? e.message : SERVER_ERROR;
    const code = !isNaN(e.code) ? e.code : 500;

    // console.log(e.message);
    res.status(code).send({ error: message });
  }
}

const addProduct = async (req, res) => {
  try {
    /* Validate Fields */
    const requiredFields = [
      'name', 'vendor', 'description', 
      'unitPrice', 'category1'
    ];
  
    for (let field of requiredFields) {
      if (!req.body[field]) {
        throw new HttpError(`Missing Information: [${field}]`, 400);
      }
    }

    const conn = await mysqlDB.connect();
    const productQ = `CALL spAddProduct(?,?,?,?,?,?,?,?,?);`;
    const [[[ productId ]]] = await conn.execute(productQ, [ 
      req.body.name,
      slug(req.body.name),
      req.body.vendor,
      req.body.description,
      +req.body.unitPrice,
      +req.body.minPrice || +req.body.unitPrice,
      +req.body.maxPrice || +req.body.unitPrice,
      +req.body.category1,
      +req.body.category2 || null
    ]);

    // Save product variants & media
    await saveProductVariant(conn, req.body.variants, productId.id ); 
    await saveProductMedia(conn, req.files, req.body.mediaData, productId.id, null);

    res.send({ success: true });

    await conn.end();
  } catch (e) {
    const code = !isNaN(e.code) ? e.code : 500;
    const message = (e.code === 400) 
      ? e.message 
      : (e.code === 'ER_DUP_ENTRY')
      ? EXISTING_PRODUCT
      : SERVER_ERROR;
    
    /** Delete saved media */
    for (file of req.files) {
      await fs.unlink(file.path);
    }

    // console.log(e);
    res.status(code).send({ error: message });
  }
}

const addVariants = async (req, res) => {
  try {
    const variants = JSON.parse(req.body.variants);

    if (!variants || !variants.options || !variants.combinations) {
      throw new HttpError(`No variants provided`, 400);
    }

    const conn = await mysqlDB.connect();
    const productQ = 'SELECT name FROM tbl_products WHERE id = ?;';
    const [[ product ]] = await conn.execute(productQ, [ req.params.id ]);

    if (!product) throw new HttpError(NOT_FOUND, 404);

    /** Subject to change once variant images get added */
    await saveProductVariant(conn, req.body.variants, req.params.id);

    res.send({ success: true });

    await conn.end();
  } catch (e) {
    const message = e.code === 400 ? e.message : SERVER_ERROR;
    const code = !isNaN(e.code) ? e.code : 500;

    /** Delete saved media */
    for (file of req.files) {
      await fs.unlink(file.path);
    }

    // console.log(e.message);
    res.status(code).send({ error: message });
  }
}

module.exports = {
  getProducts,
  getSingleProduct,
  addProduct,
  addVariants
}