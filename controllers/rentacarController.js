const utilities = require('../utilities/');
const rentacarModel = require('../models/rentacarModel');
const inventory = require('../models/inventoryModel')
const rentacarController = {}

rentacarController.buildRentacar = async (req, res, next) => {
  const nav = await utilities.getNav();
  const forRentList = await rentacarModel.getInventoryForRent();
  const rentList = utilities.buildRentList(forRentList);

  res.render('rentacar/dashboard', {
    title: 'Choose Rent a Car',
    nav,
    rentList,
    errors: null,
  })
}

rentacarController.getRentacar = async (req, res, next) => {
  const nav = await utilities.getNav()
  const vehicle = await inventory.getInventoryById(req.params.invId)
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
  const { account_id, inv_id, start_date, days, inv_price_day } = req.body
  const result = await rentacarModel.insertNewRent(account_id, inv_id, start_date, days, days * inv_price_day)
  const nav = await utilities.getNav()

  if (result) {
    const forRentList = await rentacarModel.getInventoryForRent();
    const rentList = utilities.buildRentList(forRentList);
    
    req.flash('notice', 'Rent created successfully')
    res.status(201).render('rentacar/dashboard', {
      title: 'Rent a Car',
      nav,
      rentList,
      errors: null
    })
  } else {
    const vehicle = await inventory.getInventoryById(inv_id)
    const detail = await utilities.buildProductDetail(vehicle)

    res.status(501).render('rentacar/vehicle', {
      title: 'Rent a Car',
      nav,
      detail,
      inv_id,
      account_id,
      start_date,
      days,
      inv_price_day,
      total_cost: days * inv_price_day,
      errors: null
    })
  }
}

module.exports = rentacarController;