const utilities = require('../utilities/')
const accountModel = require('../models/accountModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const accountController = {}
const accountListType = ['Admin', 'Client', 'Employee']

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async (req, res, next) => {
  let nav = await utilities.getNav()

  res.render('account/login', {
    title: 'Login',
    nav,
    errors: null,
    account_email: '',
  })
}

accountController.buildRegister = async (req, res, next) => {
  let nav = await utilities.getNav()

  res.render('account/register', {
    title: 'Register',
    nav,
    accountListType,
    errors: null,
  })
}

accountController.registerAccount = async (req, res) => {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  const registerResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, account_password)

  if (registerResult) {
    req.flash(
      'notice',
      `Congratulations, you are registered ${account_firstname}. Please log in.`
    )
    res.status(201).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
    })
  } else {
    req.flash('notice', 'Sorry, the registration failed.')
    res.status(501).render('account/register', {
      title: 'Registration',
      nav,
      errors,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.loginAccount = async (req, res) => {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash('notice', 'Please check your credentials and try again.')
    res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
      account_email: account_email || '',
    })
    return
  }

  try {
    if (account_password === accountData.account_password) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

      if(process.env.NODE_ENV === 'development') {
        res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie('jwt', accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect('/account/')
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        account_email: account_email || '',
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

accountController.buildManagement = async (req, res) => {
  let nav = await utilities.getNav()
  
  res.render('account/management', {
    title: 'Account Management',
    nav,
    accountData: res.locals.accountData,
    errors: null,
  })
}

accountController.buildEdit = async (req, res) => {
  let nav = await utilities.getNav()

  res.render('account/edit', {
    title: 'Edit Account',
    nav,
    accountListType,
    account_id: res.locals.accountData.account_id,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email,
    account_type: res.locals.accountData.account_type,
    errors: null,
  })
}

accountController.updateAccount = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email, account_type } = req.body
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email, account_type)
  let nav = await utilities.getNav()

  if (updateResult) {
    const accountData = { account_id, account_firstname, account_lastname, account_email, account_type }
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

    if (process.env.NODE_ENV === 'development') {
      res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie('jwt', accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    req.flash('notice', 'The account was successfully updated.')
    res.redirect('/account/')
  } else {
    req.flash('', '')
    res.status(501).render('account/edit', {
      title: 'Edit account',
      nav,
      accountListType,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      errors: null,
    })
  }
}

accountController.updatePassword = async (req, res, nex) => {
  const { account_id, account_password } = req.body
  const updateResult = await accountModel.updatePassword(account_id, account_password)
  
  if (updateResult) {
    req.flash('notice', 'The account password was successfully updated.')
    res.redirect('/account/')
  } else {
    const { account_id, account_firstname, account_lastname, account_email, account_type } = res.locals.accountData
    let nav = await utilities.getNav()

    req.flash('', '')
    res.status(501).render('account/edit', {
      title: 'Edit account',
      nav,
      accountListType,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      errors: null,
    })
  }
}

module.exports = accountController