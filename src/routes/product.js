const express = require('express');
const productController = require('../controllers/product')
const { authenticate, authorize } = require('../helpers/auth')

const router = express.Router();
// const redisGate = require('../helpers/redis')

router
    .get('/getall', authenticate, authorize, productController.getAll)
    .get('/getdetail/:id', authenticate, authorize, productController.getDetail)
    .post('/insert', authenticate, authorize, productController.insert)
    .put('/update/:id', authenticate, authorize, productController.update)
    .delete('/delete/:id', authenticate, authorize, productController.delete)

module.exports = router;