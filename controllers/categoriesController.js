const queries = require("../db/queries.js");

exports.index = async (req, res) => {
  const allCategories = await queries.getAllCategories();
  res.render("categories", { title: "Categories", categories: allCategories });
}

exports.renderNewForm = async (req, res) => {
  res.render("categoryForm", { title: "Create New Category" });
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  await queries.insertCategory({ name, description });
  res.redirect("/categories");
};

exports.delete = async (req, res) => {
  const { id } = req.body;
  await queries.deleteCategory(id);
  res.redirect("/categories");
}

exports.renderUpdateForm = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const category = await queries.getCategory(id);
  res.render("categoryForm", { title: "Update Category", category });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  await queries.updateCategory({ id, name, description });
  res.redirect("/categories");
}