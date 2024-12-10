const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const accountController = require('../controllers/accountController')
const registerValidate = require('../utilities/accountValidation')

router.get('/', utilities.checkLogin, accountController.buildManagement)
router.get('/login', utilities.handleErrors(accountController.buildLogin))
router.get('/register', utilities.handleErrors(accountController.buildRegister))
router.get('/logout', utilities.logout)
router.get('/edit', utilities.checkLogin, utilities.handleErrors(accountController.buildEdit))
router.post('/sign-up', registerValidate.registrationRules(), registerValidate.checkRegisterData, utilities.handleErrors(accountController.registerAccount))
router.post('/login', registerValidate.loginRules(), registerValidate.checkLoginData, utilities.handleErrors(accountController.loginAccount))
router.post('/update', registerValidate.updateRules(), registerValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))
router.post('/update-password', registerValidate.passwordRules(), registerValidate.checkPasswordData, utilities.handleErrors(accountController.updatePassword))

module.exports = router