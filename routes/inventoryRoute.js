const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const validations = require('../utilities/inventoryValidation')
const inventoryController = require('../controllers/inventoryController')

router.get('/', utilities.auth(['Employee', 'Admin']), inventoryController.buildManagementView)
router.get('/add/vehicle', utilities.auth(['Employee', 'Admin']), inventoryController.buildAddInventory)
router.get('/edit/:invId', utilities.auth(['Employee', 'Admin']), inventoryController.buildEditInventory)
router.get('/type/:classificationId', inventoryController.buildByClassificationId)
router.get('/detail/:inv_id', inventoryController.buildDetailPage)
router.get('/getInventory/:classificationId', utilities.auth(['Employee', 'Admin']), utilities.handleErrors(inventoryController.getInventoryJSON))
router.get('/delete/:invId', utilities.auth(['Employee', 'Admin']), utilities.handleErrors(inventoryController.buildDeleteConfirmInventory))
router.post('/add-vehicle', utilities.auth(['Employee', 'Admin']), validations.rules(), validations.checkDatas, utilities.handleErrors(inventoryController.registerNewVehicle))
router.post('/update/', utilities.auth(['Employee', 'Admin']), validations.rules(), validations.checkUpdateData, utilities.handleErrors(inventoryController.updateInventory))
router.post('/delete/', utilities.auth(['Employee', 'Admin']), utilities.handleErrors(inventoryController.deleteVehicle))

module.exports = router