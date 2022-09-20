INSERT INTO departments
  (name)
VALUES
("Human Resources"),
("Accounting"),
("Custodial");

INSERT INTO roles 
  (title, salary, department_id)
VALUES
("Department Head", 45000.00, 1),
("Associate", 36000.00, 2),
("Senior Associate", 40000.00, 2),
("Manager", 45000.00, 2),
("Senior Manager", 50000.00, 2),
("Complaints", 40000.00, 1),
("Vomit Cleaner", 25000.00, 3),
("Toilet Scrubber", 20000.00, 3),
("Floor Polisher", 15000.00, 3);

INSERT INTO employees
  (first_name, last_name, role_id, manager_id)
VALUES
("Courtney", "Van Breda", 2, 2),
("Justin", "Rilett", 5, 1),
("Finn", "Rilett", 6, 1),
("Coal", "Rilett", 9, 1);
