const pool = require('../database/')

const registerAccount = async (account_firstname, account_lastname, account_email, account_password) => {

  try {
    const sql = "insert into account (account_firstname, account_lastname, account_email, account_password, account_type) values ($1, $2, $3, $4, 'Client') returning *"

    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }

}

/* *****************************
* Return account data using email address
* ***************************** */
const getAccountByEmail = async (account_email) => {

  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }

}

module.exports = { registerAccount, getAccountByEmail }