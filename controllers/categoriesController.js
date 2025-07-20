const queries = require("../db/queries.js");

exports.index = async (req, res) => {
  const allCategories = await queries.getAllCategories();
  res.render("categories", { title: "Categories", categories: allCategories });
}

