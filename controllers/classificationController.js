const utilities = require('../utilities/')
const classificationModule = require('../models/classificationModel')
const inventoryModel = require('../models/inventoryModel')
const classificationController = {}

classificationController.buildRegister = async (req, res, next) => {
  let nav = await utilities.getNav()

  res.render('classification/register', {
    title: 'Add Classification',
    nav,
    classification_name: '',
    errors: null,
  })
}

classificationController.registerClassification = async (req, res) => {
  const { classification_name } = req.body || ''
  const isExists = await inventoryModel.isClassificationExists(classification_name)
  let nav = await utilities.getNav()
  
  if (isExists) {
    req.flash('notice', 'Classification already exists.')
    return res.status(501).render('classification/register', {
      title: 'Add Classification',
      nav,
      classification_name,
    })
  } else {
    const registerResult = await classificationModule.registerClassification(classification_name)
    
    if (registerResult) {
      req.flash(
        'notice',
        `New Classification ${classification_name} was registered.`
      )
      return res.status(201).render('classification/register', {
        title: 'Add Classification',
        nav,
        classification_name,
      })
    } else {
      req.flash(
        'notice',
        'Sorry, the registration failed.'
      )
      return res.status(501).render('classification/register', {
        title: 'Add Classification',
        nav,
        classification_name,
      })
    }
  }
  
}

module.exports = classificationController