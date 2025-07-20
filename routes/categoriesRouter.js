const { Router } = require("express");
categoriesController = require("../controllers/categoriesController.js");

const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.index);
categoriesRouter.get("/new", categoriesController.renderNewForm);
categoriesRouter.post("/new", categoriesController.create);

module.exports = categoriesRouter;