#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name CITEXT UNIQUE NOT NULL CHECK (trim(name) <> ''),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name CITEXT UNIQUE NOT NULL CHECK (trim(name) <> ''),
  description TEXT,
  unit TEXT NOT NULL,
  price NUMERIC(10, 2) CHECK (price >= 0),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

INSERT INTO categories (name, description)
VALUES 
  ('Electronics', 'Devices such as phones, laptops, and accessories'),
  ('Groceries', 'Everyday food and household items'),
  ('Furniture', 'Home and office furniture'),
  ('Clothing', 'Apparel and garments'),
  ('Home & Kitchen', 'Household items including cookware, lunch bags, and kettles.'),
  ('Health & Fitness', 'Products related to wellness, exercise, and personal care.'),
  ('Books', 'Various genres of books and literature'),
  ('Toys', 'Children’s toys and games'),
  ('Beauty', 'Skincare, makeup, and personal care products');

INSERT INTO products (name, description, unit, price, category_id)
VALUES 
  ('Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 'pcs', 25.99, (SELECT id FROM categories WHERE name = 'Electronics')),
  ('LED Monitor 24"', '24-inch Full HD monitor with HDMI', 'pcs', 189.99, (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Bananas', 'Fresh organic bananas', 'kg', 2.49, (SELECT id FROM categories WHERE name = 'Groceries')),
  ('Rice', 'Premium jasmine rice', '5kg bag', 12.75, (SELECT id FROM categories WHERE name = 'Groceries')),
  ('Office Chair', 'Ergonomic mesh back office chair', 'pcs', 139.00, (SELECT id FROM categories WHERE name = 'Furniture')),
  ('T-Shirt', 'Cotton crew neck t-shirt', 'pcs', 15.00, (SELECT id FROM categories WHERE name = 'Clothing')),
  ('Jeans', 'Slim fit blue jeans', 'pcs', 49.99, (SELECT id FROM categories WHERE name = 'Clothing')),
  ('Bluetooth Headphones', 'Wireless noise-cancelling headphones', 'pcs', 79.99, (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Smartphone Charger', 'Fast charging USB-C charger', 'pcs', 19.99, (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Almond Milk', 'Organic unsweetened almond milk, 1L', 'ltr', 3.99, (SELECT id FROM categories WHERE name = 'Groceries')),
  ('Olive Oil', 'Extra virgin olive oil, 500ml', 'bottle', 9.50, (SELECT id FROM categories WHERE name = 'Groceries')),
  ('Dining Table', 'Wooden dining table seats 6', 'pcs', 499.00, (SELECT id FROM categories WHERE name = 'Furniture')),
  ('Bookshelf', '5-tier wooden bookshelf', 'pcs', 129.99, (SELECT id FROM categories WHERE name = 'Furniture')),
  ('Hoodie', 'Fleece pullover hoodie', 'pcs', 35.00, (SELECT id FROM categories WHERE name = 'Clothing')),
  ('Sneakers', 'Lightweight running sneakers', 'pair', 59.99, (SELECT id FROM categories WHERE name = 'Clothing')),
  ('Non-stick Frying Pan', '24cm frying pan with non-stick coating', 'pcs', 24.99, (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
  ('Lunch Box', 'Insulated lunch box with compartments', 'pcs', 18.50, (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
  ('Yoga Mat', 'Eco-friendly non-slip yoga mat', 'pcs', 29.99, (SELECT id FROM categories WHERE name = 'Health & Fitness')),
  ('Dumbbell Set', 'Adjustable dumbbell set up to 20kg', 'set', 99.00, (SELECT id FROM categories WHERE name = 'Health & Fitness')),
  ('Mystery Novel', 'Thrilling mystery fiction book', 'pcs', 12.99, (SELECT id FROM categories WHERE name = 'Books')),
  ('Children’s Puzzle', '500-piece jigsaw puzzle', 'pcs', 14.99, (SELECT id FROM categories WHERE name = 'Toys')),
  ('Lip Balm', 'Natural moisturizing lip balm', 'pcs', 4.50, (SELECT id FROM categories WHERE name = 'Beauty')),
  ('Face Cleanser', 'Gentle daily face cleanser', 'bottle', 13.00, (SELECT id FROM categories WHERE name = 'Beauty'));
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
