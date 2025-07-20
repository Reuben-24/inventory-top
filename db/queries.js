const pool = require("./pool.js");

exports.getAllProductsWithCategories = async () => {
  const { rows } = await pool.query(`
    SELECT p.*, c.name AS category
    FROM products AS p
    JOIN categories AS c
    ON p.category_id = c.id;
  `);
  return rows;
};

exports.getAllCategories = async () => {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
};

exports.getCategory = async (id) => {
  const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
    id,
  ]);
  const category = result.rows[0];
  return category;
};

exports.insertProduct = async ({
  name,
  description,
  unit,
  price,
  category_id,
}) => {
  const result = await pool.query(
    `INSERT INTO products (name, description, unit, price, category_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [name, description, unit, price, category_id]
  );
  return result.rows[0];
};

exports.insertCategory = async ({
  name,
  description,
}) => {
  const result = await pool.query(
    `INSERT INTO categories (name, description)
    VALUES ($1, $2)
    RETURNING *`,
    [name, description]
  );
  return result.rows[0];
};
