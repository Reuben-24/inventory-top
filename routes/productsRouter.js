const { Router } = require("express");
const productsController = require("../controllers/productsController.js");

const productsRouter = Router();

productsRouter.get("/", productsController.index);
productsRouter.get("/new", productsController.renderNewForm);
productsRouter.post("/new", productsController.create);
productsRouter.post("/delete", productsController.delete);
productsRouter.get("/:id/update", productsController.renderUpdateForm);
productsRouter.post("/:id/update", productsController.update);

module.exports = productsRouter;