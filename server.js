const inquirer = require("inquirer");
const mysql = require("mysql2");
const artFiglet = require('figlet');


const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // Add MySQL password here
        password: 'password',
        database: 'employees_db'
    },
    console.log(`Connected to employees_db database.`)
);

require("console.table");
function init() {
    artFiglet('Welcome to Employee Tracker', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    });

    askUserForAction();

}
// Using inquirer and start using db.querry methoad 

function askUserForAction() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                "View Depratments",
                "View All Roles",
                "View Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee Role",
                "Close the Process",
            ]
        }
    ]).then((choice) => {
        switch (choice.choice) {

            case "View Depratments":
                viewDepartments();
                break;

            case "View All Roles":
                viewRoles();
                break;

            case "View Employees":
                viewEmployees();
                break;
            case "Add a Department":
                addDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee":
                addEmployee();
                break;
            case "Update an Employee Role":
                updateEmployeeRole();
                break;

            case "Close the Process":
                quit();
                break;

        }
    });

};

// Display DEPATMENT
let viewDepartments = () => {
    db.query("SELECT * FROM department", function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.table(res);
            // res.forEach((department) => {
            //     console.log(`ID: ${department.department_id} | Name: ${department.names}`);
            // });
        };

        askUserForAction();
    });
}
// View Company ROLES
let viewRoles = () => {
    db.query("SELECT * FROM role", function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("\n");
            console.table(res);
        };
        askUserForAction();
    });
}

// View all EMLOYEES
let viewEmployees = () => {
    db.query("SELECT * FROM employee", function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(`EMPLOYEE:`);
            console.table(res);
        };
        askUserForAction();
    });
}

// // Adding DEPARTMENT
let addDepartment = () => {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "please provide the Department name?",
            validate: (value) => { if (value) { return true } else { return 'I need a value to continue' } }

        })
        .then((input) => {
            db.query(`
                INSERT INTO department (name)
                VALUES (?)
                `, input.name, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`DEPARTMENT:`);
                    console.table(res);
                };
            });
            askUserForAction();
        });

};
let addRole = () => {
    db.query(`SELECT * FROM department`,
        function (err, res) {
            if (err) {
                console.log(err);
            }
            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "title",
                        message: "Please provide Title",
                        validate: (value) => { if (value) { return true } else { return 'I need a value to continue' } }

                    },
                    {
                        type: "number",
                        name: "salary",
                        message: "Please provide Role Salary",
                        validate: (value) => { if (value) { return true } else { return 'I need a value to continue' } }

                    },
                    {
                        type: "list",
                        name: "department-name",
                        message: "Please select which Department",
                        choices: () => {
                            const list = [];
                            for (let i = 0; i < res.length; i++) {
                                list.push(res[i].name);
                            }
                            return list;
                        }
                    }
                ])
                .then((answer) => {
                    // let department_id = findId(answer.department_name, res);

                    db.query(`
                        INSERT INTO role (title, salary, department_id)
                        VALUES(?,?,?)
                        `, [answer.title, answer.salary, answer.choices],
                        function (err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                // console.log(`ROLE:`);

                                console.log('added Role: ' + JSON.stringify(answer));
                                console.table(res);

                            }
                        });
                    askUserForAction();
                })
        });
}

// // Adding extra Employees
let addEmployee = () => {
    db.query("SELECT * FROM role", function (err, res) {
        if (err) {
            console.log(err);
        }

        inquirer.prompt([{
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?",
        },
        {
            name: "roleName",
            type: "list",
            message: "What role does the employee have?",
            choices: function () {
                roleArray = [];
                res.forEach((res) => {
                    roleArray.push(res.title);
                });
                return roleArray;
            },
        },
        ]).then(function (answer) {
            console.log(answer);
            console.table(res);
            let role = answer.roleName;
            db.query("SELECT * FROM role", function (err, res) {
                if (err) {
                    console.log(err);
                }
                let filteredRole = res.filter(function (res) {
                    return res.title == role;
                });
                let roleId = filteredRole[0].role_id;
                db.query("SELECT * FROM employee", function (err, res) {
                    inquirer
                        .prompt([{
                            name: "manager",
                            type: "list",
                            message: "Who is your manager?",
                            choices: function () {
                                managersArray = [];
                                res.forEach((res) => {
                                    managersArray.push(res.last_name);
                                });
                                return managersArray;
                            },
                        },
                        ]).then(function (managerAnswer) {
                            let manager = managerAnswer.manager;
                            db.query("SELECT * FROM employee", function (err, res) {
                                if (err) {
                                    console.log(err);
                                }
                                let filteredManager = res.filter(function (res) {
                                    return res.last_name == manager;
                                });
                                let managerId = filteredManager[0].manager_id;
                                console.log(managerAnswer);
                                console.table(res);
                                var query =
                                    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                                let values = [
                                    answer.firstName,
                                    answer.lastName,
                                    roleId,
                                    managerId,
                                ];
                                console.log(values);
                                console.table(res);
                                db.query(query, values, function (err, res, fields) {
                                    console.log(
                                        `You have added this employee: ${values[0].toUpperCase()}.`
                                    );
                                });
                                askUserForAction();
                            });
                        });
                });
            });
        });
    });

}
let roleArr = [];
function selectRole() {
    db.query("SELECT * FROM role", function (err, res) {
        if (err) {
            console.log(err);
        }
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }

    })
    return roleArr;
}
let updateEmployeeRole = () => {
    db.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function (err, res) {
        if (err) {
            console.log(err);
        }
        console.log(res)
        inquirer
            .prompt([
                {
                    name: "lastName",
                    type: "list",
                    choices: function () {
                        let lastName = [];
                        for (let i = 0; i < res.length; i++) {
                            lastName.push(res[i].last_name);
                        }
                        return lastName;
                    },
                    message: "What is the Employee's last name? ",
                },
                {
                    name: "role",
                    type: "list",
                    message: "Please provide employee new title? ",
                    choices: selectRole()
                },
            ]).then(function (val) {
                let roleId = selectRole().indexOf(val.role) + 1
                db.query(`UPDATE employee SET role_id = ? WHERE id = ?`,
                    {
                        last_name: val.lastName

                    },
                    {
                        role_id: roleId

                    },
                    function (err, res) {
                        if (err) throw err
                        console.table(res);
                        askUserForAction();
                    })

            });
    });

}

function quit() {
    console.log("Auf WiederSehen!");
    process.exit();
}


init();


