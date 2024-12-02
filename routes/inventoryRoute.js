const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const inventoryController = require('../controllers/inventoryController')

router.get('/management', inventoryController.getManagement)
router.get('/add/vehicle', inventoryController.buildAddInventory)
router.get('/type/:classificationId', inventoryController.buildByClassificationId)
router.get('/detail/:inv_id', inventoryController.buildDetailPage)
router.post('/add-vehicle', utilities.handleErrors(inventoryController.registerNewVehicle))

module.exports = router