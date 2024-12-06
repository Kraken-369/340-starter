const utilities = require('../utilities/')
const accountModel = require('../models/accountModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async (req, res, next) => {
  let nav = await utilities.getNav()

  res.render('account/login', {
    title: 'Login',
    nav,
    errors: null,
  })
}

accountController.buildRegister = async (req, res, next) => {
  let nav = await utilities.getNav()

  res.render('account/register', {
    title: 'Register',
    nav,
    errors: null,
  })
}

accountController.registerAccount = async (req, res) => {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  const registerResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, account_password)

  if (registerResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
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
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }

  try {
    if (account_password === accountData.account_password) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

module.exports = accountController