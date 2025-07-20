const { Router } = require("express");
indexController = require("../controllers/indexController.js");

const indexRouter = Router();

indexRouter.get("/", indexController.index);

module.exports = indexRouter;