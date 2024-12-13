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
    const data = await inventoryModel.getInventoryById(inv_id)
    const nav = await utilities.getNav()
    const detail =  await utilities.buildProductDetail(data)

    res.render('./inventory/productDetail', {
      title: `${data.inv_make} ${data.inv_model} ${data.inv_year}`,
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
    inv_color,
    inv_for_rent,
    inv_price_day,
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
    inv_color,
    inv_for_rent,
    inv_price_day,
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
  const classificationId = parseInt(req.params.classificationId)
  const invData = await inventoryModel.getInventoryByClassificationId(classificationId)
  
  return res.json(invData)
}

inventoryController.buildEditInventory = async (req, res, next) => {
  const invId = parseInt(req.params.invId)
  const itemData = await inventoryModel.getInventoryById(invId)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  let nav = await utilities.getNav()

  res.render("./inventory/editInventory", {
    title: "Edit: " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    inv_for_rent: itemData.inv_for_rent,
    inv_price_day: itemData.inv_price_day,
    inv_available: itemData.inv_available,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
inventoryController.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_for_rent,
    inv_price_day,
    inv_available,
    classification_id,
  } = req.body
  const updateResult = await inventoryModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_for_rent,
    inv_price_day,
    inv_available,
    classification_id
  )

  if (updateResult) {
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}` 
    req.flash('notice', `The ${itemName} was successfully updated.`)
    res.redirect('/inv/')
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash('notice', 'Sorry, the edit failed.')
    res.status(501).render('inventory/editInventory', {
    title: `Edit ${itemName}`,
    nav,
    classificationList,
    errors: null,
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
    inv_for_rent,
    inv_price_day,
    inv_available,
    classification_id
    })
  }
}

inventoryController.buildDeleteConfirmInventory = async (req, res, next) => {
  const invId = parseInt(req.params.invId)
  const itemData = await inventoryModel.getInventoryById(invId)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  let nav = await utilities.getNav()

  res.render('./inventory/deleteConfirm', {
    title: `Confirm Delete: ${itemName}`,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    classification_id: itemData.classification_id
  })
}

inventoryController.deleteVehicle = async (req, res, next) => {
  const { inv_id } = req.body
  const deleteResult = await inventoryModel.deleteInventory(inv_id)
  
  
  if (deleteResult) {
    req.flash('notice', 'The vehicle was successfully deleted.')
    res.redirect('/inv/')
  } else {
    req.flash('notice', 'The deletion failed.')
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

module.exports = inventoryController