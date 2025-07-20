const queries = require("../db/queries.js");

exports.index = async (req, res) => {
  let allProducts = await queries.getAllProductsWithCategories();
  res.render("products", { title: "Products", products: allProducts });
};

exports.renderNewForm = async (req, res) => {
  const categories = await queries.getAllCategories();
  res.render("newProduct", { title: "Create New Product", categories });
};

exports.create = async (req, res) => {
  const { name, description, unit, price, category_id } = req.body;
  await queries.insertProduct({ name, description, unit, price, category_id });
  res.redirect("/products");
};
