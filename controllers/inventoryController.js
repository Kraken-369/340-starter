const inventoryModel = require('../models/inventoryModel')
const utilities = require('../utilities/')

const inventoryController = {}

inventoryController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await inventoryModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let title = ''
  
  if (data[0] === undefined) {
    req.flash(
      'notice',
      'This classification does not have any inventory items.'
    )
  }
  else {
    title = data[0].classification_name + ' vehicles'
  }
  res.render('./inventory/classification', {
    title,
    nav,
    grid,
  })
}

inventoryController.buildDetailPage = async (req, res, next) => {
  
  try {
    const inv_id = req.params.inv_id
    const data = await inventoryModel.getProductDetail(inv_id)
    const nav = await utilities.getNav()
    const detail =  await utilities.buildProductDetail(data[0])

    res.render('./inventory/productDetail', {
      title: `${data[0].inv_make} ${data[0].inv_model} ${data[0].inv_year}`,
      nav,
      detail
    })
  } catch(err) {
    next(err)
  }

}

inventoryController.buildManagementView = async (req, res, next) => {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render('./inventory/management', {
    title: 'Manage Inventory',
    nav,
    classificationSelect,
    errors: null,
  })
}

inventoryController.buildAddInventory = async (req, res, next) => {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render('./inventory/addInventory', {
    title: 'Add Inventory',
    nav,
    classificationList,
    errors: null,
  })
}

inventoryController.registerNewVehicle = async (req, res, next) => {
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
  const registerResult = await inventoryModel.newVehicle(
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
  )
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  if (registerResult) {
    req.flash(
      'notice',
      `New Vehicle ${inv_make} ${inv_model} ${inv_year} was registered.`
    )
    return res.status(201).render('./inventory/addInventory', {
      title: 'Add Classification',
      nav,
      classificationList,
      errors: null
    })
  } else {
    req.flash(
      'notice',
      'Sorry, the registration failed.'
    )
    return res.status(501).render('./inventory/addInventory', {
      title: 'Add Classification',
      nav,
      classificationList,
      errors
    })
  }
}

inventoryController.getInventoryJSON = async (req, res, next) => {
  console.log(req.params)
  const classificationId = parseInt(req.params.classificationId)
  const invData = await inventoryModel.getInventoryByClassificationId(classificationId)
  
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = inventoryController