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
    choices: ['View All Departments','Create a Department', 'Delete a Department', 
              'View All Roles', 'Create a Role', 'Delete a Role', 
              'View All Employees', 'View Employees by Manager','View Employees by Department','Create an Employee', 'Update Employee Role', 'Update Employee Manager','Delete an Employee',
              'Quit']}
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
          break;
        case 'View Employees by Manager':
          viewEmployeesByManager()
          break;
        case 'View Employees by Department':
          viewEmployeesByDeparment()
          break;
        case 'Create an Employee':
          createEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'Update Employee Manager':
          updateEmployeeManager();
          break;
        case 'Delete an Employee':
          deleteEmployee();
          break;
        case 'Quit':
          db.end();
          console.log("Have a good day!")
          break;
      }
  })}

  const chooseRole = () => {
    return db.promise().query("SELECT * FROM roles")
        .then(res => {
            return res[0].map(roles => {
                return {
                    name: roles.title,
                    value: roles.id
                }
            })
        })
  }
  
  const chooseEmployee = () => {
    return db.promise().query("SELECT * FROM employees ORDER BY last_name")
        .then(res => {
            return res[0].map(employee => {
                return {
                    name: `${employee.last_name}, ${employee.first_name}`,
                    value: employee.id,
                }
            })
        })
  }
  
  const chooseManager = () => {
    return db.promise().query("SELECT * FROM employees ORDER BY last_name")
        .then(res => {
            return res[0].map(manager => {
                return {
                    name: `${manager.last_name}, ${manager.first_name}`,
                    value: manager.id,
                }
            })
        })
  }
  
const viewAllDepartments = () => {
  const sql = `SELECT * FROM departments`;
  db.query(sql,(err, row) => {
    console.table(row);
    initializeQuestions()
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
    initializeQuestions()
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
  const sql = `SELECT employee.id AS employee_id, employee.last_name ,employee.first_name,
              CONCAT(manager.last_name,", ",manager.first_name) as manager_name, roles.title, roles.salary, departments.name AS department
              FROM employees employee
              LEFT OUTER JOIN employees manager ON employee.manager_id = manager.id
              JOIN roles ON employee.role_id=roles.id
              JOIN departments ON roles.department_id=departments.id
              ORDER BY employee.last_name`;
  db.query(sql,(err, row) => {
    console.table(row)
    initializeQuestions()
  })
}
function viewEmployeesByManager() {
  db.promise().query('SELECT *  FROM employees ORDER BY last_name')
      .then((res) => {
          return res[0].map(employees => {
              return {
                  name: `${employees.last_name}, ${employees.first_name}`,
                  value: employees.id
              }
          })
      })
      .then(async (chooseManager) => {
          return inquirer.prompt([
              {
                  type: 'list',
                  name: 'managerId',
                  choices: chooseManager,
                  message: 'Please select the manager whose employees you want to view.'
              }
          ])
      })
      .then(answer => {
          console.log(answer);
          return db.promise().query('SELECT CONCAT(last_name,", ",first_name) AS employee_names FROM employees WHERE manager_id=?',answer.managerId);
      })
      .then(res => {
          console.table(res[0]);
          initializeQuestions()
      });
}

function viewEmployeesByDeparment() {
  db.promise().query('SELECT *  FROM departments')
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
                  type: 'list',
                  name: 'departmentId',
                  choices: departments,
                  message: 'Please select the department whose employees you want to view.'
              }
          ])
      })
      .then(answer => {
          console.log(answer);
          return db.promise().query('SELECT CONCAT(employees.last_name,", ",employees.first_name) AS employee_name, roles.title FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments on roles.department_id = departments.id WHERE departments.id=?',answer.departmentId);
      })
      .then(res => {
          console.table(res[0]);
          initializeQuestions()
      });
}

async function createEmployee()  {
  inquirer.prompt([
    {
        name: "firstname",
        type: "input",
        message: "Enter their first name "
    },
    {
        name: "lastname",
        type: "input",
        message: "Enter their last name "
    },
    {
        name: "role",
        type: "list",
        message: "What is their role? ",
        choices: await chooseRole()
    },
    {
        name: "manager",
        type: "list",
        message: "Whats their managers name?",
        choices: await chooseManager()
    }
]).then(function (answer) {
    db.query("INSERT INTO employees SET ?",{first_name: answer.firstname,last_name: answer.lastname,manager_id: answer.manager,role_id: answer.role})
})
.then(res => {
  console.log('Employee Added Successfully')
  viewAllEmployees();
})
}

async function updateEmployeeRole()  {
  inquirer.prompt([
    {
        name: "employee",
        type: "list",
        message: "Which Employee's Role are you updating?",
        choices: await chooseEmployee()
    },
    {
        name: "role",
        type: "list",
        message: "What is their New Role?",
        choices: await chooseRole()
    }
]).then(function (answer) {
    db.promise().query("UPDATE employees SET role_id = ? WHERE id = ?",[answer.role, answer.employee])
})
.then(res => {
  console.log('Employee Updated Successfully')
  viewAllEmployees();
})
}

async function updateEmployeeManager()  {
  inquirer.prompt([
    {
        name: "employee",
        type: "list",
        message: "Which Employee's Manager are you updating?",
        choices: await chooseEmployee()
    },
    {
        name: "manager",
        type: "list",
        message: "Who is their New Manager?",
        choices: await chooseManager()
    }
]).then(function (answer) {
    db.promise().query("UPDATE employees SET manager_id = ? WHERE id = ?",[answer.manager, answer.employee])
})
.then(res => {
  console.log('Employee Updated Successfully')
  viewAllEmployees();
})
}

async function deleteEmployee()  {
  inquirer.prompt([
    {
        name: "employee",
        type: "list",
        message: "Which Employee are you Deleting?",
        choices: await chooseEmployee()
    },
]).then(function (answer) {
    db.promise().query('DELETE FROM employees WHERE id = ?', answer.employee)
})
.then(res => {
  console.log('Employee Deleted Successfully')
  viewAllEmployees();
})
}

initializeQuestions();