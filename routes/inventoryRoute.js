const express = require('express')
const router = new express.Router()
const inventoryController = require('../controllers/inventoryController')

router.get('/', inventoryController.getInventory)
router.get('/type/:classificationId', inventoryController.buildByClassificationId)
router.get('/detail/:inv_id', inventoryController.buildDetailPage)

module.exports = router