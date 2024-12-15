const express = require('express')
const router = express.Router()
const rentacar = require('../controllers/rentacarController')
const validate = require('../utilities/rentacarValidation')
const utils = require('../utilities/')

router.get('/', utils.handleErrors(rentacar.buildRentacar))
router.get('/:invId', utils.handleErrors(rentacar.getRentacar))
router.post('/proceed', validate.rules(), validate.checkInputs, utils.handleErrors(rentacar.newRent))

module.exports = router;