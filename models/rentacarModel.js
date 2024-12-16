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

rentacarModel.insertNewRent = async (account_id, inv_id, start_date, days, total_cost) => {
  try {
    const result = await pool.query("INSERT INTO public.rental (account_id, inv_id, start_date, days, total_cost) VALUES ($1, $2, $3, $4, $5) returning *", [account_id, inv_id, start_date, days, total_cost])
    
    return result.rows
  } catch (error) {
    console.error('Rentacar model error: ', error.message)
  }
}

module.exports = rentacarModel