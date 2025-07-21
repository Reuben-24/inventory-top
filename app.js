const express = require("express");
const path = require("path");
require("dotenv").config();
const indexRouter = require("./routes/indexRouter.js");
const categoriesRouter = require("./routes/categoriesRouter.js");
const productsRouter = require("./routes/productsRouter.js");

app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/", indexRouter);

app.use((err, req, res, next) => {
  console.error(err);
  const message = err.message;
  res.status(500).render("error", { message });
});

app.listen(process.env.PORT, () => {
  console.log(`Project: ${path.basename(__dirname)} -  Hosted at http://${process.env.HOST}:${process.env.PORT}`);
})