const utilities = require('../utilities/');
const rentacarModel = require('../models/rentacarModel');
const inventory = require('../models/inventoryModel')
const rentacarController = {}

rentacarController.buildRentacar = async (req, res, next) => {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const forRentList = await rentacarModel.getInventoryForRent();
  const rentList = await utilities.buildRentList(forRentList);

  res.render('rentacar/dashboard', {
    title: 'Choose Rent a Car',
    nav,
    classificationList,
    rentList,
    errors: null,
  })
}

rentacarController.getRentacar = async (req, res, next) => {
  const nav = await utilities.getNav();
  const vehicle = await inventory.getInventoryById(req.params.invId);
  const detail = await utilities.buildProductDetail(vehicle)

  res.render('rentacar/vehicle', {
    title: 'Rent a Car',
    nav,
    detail,
    inv_price_day: await vehicle.inv_price_day,
    inv_id: req.params.invId,
    account_id: res.locals.accountData.account_id,
    errors: null,
  })
}

rentacarController.newRent = async (req, res, next) => {
  const nav = await utilities.getNav();
  const { inv_id, account_id, start_date, days, total_cost } = req.body
  const changeStatus = await rentacarModel.changeCarStatus(inv_id, false)
  const result = await rentacarModel.insertNewRent(inv_id, account_id, start_date, days, total_cost)

  if (changeStatus &&result) {
    req.flash('notice', 'Rent created successfully')
    res.redirect('/rentacar/dashboard', {
      title: 'Rent a Car',
      nav,
      errors: null
    })
  } else {
    res.redirect('/rentacar/dashboard', {
      title: 'Rent a Car',
      nav,
      inv_id,
      account_id,
      start_date,
      days,
      total_cost,
      errors: null
    })
  }
}

module.exports = rentacarController;