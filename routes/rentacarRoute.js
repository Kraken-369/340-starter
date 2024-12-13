const express = require('express');
const router = express.Router();
const rentacar = require('../controllers/rentacarController');

router.get('/', rentacar.buildRentacar)

module.exports = router;