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

rentacarModel.changeCarStatus = async (inv_id, status) => {
  try {
    const result = await pool.query("UPDATE public.inventory SET inv_available = $2 WHERE inv_id = $1 returning *", [inv_id, status])

    return result
  } catch (error) { 
    console.error('Rentacar model error: ', error.message)
  }
}

rentacarModel.insertNewRent = async (account_id, inv_id, start_date, end_date, total_price) => {
  try {
    const result = await pool.query("INSERT INTO public.rent (account_id, inv_id, start_date, end_date, total_price) VALUES ($1, $2, $3, $4, $5) returning *", [account_id, inv_id, start_date, end_date, total_price])
    
    return result.rows
  } catch (error) {
    console.error('Rentacar model error: ', error.message)
  }
}

module.exports = rentacarModel