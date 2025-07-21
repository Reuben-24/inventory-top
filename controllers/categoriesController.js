const { validationResult } = require("express-validator");
const queries = require("../db/queries.js");
const validation = require("../validation.js");

exports.index = async (req, res) => {
  const searchInput = req.query.q || "";
  const sortColumn = req.query.sortColumn || "id";
  const sortOrder = req.query.sortOrder || "ASC";
  const numberOfRows = req.query.numberOfRows || 100;
  const categories = await queries.getCategories({
    sortColumn,
    sortOrder,
    numberOfRows,
    searchInput,
  });
  res.render("categories", {
    title: "Categories",
    categories,
    searchInput,
    sortColumn,
    sortOrder,
    numberOfRows,
  });
};

exports.renderNewForm = async (req, res) => {
  res.render("categoryForm", { title: "Create New Category" });
};

exports.create = [
    validation.validateCategory,

    async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = errors.array().map(err => err.msg).join(", ");
      return next(new Error(message));
    }   
    const { name, description } = req.body;
    await queries.insertCategory({ name, description });
    res.redirect("/categories");
  },
];

exports.delete = async (req, res) => {
  const { id } = req.body;
  await queries.deleteCategory(id);
  res.redirect("/categories");
};

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
};