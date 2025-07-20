const { Router } = require("express");
categoriesController = require("../controllers/categoriesController.js");

const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.index);

module.exports = categoriesRouter;