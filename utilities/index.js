const path = require('path')
const fs = require('fs')
const inventoryModel = require('../models/inventoryModel')
const jwt = require("jsonwebtoken")
require('dotenv').config()
const Util = {}

const getImage = (image, tn=false) => {
  const noImage = tn ? 'no-image-tn.png' : 'no-image.png'
  const imageDir = path.join(__dirname, '../public', image)
  if (image !== null || image !== 'undefined' || image !== '' || !fs.existsSync(imageDir)) {
    return `/images/vehicles/${noImage}`
  }

  return image
}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async (req, res, next) => {
  let data = await inventoryModel.getClassifications()
  let list = '<ul>'

  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>'
    list += '</li>'
  })
  list += '</ul>'
  
  return list
}

Util.buildClassificationGrid = async (data) => {
  let grid

  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + getImage(vehicle.inv_thumbnail, true)
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  
  return grid
}

Util.buildProductDetail = async data => {
  if (data === undefined) {
    throw new Error('Invalid Inventory ID');
  }

  let detail

  detail = `<div>
      <p>${data.inv_description}</p>
      <p>Color: <span>${data.inv_color}</span></p>
      <p>Miles: <span>${new Intl.NumberFormat('en-US').format(data.inv_miles)}</span></p>
      <p>Price: <span>$${new Intl.NumberFormat('en-US').format(data.inv_price)}</span></p>
    </div>
    <div>
      <img src="${getImage(data.inv_image)}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors" />
    </div>`

  return detail
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await inventoryModel.getClassifications()
  let classificationList ='<select name="classification_id" id="classification-list">'
  
  classificationList += "<option value=''>Choose a Classification</option>"
  
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && parseInt(row.classification_id) === parseInt(classification_id)) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  
  classificationList += "</select>"

  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {

  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      (err, accountData) => {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
  
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util