-- Seeding Data into DEPARTMENT TABLE
INSERT INTO department (id, name)
VALUES (1, "Operations"),
       (2, "Human Resources"),
       (3, "Training"),
       (4, "Sales");

-- Seeding Data into ROLE TABLE
INSERT INTO role (id, title, salary, department_id)
VALUES 
(1, "Operations Manager", 50000, 1), 
(2, "Operations Supervisor", 40000, 2),
(3, "Human Resources Manager", 45000, 3), 
(4, "Human Resources Supervisor", 40000, 4),
(5, "Training Manager", 40000, 5), 
(6, "Training Supervisor", 35000, 6),
(7, "Sales Manager", 60000, 7), 
(8, "Sales Supervisor", 50000, 8);

-- Seeding Data into EMPLOYEE TABLE
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, "Sam", "Smith", 1, 2), 
(4, "Hanz", "Zimmer", 4, NULL), 
(3, "Ismail", "Khan", 3, 3), 
(5, "Ahmed", "Abid", 6, 1),
(2, "Mark", "Hamill", 7, NULL), 
(8, "Tom", "Riddle", 8, NULL),
(7, "Darth", "Vader", 5, NULL), 
(6, "Tony", "Stank", 2, 2);

-- SELECT department_id "Department Code", role_id
-- COUNT(*) "No of Employees",
-- SUM(salary) "Total Salary"
-- FROM employees
-- GROUP BY department_id, role_id
-- Server.js not here