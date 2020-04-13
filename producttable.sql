DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);
USE bamazon;
-- SELECT * FROM products WHERE stock_quantity < 5;
USE bamazon;
select * from products;
USE bamazon;
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("kombucha", "beverages", 3.50, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("apples", "produce", 1.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("pizza", "frozen foods", 4.50, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("muffins", "bakery", 2.50, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("vitamins", "multivitamins", 10.00, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("shampoo", "body care", 4.50, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("guinness", "beer", 4.50, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("salad", "deli", 3.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("lara bars", "grocery aisles", 1.50, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("cupcakes", "bakery", 3.50, 10);