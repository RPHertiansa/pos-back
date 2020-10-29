const express = require('express');
const categoryController = require('../controllers/category')
const { authenticate, authorize } = require('../helpers/auth')

const router = express.Router();

router
    .get('/getall', authenticate, authorize, categoryController.getAll)
    .get('/getdetail/:id', authenticate, authorize, categoryController.getDetail)
    .post('/insert', authenticate, authorize, categoryController.insert)
    .put('/update/:id', authenticate, authorize, categoryController.update)
    .delete('/delete/:id', authenticate, authorize, categoryController.delete)

module.exports = router;