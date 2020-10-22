const express = require('express');
const historyController = require('../controllers/history')
const { authenticate, authorize } = require('../helpers/auth')
const redisGate = require('../helpers/redis')

const router = express.Router();

router
    .get('/getall', authenticate, authorize, redisGate.getHistory ,historyController.getAll)
    .get('/getdetail/:id', authenticate, authorize, historyController.getDetail)
    .post('/insert', authenticate, authorize, historyController.insert)
    .put('/update/:id', authenticate, authorize, historyController.update)
    .delete('/delete/:id', authenticate, authorize, historyController.delete)

module.exports = router;