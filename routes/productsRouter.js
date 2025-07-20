const { Router } = require("express");
productsController = require("../controllers/productsController.js");

const productsRouter = Router();

productsRouter.get("/", productsController.index);

module.exports = productsRouter;