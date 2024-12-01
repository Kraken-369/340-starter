const pool = require('../database/')

const registerClassification = async (classification_name) => {
  try {
    const sql = 'insert into classification (classification_name) values ($1) returning *'

    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

module.exports = { registerClassification }