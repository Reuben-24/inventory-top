const queries = require("../db/queries.js");


exports.index = (req, res) => {
  res.render("products", { title: "Products"});
}

