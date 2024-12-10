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

const updateAccount = async (account_id, account_firstname, account_lastname, account_email) => {
  
  try {
    const result = await pool.query(
      'update account set account_firstname = $2, account_lastname = $3, account_email = $4 where account_id = $1 returning *',
      [account_id, account_firstname, account_lastname, account_email])

    return result
  } catch (error) {
    return new Error('Did not update account.')
  }

}

const updatePassword = async (account_id, account_password) => {

  try {
    const result = await pool.query(
      'update account set account_password = $2 where account_id = $1 returning *',
      [account_id, account_password])
    return result
  } catch (error) {
    return new Error('Did not update password.')
  }

}

module.exports = { registerAccount, getAccountByEmail, updateAccount, updatePassword }