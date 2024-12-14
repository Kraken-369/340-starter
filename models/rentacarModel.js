const pool = require('../database/')
const rentacarModel = {}

rentacarModel.getInventoryForRent = async () => {

  try {
    const data = await pool.query("SELECT * FROM public.inventory WHERE inv_for_rent")
    
    return data.rows
  } catch (error) {
    console.error('Rentacar model error: ', error.message)
  }
  
}

module.exports = rentacarModel