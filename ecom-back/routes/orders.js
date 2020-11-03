const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers')

/* GET ALL ORDERS. */
router.get('/', (req, res) => {
  database.table('orders_details as od')
    .join([
      {
        table: 'orders as o',
        on: 'o.id = od.order_id'
      },
      {
        table: 'products as p',
        on: 'p.id = od.product_id',
      },
      {
        table: 'users as u',
        on: 'u.id = o.user_id'
      }
    ])
    .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username'])
    .sort({id: 1}) // this line is to make the orders display from ascending order and -1 will do the opposite
    .getAll() // Don't forget the .getAll() or .get() must come after all functions but before the .then() function
    .then(orders => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({message: 'No orders found'});
      }
    }).catch(err => console.log(err));

})

/* GET SINGLE ORDERS */
router.get('/:id', (req, res) => {
  const orderId = req.params.id;
  
  database.table('orders_details as od')
    .join([
      {
        table: 'orders as o',
        on: 'o.id = od.order_id'
      },
      {
        table: 'products as p',
        on: 'p.id = od.product_id',
      },
      {
        table: 'users as u',
        on: 'u.id = o.user_id'
      }
    ])
    .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username'])
    .filter({'o.id': orderId})
    .getAll() // Don't forget the .getAll() or .get() must come after all functions but before the .then() function
    .then(orders => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({message: `No orders found with orderId ${orderId}`});
      }
    }).catch(err => console.log(err));
})


/* PLACE A NEW ORDER */
router.post('/new', (req, res) => {
  
  let {userId, products} = req.body;

  console.log(userId, products)






})

module.exports = router;
