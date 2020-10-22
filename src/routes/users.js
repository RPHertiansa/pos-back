const express = require('express');
const usersController = require('../controllers/users')
const { authenticate, authorize } = require('../helpers/auth')

const router = express.Router();

router
    // Register
    .post('/register',  usersController.register)
    // Login
    .post('/login', usersController.login)
    // Refresh Token
    .post('/refreshToken', usersController.renewToken)
    // Logout
    .post('/logout/:id', usersController.logout)
    // Forgot Password
    .post('/ForgotPassword', usersController.ForgotPassword)
    // Send New Password
    .post('/newPassword/:userkey', usersController.newPassword)
    // Verify Token
    .get('/verify/:token', usersController.verify)
    // Get All
    .get('/getall', authenticate, authorize, usersController.getAll)
    // Get All Detail
    .get('/getDetail/:id', authenticate, authorize, usersController.getDetail)
module.exports = router;