const utilities = require('../utilities/')
const classificationModule = require('../models/classificationModel')
const classificationController = {}

classificationController.buildRegister = async (req, res, next) => {
  let nav = await utilities.getNav()

  res.render('classification/register', {
    title: 'Add Classification',
    nav,
    errors: null,
  })
}

classificationController.registerClassification = async (req, res) => {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const registerResult = await classificationModule.registerClassification(classification_name)

  if (registerResult) {
    req.flash(
      'notice',
      `New Classification ${classification_name} was registered.`
    )
    res.status(201).render('classification/register', {
      title: 'Add Classification',
      nav,
    })
  } else {
    req.flash(
      'notice',
      'Sorry, the registration failed.'
    )
    res.status(501).render('classification/register', {
      title: 'Add Classification',
      nav,
    })
  }
}

module.exports = classificationController