const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const validations = require('../utilities/inventoryValidation')
const inventoryController = require('../controllers/inventoryController')

router.get('/', inventoryController.buildManagementView)
router.get('/add/vehicle', inventoryController.buildAddInventory)
router.get('/edit/:invId', inventoryController.buildEditInventory)
router.get('/type/:classificationId', inventoryController.buildByClassificationId)
router.get('/detail/:inv_id', inventoryController.buildDetailPage)
router.get('/getInventory/:classificationId', utilities.handleErrors(inventoryController.getInventoryJSON))
router.get('/delete/:invId', utilities.handleErrors(inventoryController.buildDeleteConfirmInventory))
router.post('/add-vehicle', validations.rules(), validations.checkDatas, utilities.handleErrors(inventoryController.registerNewVehicle))
router.post('/update/', validations.rules(), validations.checkUpdateData, utilities.handleErrors(inventoryController.updateInventory))
router.post('/delete/', utilities.handleErrors(inventoryController.deleteVehicle))

module.exports = router