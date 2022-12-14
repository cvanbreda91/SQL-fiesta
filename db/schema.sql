DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50),
  salary DECIMAL(10,2),
  department_id INT,
  CONSTRAINT fk_department 
  FOREIGN KEY (department_id) 
  REFERENCES departments(id) 
  ON DELETE CASCADE

);

CREATE TABLE employees (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER REFERENCES employees(id),
  CONSTRAINT fk_role 
  FOREIGN KEY (role_id)
  REFERENCES roles(id) 
);