const express = require('express');
const productController = require('../controllers/product')
const { authenticate, authorize } = require('../helpers/auth')

const router = express.Router();
const redisGate = require('../helpers/redis')

router
    .get('/getall', redisGate.getProduct, productController.getAll)
    .get('/getdetail/:id', productController.getDetail)
    .post('/insert', productController.insert)
    .put('/update/:id', productController.update)
    .delete('/delete/:id', productController.delete)

module.exports = router;