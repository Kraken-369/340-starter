const pool = require('../database/')

const registerAccount = async (account_firstname, account_lastname, account_email, account_password) => {

  try {
    const sql = "insert into account (account_firstname, account_lastname, account_email, account_password, account_type) values ($1, $2, $3, $4, 'Client') returning *"

    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }

}

module.exports = { registerAccount }