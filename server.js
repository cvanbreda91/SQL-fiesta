const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'Lolalola20!',
    database: 'workplace_data'
  },
  console.log('Connected to the workplace_data database.')
);


const initializeQuestions = () => {
  return inquirer.prompt ([
    {
    type: 'list',
    name: 'choice',
    message: 'Please choose:',
    choices: ['View All Departments','Create a Department', 'Delete a Department', 'View All Roles', 'Create a Role', 'Delete a Role', 'View All Employees']}
  ]).then (function(choice){
      switch (choice.choice) {
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'Create a Department':
          createDepartment();
          break;
        case 'Delete a Department':
          deleteDepartment();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'Create a Role':
          createRole();
          break;
        case 'Delete a Role':
          deleteRole();
          break;
        case 'View All Employees':
          viewAllEmployees();
          break
      }
  })}



const viewAllDepartments = () => {
  const sql = `SELECT * FROM departments`;
  
  db.query(sql,(err, row) => {
    console.table(row)
    if (err) {
      return err;
    } 
  })
}

const createDepartment = () => {
  return inquirer.prompt ([
    {
    type: 'text',
    name: 'name',
    message: 'Name of department'}
  ])
  .then (function(name)
  {
  const sql = `INSERT INTO departments (name) VALUES (?)`;
  db.query(sql, name.name, (err, result) => {
    if (err) {
      return err;
    } else {
      viewAllDepartments ()
    }
  })
})
}
  

initializeQuestions();

const deleteDepartment = () => {
  const sql = 'SELECT * FROM departments';
  db.promise().query(sql)
  .then((res) => {
      // make the choice dept arr
      return res[0].map(departments => {
          return {
              name: departments.name,
              value: departments.id
          }
      })
  })
  .then((departments) => {
      return inquirer.prompt([
          {
              type: 'list',
              name: 'deptId',
              choices: departments,
              message: 'Please select the department you want to delete.'
          }
      ])
  })
  .then(answer => {
      console.log(answer);
      return db.promise().query('DELETE FROM departments WHERE id = ?', answer.deptId);
  })
  .then(res => {
      // console.log(res);
      console.log('Department Deleted Successfully')
      viewAllDepartments();
  })
}

const viewAllRoles = () => {
  const sql = `SELECT roles.*, departments.name
                AS department_name 
                FROM roles 
                LEFT JOIN departments 
                ON roles.department_id = departments.id`;
  db.query(sql,(err, row) => {
    console.table(row)
    if (err) {
      return err;
    } 
  })
}

const createRole = () => {
  const sql = 'SELECT * FROM departments';
  db.promise().query(sql)
  .then((res) => {
    return res[0].map(departments => {
      return {
              name: departments.name,
              value: departments.id
              }
      })
  })  
  .then((departments) => {
    return inquirer.prompt([
        {
        type: 'text',
        name: 'title',
        message: 'What is the title of your new role?'
        },
        {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?'
        },
        {
        type: 'list',
        name: 'departments',
        choices: departments,
        message: 'What department does the role belong to?'
        }
    ])
})  .then(answer => {
  console.log(answer);
  return db.promise().query('INSERT INTO roles SET ?',{title: answer.title, salary: answer.salary, department_id:answer.departments});
})
.then(res => {
  viewAllRoles();
})}

const deleteRole = () => {
  const sql = 'SELECT * FROM roles';
  db.promise().query(sql)
  .then((res) => {
      // make the choice dept arr
      return res[0].map(roles => {
          return {
              name: roles.title,
              value: roles.id
          }
      })
  })
  .then((roles) => {
      return inquirer.prompt([
          {
              type: 'list',
              name: 'roleId',
              choices: roles,
              message: 'Please select the role you want to delete.'
          }
      ])
  })
  .then(answer => {
      console.log(answer);
      return db.promise().query('DELETE FROM roles WHERE id = ?', answer.roleId);
  })
  .then(res => {
      // console.log(res);
      console.log('Role Deleted Successfully')
      viewAllRoles();
  })
}

const viewAllEmployees = () => {
  const sql = `SELECT employees.first_name, employees.last_name, roles.title, departments.name
              FROM employees
              JOIN roles ON employees.role_id = roles.id
              JOIN departments ON roles.department_id = departments.id;`;
  db.query(sql,(err, row) => {
    console.table(row)
    if (err) {
      return err;
    } 
  })
}

// // Update a role's department - working
// app.put('/api/role/:id', (req, res) => {
//   const sql = `UPDATE  roles SET department_id= ? 
//                WHERE id = ?`;
//   const params = [req.body.department_id, req.params.id];

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//     } else if (!result.affectedRows) {
//       res.json({
//         message: 'Role not found'
//       });
//     } else {
//       res.json({
//         message: 'success',
//         data: req.body,
//         changes: result.affectedRows
//       });
//     }
//   });
// });

// // Delete a role - working
// app.delete('/api/role/:id', (req, res) => {
//   const sql = `DELETE FROM roles WHERE id = ?`;


// // Get all employees alphabetized by last name - working
// app.get('/api/employees', (req, res) => {
//   const sql = `SELECT * FROM employees ORDER BY last_name`;

//   db.query(sql, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: 'success',
//       data: rows
//     });
//   });
// });

// // Get all employees for single manager - working
// app.get('/api/employees/:manager_id', (req, res) => {
//   const sql = `SELECT * FROM employees WHERE manager_id = ?`;
//   const params = [req.params.manager_id];

//   db.query(sql, params, (err, row) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: 'success',
//       data: row
//     });
//   });
// });

// // Get single employee - working
// app.get('/api/employee/:id', (req, res) => {
//   const sql = `SELECT * FROM employees WHERE id = ?`;
//   const params = [req.params.id];

//   db.query(sql, params, (err, row) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: 'success',
//       data: row
//     });
//   });
// });

// // Create an employee - working
// app.post('/api/employee', ({ body }, res) => {
//   const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
//   const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: 'success',
//       data: body
//     });
//   });
// });

// // Update an employees manager - working
// app.put('/api/employee/:id', (req, res) => {

//   const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
//   const params = [req.body.manager_id, req.params.id];

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//     } else if (!result.affectedRows) {
//       res.json({
//         message: 'Employee not found'
//       });
//     } else {
//       res.json({
//         message: 'success',
//         data: req.body,
//         changes: result.affectedRows
//       });
//     }
//   });
// });

// // Delete an employee - working
// app.delete('/api/employee/:id', (req, res) => {
//   const sql = `DELETE FROM employees WHERE id = ?`;

//   db.query(sql, req.params.id, (err, result) => {
//     if (err) {
//       res.status(400).json({ error: res.message });
//     } else if (!result.affectedRows) {
//       res.json({
//         message: 'Employee not found'
//       });
//     } else {
//       res.json({
//         message: 'deleted',
//         changes: result.affectedRows,
//         id: req.params.id
//       });
//     }
//   });
// });

