const { Router } = require("express");
categoriesController = require("../controllers/categoriesController.js");

const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.index);
categoriesRouter.get("/new", categoriesController.renderNewForm);
categoriesRouter.post("/new", categoriesController.create);
categoriesRouter.post("/delete", categoriesController.delete);
categoriesRouter.get("/:id/update", categoriesController.renderUpdateForm);
categoriesRouter.post("/:id/update", categoriesController.update);

module.exports = categoriesRouter;