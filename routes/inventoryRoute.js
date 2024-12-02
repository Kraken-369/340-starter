const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const validations = require('../utilities/inventoryValidation')
const inventoryController = require('../controllers/inventoryController')

router.get('/management', inventoryController.getManagement)
router.get('/add/vehicle', inventoryController.buildAddInventory)
router.get('/type/:classificationId', inventoryController.buildByClassificationId)
router.get('/detail/:inv_id', inventoryController.buildDetailPage)
router.post('/add-vehicle', validations.rules(), validations.checkDatas, utilities.handleErrors(inventoryController.registerNewVehicle))

module.exports = router