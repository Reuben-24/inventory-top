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

exports.getProductsWithCategories = async ({
  sortColumn = "id",
  sortOrder = "ASC",
  numberOfRows = 100,
  searchInput = "",
}) => {
  const validColumns = [
    "id",
    "name",
    "description",
    "unit",
    "price",
    "category",
    "created_at",
    "updated_at",
  ];
  const validOrders = ["ASC", "DESC"];

  if (!validColumns.includes(sortColumn)) {
    throw new Error(`Invalid sortColumn: ${sortColumn}`);
  }

  if (!validOrders.includes(sortOrder)) {
    throw new Error(`Invalid sortOrder: ${sortOrder}`);
  }

  numberOfRows = Number(numberOfRows);
  if (!Number.isInteger(numberOfRows) || numberOfRows <= 0) {
    throw new Error(`Invalid numberOfRows: ${numberOfRows}`);
  }

  const searchPattern = searchInput ? `%${searchInput.trim()}%` : "%";

  const { rows } = await pool.query(
    `
    SELECT p.*, c.name AS category
    FROM products AS p
    JOIN categories AS c
    ON p.category_id = c.id
    WHERE p.name ILIKE $2
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT $1;
  `,
    [numberOfRows, searchPattern]
  );
  return rows;
};

exports.getAllCategories = async () => {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
};

exports.getCategories = async ({
  sortColumn = "id",
  sortOrder = "ASC",
  numberOfRows = 100,
  searchInput = "",
}) => {
  const validColumns = [
    "id",
    "name",
    "description",
    "created_at",
    "updated_at",
  ];
  const validOrders = ["ASC", "DESC"];

  if (!validColumns.includes(sortColumn)) {
    throw new Error(`Invalid sortColumn: ${sortColumn}`);
  }

  if (!validOrders.includes(sortOrder)) {
    throw new Error(`Invalid sortOrder: ${sortOrder}`);
  }

  numberOfRows = Number(numberOfRows);
  if (!Number.isInteger(numberOfRows) || numberOfRows <= 0) {
    throw new Error(`Invalid numberOfRows: ${numberOfRows}`);
  }

  const searchPattern = searchInput ? `%${searchInput.trim()}%` : "%";

  const { rows } = await pool.query(
    `
    SELECT *
    FROM categories
    WHERE name ILIKE $2
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT $1;
  `,
    [numberOfRows, searchPattern]
  );
  return rows;
};

exports.getProduct = async (id) => {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0];
};

exports.getCategory = async (id) => {
  const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
    id,
  ]);
  return result.rows[0] || null; // return null if no category found
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

exports.insertCategory = async ({ name, description }) => {
  const result = await pool.query(
    `INSERT INTO categories (name, description)
    VALUES ($1, $2)
    RETURNING *`,
    [name, description]
  );
  return result.rows[0];
};

exports.deleteProduct = async (id) => {
  const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return result.rowCount > 0; // returns true if a row was deleted
};

exports.deleteCategory = async (id) => {
  // Count how many products are using this category
  const { rows } = await pool.query(
    "SELECT COUNT(*) FROM products WHERE category_id = $1",
    [id]
  );

  const rowCount = Number(rows[0].count);
  if (rowCount > 0) {
    throw new Error(
      "Cannot delete this category. It is assigned to one or more products."
    );
  }

  const result = await pool.query("DELETE FROM categories WHERE id = $1", [id]);
  return result.rowCount > 0; // returns true if a row was deleted
};

exports.updateProduct = async ({
  id,
  name,
  description,
  unit,
  price,
  category_id,
}) => {
  const result = await pool.query(
    `UPDATE products
     SET name = $2,
         description = $3,
         unit = $4,
         price = $5,
         category_id = $6
     WHERE id = $1
     RETURNING *;`,
    [id, name, description, unit, price, category_id]
  );
  return result.rows[0];
};

exports.updateCategory = async ({ id, name, description }) => {
  const result = await pool.query(
    `UPDATE categories
     SET name = $2,
         description = $3
     WHERE id = $1
     RETURNING *;`,
    [id, name, description]
  );
  return result.rows[0];
};
