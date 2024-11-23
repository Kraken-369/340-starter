const inventoryModel = require('../models/inventoryModel')
const utilities = require('../utilities/')

const inventoryController = {}

inventoryController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await inventoryModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  
  res.render('./inventory/classification', {
    title: className + ' vehicles',
    nav,
    grid,
  })
}

inventoryController.buildDetailPage = async (req, res, next) => {
  const inv_id = req.params.inv_id
  const data = await inventoryModel.getProductDetail(inv_id)
  const nav = await utilities.getNav()
  const detail =  await utilities.buildProductDetail(data[0])

  console.log(data)
  res.render('./inventory/productDetail', {
    title: `${data[0].inv_make} ${data[0].inv_model} ${data[0].inv_year}`,
    nav,
    detail
  })
}

module.exports = inventoryController