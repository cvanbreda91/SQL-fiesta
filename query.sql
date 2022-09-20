-- Join roles and departments
SELECT *
FROM roles
JOIN departments ON departments.id = roles.department_id;

-- Join employees and roles
SELECT * 
FROM employees
JOIN roles ON roles.id = employees.role_id;

-- Join employees on self
SELECT *
FROM employees AS employee
JOIN employees AS manager
ON employee.manager_id = manager.id;



