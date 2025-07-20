const { Router } = require("express");
const productsController = require("../controllers/productsController.js");

const productsRouter = Router();

productsRouter.get("/", productsController.index);
productsRouter.get("/new", productsController.renderNewForm);
productsRouter.post("/new", productsController.create);

module.exports = productsRouter;