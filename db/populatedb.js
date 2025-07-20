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
  ('Clothing', 'Apparel and garments');

INSERT INTO products (name, description, unit, price, category_id)
VALUES 
  ('Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 'pcs', 25.99, (SELECT id FROM categories WHERE name = 'Electronics')),
  ('LED Monitor 24"', '24-inch Full HD monitor with HDMI', 'pcs', 189.99, (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Bananas', 'Fresh organic bananas', 'kg', 2.49, (SELECT id FROM categories WHERE name = 'Groceries')),
  ('Rice', 'Premium jasmine rice', '5kg bag', 12.75, (SELECT id FROM categories WHERE name = 'Groceries')),
  ('Office Chair', 'Ergonomic mesh back office chair', 'pcs', 139.00, (SELECT id FROM categories WHERE name = 'Furniture')),
  ('T-Shirt', 'Cotton crew neck t-shirt', 'pcs', 15.00, (SELECT id FROM categories WHERE name = 'Clothing')),
  ('Jeans', 'Slim fit blue jeans', 'pcs', 49.99, (SELECT id FROM categories WHERE name = 'Clothing'));
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
