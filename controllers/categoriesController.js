const queries = require("../db/queries.js");

exports.index = async (req, res) => {
  const allCategories = await queries.getAllCategories();
  res.render("categories", { title: "Categories", categories: allCategories });
}

exports.renderNewForm = async (req, res) => {
  res.render("newCategory", { title: "Create New Category" });
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  await queries.insertCategory({ name, description });
  res.redirect("/categories");
};