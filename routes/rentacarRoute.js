const express = require('express')
const router = express.Router()
const rentacar = require('../controllers/rentacarController')

router.get('/', rentacar.buildRentacar)
router.get('/:invId', rentacar.getRentacar)

module.exports = router;