const inquirer = require("inquirer");
const mysql = require("mysql2");


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

init();

async function askUserForAction() {
    const { choice } = await prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "View All Employees By Department",
                    value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                    name: "View All Employees By Manager",
                    value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "View All Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
        }
    ]);

    // Switch to correct action
    switch (choice) {
        case "VIEW_EMPLOYEES":
            viewEmployees();
            break;

        case "VIEW_EMPLOYEES_BY_DEPARTMENT":
            viewEmployeesByDepartment();
            break;

        case "VIEW_EMPLOYEES_BY_MANAGER":
            viewEmployeesByManager();
            break;

        case "ADD_EMPLOYEE":
            addEmployee();
            break;

        case "REMOVE_EMPLOYEE":
            deleteEmployee();
            break;

        case "UPDATE_EMPLOYEE_ROLE":
            updateEmployeeRole();
            break;

        case "UPDATE_EMPLOYEE_MANAGER":
            updateEmployeeManager();
            break;

        case "VIEW_DEPARTMENTS":
            viewDepartments();
            break;

        case "ADD_DEPARTMENT":
            addDepartment();
            break;

        case "REMOVE_DEPARTMENT":
            deleteDepartment();
            break;

        case "VIEW_ROLES":
            viewRoles();
            break;

        case "ADD_ROLE":
            addRole();
            break;

        case "REMOVE_ROLE":
            removeRole();
            break;

        default:
            return quit();
    }
}

// View all EMLOYEES
async function viewEmployees() {
    const employees = await db.findAllEmployees();

    console.log("\n");
    console.table(employees);

    askUserForAction();
}

// View employees by DEPARTMENT
async function viewEmployeesByDepartment() {
    const departments = await db.findAllDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department would you like view?",
            choices: departmentChoices
        }
    ]);

    const employees = await db.findAllEmployeesByDepartment(departmentId);

    console.log("\n");
    console.table(employees);

    askUserForAction();
}
// View employees by MANAGER
async function viewEmployeesByManager() {
    const managers = await db.findAllEmployees();

    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { managerId } = await prompt([
        {
            type: "list",
            name: "managerId",
            message: "Which employee you would like to display their Manager?",
            choices: managerChoices
        }
    ]);

    const employees = await db.findAllEmployeesByManager(managerId);

    console.log("\n");

    if (employees.length === 0) {
        console.log("This employee does not have direct Manager");
    } else {
        console.table(employees);
    }

    askUserForAction();
}
// Delete employees

async function deleteEmployee() {
    const employees = await db.findAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to delete?",
            choices: employeeChoices
        }
    ]);

    await db.deleteEmployee(employeeId);

    console.log("Delete employee from the database");

    askUserForAction();
}
// Update Employees by ROLE
async function updateEmployeeRole() {
    const employees = await db.findAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee's role would you like to update?",
            choices: employeeChoices
        }
    ]);

    const roles = await db.findAllRoles();

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message: "What Role would you like to assing to the selected employee?",
            choices: roleChoices
        }
    ]);

    await db.updateEmployeeRole(employeeId, roleId);

    console.log("Employee Role updated!");

    askUserForAction();
}
// Update Employees by MANAGER

async function updateEmployeeManager() {
    const employees = await db.findAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which manager do you want to update?",
            choices: employeeChoices
        }
    ]);

    const managers = await db.findAllPossibleManagers(employeeId);

    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { managerId } = await prompt([
        {
            type: "list",
            name: "managerId",
            message:
                "Which employee would you like to change their Manager?",
            choices: managerChoices
        }
    ]);

    await db.updateEmployeeManager(employeeId, managerId);

    console.log("Updated employee's manager");

    askUserForAction();
}
// Displaying company ROLES
async function viewRoles() {
    const roles = await db.findAllRoles();

    console.log("\n");
    console.table(roles);

    askUserForAction();
}
// Adding ROLE
async function addRole() {
    const departments = await db.findAllDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const role = await prompt([
        {
            name: "title",
            message: "What Role would like to add?"
        },
        {
            name: "salary",
            message: "Define the Salary for this role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Please add the department to this Role?",
            choices: departmentChoices
        }
    ]);

    await db.createRole(role);

    console.log(`This ${role.title} has been added to the database`);

    askUserForAction();
}

// Delete Roles
async function deleteRole() {
    const roles = await db.findAllRoles();

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message:
                "Which would you like to delete? (FYI: This will also delete that employee)",
            choices: roleChoices
        }
    ]);

    await db.deleteRole(roleId);

    console.log("Role has been deleted");

    askUserForAction();
}

// Display DEPATMENT
async function viewDepartments() {
    const departments = await db.findAllDepartments();

    console.log("\n");
    console.table(departments);

    askUserForAction();
}

// Adding DEPARTMENT
async function addDepartment() {
    const department = await prompt([
        {
            name: "name",
            message: "Pleas provide the name of the Department that you want to add?"
        }
    ]);

    await db.createDepartment(department);

    console.log(`Department has been added ${department.name} to the database`);

    askUserForAction();
}
// Delete Department
async function deleteDepartment() {
    const departments = await db.findAllDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await prompt({
        type: "list",
        name: "departmentId",
        message:
            "Which department would you like to remove? (FYI: This will also delete employees and roles assigned to this Department!)",
        choices: departmentChoices
    });

    await db.deleteDepartment(departmentId);

    console.log(`Removed department from the database`);

    askUserForAction();
}


