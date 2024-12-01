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

inventoryController.getInventory = async (req, res, next) => {
  let nav = await utilities.getNav()

  res.render('./inventory/index', {
    title: 'Vehicle Management',
    nav,
    errors: null
  })
}

module.exports = inventoryController