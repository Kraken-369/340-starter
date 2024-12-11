const pool = require('../database')

/* ***************************
 *  Get all classification data
 * ************************** */
const getClassifications = async () => await pool.query('SELECT * FROM public.classification ORDER BY classification_name')

const isClassificationExists = async value => await pool.query('select * from classification where lower(classification_name) = lower($1)', [value])


const getInventoryByClassificationId = async (classification_id) => {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )

    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
    throw error
  }
}

const getInventoryById = async (inv_id) => {
  try {
    const data = await pool.query(
      `select * from public.inventory where inv_id = $1`, [inv_id]
    )

    return data.rows[0]
  } catch (error)  {
    console.error(`getInventoryById error: ${error}`)
    throw error
  } 
}

const newVehicle = async ( 
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
) => {

  try {
    const sql = 'insert into inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) values ($2, $3, $4, $5, $6, $7, $8, $9, $10, $1) returning *'

    return await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color])
  } catch(error) {
    return error.message
  }

}

/* ***************************
 *  Update Inventory Data
 * ************************** */
const updateInventory = async (
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
  classification_id
) => {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

const deleteInventory = async inv_id => {
  try {
    const data = await pool.query("DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *", [inv_id])
    
    return data
  } catch (error) { console.error('Inventory model error: ', error.message) }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, newVehicle, updateInventory, deleteInventory, isClassificationExists }