const pool = require("./pool.js");

exports.getAllProducts = async () => {
  const { rows } = await pool.query("SELECT * FROM products");
};



