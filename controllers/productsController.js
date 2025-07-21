const queries = require("../db/queries.js");

exports.index = async (req, res) => {
  const searchInput = req.query.q || "";
  const sortColumn = req.query.sortColumn || "id";
  const sortOrder = req.query.sortOrder || "ASC";
  const numberOfRows = req.query.numberOfRows || 100;
  const products = await queries.getProductsWithCategories({
    sortColumn,
    sortOrder,
    numberOfRows,
    searchInput,
  });
  res.render("products", {
    title: "Products",
    products,
    searchInput,
    sortColumn,
    sortOrder,
    numberOfRows,
  });
};

exports.renderNewForm = async (req, res) => {
  const categories = await queries.getAllCategories();
  res.render("productForm", { title: "Create New Product", categories });
};

exports.create = async (req, res) => {
  const { name, description, unit, price, category_id } = req.body;
  await queries.insertProduct({ name, description, unit, price, category_id });
  res.redirect("/products");
};

exports.delete = async (req, res) => {
  const { id } = req.body;
  await queries.deleteProduct(id);
  res.redirect("/products");
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, description, unit, price, category_id } = req.body;
  await queries.updateProduct({
    id,
    name,
    description,
    unit,
    price,
    category_id,
  });
  res.redirect("/products");
};

exports.renderUpdateForm = async (req, res) => {
  const id = req.params.id;
  const product = await queries.getProduct(id);
  const categories = await queries.getAllCategories();
  res.render("productForm", { title: "Update Product", categories, product });
};
