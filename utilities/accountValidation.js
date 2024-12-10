const utilities = require('.')
const { body, validationResult } = require('express-validator')
const validate = {}
const accountListType = ['Admin', 'Client', 'Employee']

validate.registrationRules = () => {
  return [
    body('account_firstname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'),
    body('account_lastname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Please provide a last name.'),
    body('account_email')
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.'),
    body('account_password')
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage('Password does not meet requirements.'),
  ]
}

validate.checkRegisterData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  let errors = []
  
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    res.render('account/register', { nav, errors, title: 'Register', account_firstname, account_lastname, account_email })
    
    return
  }
  next()
}

validate.loginRules = () => {
  return [
    body('account_email')
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.'),
    body('account_password')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 12 })
      .withMessage('Password must be at least 12 characters long.'),
  ]
}

validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body
  let errors = []

  errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    res.render('account/login', { nav, errors, title: 'Login', account_email })
    
    return
  }
  next()
}

validate.updateRules = () => {
  return [
    body('account_firstname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'),
    body('account_lastname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Please provide a last name.'),
    body('account_email')
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.'),
  ]
}

validate.passwordRules = () => {
  return [
    body('account_password')
      .trim()
      .escape()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage('Password must be at least 12 characters long.'),
  ]
}

validate.checkUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email, account_type } = req.body
  let errors = []

  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    return res.render('account/edit', {
      nav,
      title: 'Edit Account',
      accountListType,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      errors,
    })
  }
  next()
}

validate.checkPasswordData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email, account_type } = res.locals.accountData
  let errors = []

  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    return res.render('account/edit', {
      nav,
      title: 'Edit Account',
      accountListType,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      errors,
    })
  }
  next()
}

module.exports = validate