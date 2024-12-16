const utils = require('.')
const { body, validationResult } = require('express-validator')
const inventory = require('../models/inventoryModel')
const valid = {}

valid.rules = () => {
  return [
    body('start_date')
      .not().isEmpty().withMessage('Start date is required')
      .isDate().withMessage('Start date must be a valid date')
      .custom(value => {
        const date = new Date(value)
        if (date < new Date()) {
          throw new Error('Start date cannot be in the past.')
        }
        return true
      }),
    body('days')
      .not().isEmpty().withMessage('Days is required')
      .isInt({ min: 1 }).withMessage('Days must be a positive integer'),
  ]
}

valid.checkInputs = async (req, res, next) => {
  const {
    inv_id,
    account_id,
    inv_price_day,
    start_date,
    days,
    total_cost,
  } = req.body
  let errors = []
  
  errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    const vehicle = await inventory.getInventoryById(inv_id)
    const detail = await utils.buildProductDetail(vehicle)
    const nav = await utils.getNav()

    res.render('rentacar/vehicle', {
      title: 'Rent a Car',
      nav,
      detail,
      inv_id,
      account_id,
      inv_price_day,
      start_date,
      days,
      total_cost,
      errors,
    })

    return
  }

  next()
}

module.exports = valid