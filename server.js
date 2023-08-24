//Dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");

//mysql2 connection to the database
const db = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "root",
  database: "company_db",
});

db.connect((err) => {
  if (err) throw err;
  startPrompt();
});

// Start the prompt functions
function startPrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add A Department",
        "Add A Role",
        "Add An Employee",
        "Update An Employee Role",
      ],
    }) //Depending on your choices it should run the designated function.
    .then((answer) => {
      switch (answer.menu) {
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add A Department":
          addDepartment();
          break;
        case "Add A Role":
          addRole();
          break;
        case "Add An Employee":
          addEmployee();
          break;
        case "Update An Employee Role":
          updateEmployeeRole();
          break;
      }
    });
}

// View all departments
function viewAllDepartments() {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    startPrompt();
  });
}

// View all roles
function viewAllRoles() {
  const sql = `SELECT * FROM role`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    startPrompt();
  });
}

// View all employees
function viewAllEmployees() {
  const sql = `SELECT employee.id,
              employee.first_name,
              employee.last_name,
              role.title AS job_title,
              department.name,
              role.salary,
              CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager
              FROM employee
              LEFT JOIN role ON employee.role_id = role.id
              LEFT JOIN department ON role.department_id = department.id
              LEFT JOIN employee AS manager ON employee.manager_id = manager.id
              ORDER By employee.id`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    startPrompt();
  });
}

// Add departments
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message:
          "Please enter the name of the department you want to add to the database.",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (name)
              VALUES (?)`;
      const params = [answer.name];
      db.query(sql, params, (err, result) => {
        if (err) throw err;
        console.log(
          "The new department entered has been added successfully to the database."
        );

        db.query(`SELECT * FROM department`, (err, result) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          startPrompt();
        });
      });
    });
}

// Add a role
function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message:
          "Please enter the title of role you want to add to the database.",
      },
      {
        name: "salary",
        type: "input",
        message:
          "Please enter the salary associated with the role you want to add to the database. (no dots, space or commas)",
      },
      {
        name: "department_id",
        type: "number",
        message:
          "Please enter the department's id associated with the role you want to add to the database.",
      },
    ])
    .then(function (response) {
      db.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [response.title, response.salary, response.department_id],
        function (err, data) {
          if (err) throw err;
          console.log(
            "The new role entered has been added successfully to the database."
          );

          db.query(`SELECT * FROM role`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              startPrompt();
            }
            startPrompt();
          });
        }
      );
    });
}

// Add employees
function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message:
          "Please enter the first name of the employee you want to add to the database.",
      },
      {
        name: "last_name",
        type: "input",
        message:
          "Please enter the last name of the employee you want to add to the database.",
      },
      {
        name: "role_id",
        type: "number",
        message:
          "Please enter the role id associated with the employee you want to add to the database. Enter ONLY numbers.",
      },
      {
        name: "manager_id",
        type: "number",
        message:
          "Please enter the manager's id associated with the employee you want to add to the database. Enter ONLY numbers.",
      },
    ])
    .then(function (response) {
      db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [
          response.first_name,
          response.last_name,
          response.role_id,
          response.manager_id,
        ],
        function (err, data) {
          if (err) throw err;
          console.log(
            "The new employee entered has been added successfully to the database."
          );

          db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              startPrompt();
            }
            startPrompt();
          });
        }
      );
    });
}

// Update employee role
function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message:
          "Please enter the first name of the employee you want update in the database.",
      },
      {
        name: "role_id",
        type: "number",
        message:
          "Please enter the new role number id associated with the employee you want to update in the database. Enter ONLY numbers.",
      },
    ])
    .then(function (response) {
      db.query(
        "UPDATE employee SET role_id = ? WHERE first_name = ?",
        [response.role_id, response.first_name],
        function (err, data) {
          if (err) throw err;
          console.log(
            "The new role entered has been added successfully to the database."
          );

          db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              startPrompt();
            }
            startPrompt();
          });
        }
      );
    });
}
