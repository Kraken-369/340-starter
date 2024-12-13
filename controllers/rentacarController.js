const utilities = require('../utilities/');
const rentacarModel = require('../models/rentacarModel');
const rentacarController = {}

rentacarController.buildRentacar = async (req, res, next) => {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const rentList = await utilities.buildRentList([]);

  res.render('rentacar/index', {
    title: 'Rent a Car',
    nav,
    classificationList,
    rentList,
    errors: null,
  })
}

module.exports = rentacarController;