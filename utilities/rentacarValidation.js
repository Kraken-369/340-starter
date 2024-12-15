const utils = require('.')
const { body, validationResult } = require('express-validator')
const valid = {}

valid.rules = () => {
  return [
    body('star_date')
      .not().isEmpty().withMessage('Start date is required')
      .isDate().withMessage('Start date must be a valid date')
      .custom(value => {
        const date = new Date(value)
        if (date > new Date()) {
          throw new Error('Start date cannot be in the future')
        }
        return true
      }),
    body('days')
      .not().isEmpty().withMessage('Days is required')
      .isInt({ min: 1 }).withMessage('Days must be a positive integer'),
  ]
}

valid.checkInputs = (req, res, next) => {
  const errors = validationResult(req)
  const {
    star_date,
    days,
  } = req.body

  if (!errors.isEmpty()) {
    const nav = utils.getNav()

    res.render('rentacar/vehicle', {
      title: 'Rent a Car',
      nav,
      star_date,
      days,
      errors,
    })

    return
  }

  next()
}

module.exports = valid