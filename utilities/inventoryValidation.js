const utilities = require('.')
const { body, validationResult } = require('express-validator')
const validation = {}

validation.rules = () => {
  return [
    body('inv_make')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Make field is required'),
    body('inv_model')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Model field is required'),
    body('inv_year')
      .trim()
      .escape()
      .notEmpty()
      .isDecimal()
      .isLength({ min: 4 })
      .withMessage('Year field is required. Minimus need 4 digits.'),
    body('inv_price')
      .trim()
      .escape()
      .notEmpty()
      .isDecimal()
      .withMessage('Price field is required'),
    body('inv_miles')
      .trim()
      .escape()
      .notEmpty()
      .isDecimal()
      .withMessage('Miles field is required'),
    body('inv_color')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Color field is required'),
    body('classification_id')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Choose a classification is required'),
  ]
}

validation.checkDatas = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body
  let errors = []

  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    res.render('inventory/addInventory', {
      title: 'Add Classification',
      nav,
      classificationList,
      errors,
    })

    return
  }

  next()
}

validation.checkUpdateData = async (req, res, next) => {
  const {
    classification_id,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body
  let errors = []

  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)

    res.render('inventory/editInventory', {
      title: `Edit: ${inv_make} ${inv_model}`,
      nav,
      classificationList,
      errors,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })

    return
  }

  next()
}

module.exports = validation