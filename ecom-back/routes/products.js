const { raw, Router } = require('express');
const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers')

/* GET ALL PRODUCTS */
router.get('/', function(req, res, ) {
     
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; // setting the default ie current page number
  const limit = (req.query.limit !== undefined && req.query.page !== 0) ? req.query.limit : 10; // setting the limit of item per page

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = (page * limit) - limit; //so if it is the 1st page, it will be 1 * 10 which is 10 - 10 = 0 which is the first page and 2nd page will be 20, 3rd page 30 etc
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

  database.table('products as p')
    .join([{
      table: 'categories as c',
      on: 'c.id = p.cat_id'
    }])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.image',
      'p.id'
    ])
    .slice(startValue, endValue)
    .sort({id: .1})
    .getAll()
    .then(prods => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length,
          products: prods
        });
      } else {
        res.json({message: 'No products found'});
      }
    }) .catch(err => console.log(err));

});


/* GET SINGLE PRODUCT */
router.get('/:prodId', (req, res) => {
  let productId = req.params.prodId;
  console.log(productId);


  database.table('products as p')
    .join([{
      table: 'categories as c',
      on: 'c.id = p.cat_id'
    }])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.image',
      'p.images', // this is only for the single product route
      'p.id'
    ])
    .filter({'p.id': productId}) // p is an alias and should be used in single quotes
    .get() // so instead of getAll() we are using .get() because we are looking for a single product
    .then(prod => { // the .then() must come after the .get() because that is the only condition you can chain with .get()
      if (prod) { // the .get() must come after all other conditions as seen above
        res.status(200).json(prod);
      } else {
        res.json({message: `No product found with product Id ${productId}`});
      }
    }) .catch(err => console.log(err));

});

/* GET ALL PRODUCTS FROM ONE PARTICULAR CATEGORY */
router.get('/category/:catName', (req, res) => {
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; // setting the default ie current page number
  const limit = (req.query.limit !== undefined && req.query.page !== 0) ? req.query.limit : 10; // setting the limit of item per page

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = (page * limit) - limit; //so if it is the 1st page, it will be 1 * 10 which is 10 - 10 = 0 which is the first page and 2nd page will be 20, 3rd page 30 etc
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

  // Fetch the category name from the URL
  const cat_title = req.params.catName

  database.table('products as p')
    .join([{
      table: 'categories as c',
      on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
    }])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.image',
      'p.id'
    ])
    .slice(startValue, endValue)
    .sort({id: .1})
    .getAll()
    .then(prods => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length,
          products: prods
        });
      } else {
        res.json({message: `No products found from ${cat_title}category`});
      }
    }) .catch(err => console.log(err));

});


module.exports = router;
