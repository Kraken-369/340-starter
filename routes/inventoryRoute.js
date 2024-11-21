const express = require('express')
const router = new express.Router()
const inventoryController = require('../controllers/inventoryController')

router.get('/type/:classificationId', inventoryController.buildByClassificationId)

module.exports = router