const utilities = require('../utilities/')
const accountModel = require('../models/accountModel')
const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async (req, res, next) => {
  let nav = await utilities.getNav()

  res.render('account/login', {
    title: 'Login',
    nav,
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
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

module.exports = accountController