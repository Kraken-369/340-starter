const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const classificationController = require('../controllers/classificationController')

router.get('/add/classification', classificationController.buildRegister)
router.post('/add-classification', utilities.handleErrors(classificationController.registerClassification))

module.exports = router