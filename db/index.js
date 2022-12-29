const { Pool } = require("pg");
const config = require("./config");

const pool = new Pool(config.db);

const runQuery = async (query, params) => {
  const { rows, fields } = await pool.query(query, params);

  return rows;
};

module.exports = { runQuery };
