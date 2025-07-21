const { body } = require("express-validator");
const queries = require("./db/queries.js");

exports.validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required."),

  body("description")
    .optional({ checkFalsy: true })
    .trim(),

  body("unit")
    .trim()
    .notEmpty()
    .withMessage("Unit is required."),

  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number.")
    .bail()
    .custom((value) => {
      if (!/^\d+(\.\d{2})$/.test(value)) {
        throw new Error("Price must have exactly 2 decimal places.");
      }
      return true;
    })
    .toFloat(),

  body("category_id")
    .trim()
    .toInt()
    .notEmpty()
    .withMessage("Category is required.")
    .isInt({ gt: 0 })
    .withMessage("Category ID must be a positive integer.")
    .bail()
    .custom(async (value) => {
      const category = await queries.getCategory(value);
      if (!category) {
        throw new Error("Category does not exist");
      }
      return true;
    }),
];

exports.validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required."),

  body("description")
    .optional({ checkFalsy: true })
    .trim(),
];