-- MySQL table called departments. Your table should include the following columns:

-- department_id

-- department_name

-- over_head_costs (A dummy number you set for each department)

USE bamazon;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  over_head_costs DECIMAL(10,2) NULL,
  PRIMARY KEY (department_id)
);

