const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const accountController = require('../controllers/accountController')
// const { route } = require('./static')
const registerValidate = require('../utilities/accountValidation')

router.get('/login', utilities.handleErrors(accountController.buildLogin))
router.get('/register', utilities.handleErrors(accountController.buildRegister))
router.post('/sign-up', registerValidate.registrationRules(), registerValidate.checkRegisterData, utilities.handleErrors(accountController.registerAccount))

module.exports = router