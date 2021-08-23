-- Seeding Data into DEPARTMENT TABLE
INSERT INTO department (name)
VALUES ("Operations"),
       ("Human Resources"),
       ("Training"),
       ("Sales");

-- Seeding Data into ROLE TABLE
INSERT INTO role (title, salary, department_id)
VALUES 
("Operations Manager", 50000, 1), ("Operations Supervisor", 40000, 1),
("Human Resources Manager", 45000, 2), ("Human Resources Supervisor", 40000, 2),
("Training Manager", 40000, 3), ("Training Supervisor", 35000, 3),
("Sales Manager", 60000, 4), ("Sales Supervisor", 50000, 4);

-- Seeding Data into EMPLOYEE TABLE
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Sam", "Smith", 1, 2), ("Hanz", "Zimmer", 3, NULL), 
("Ismail", "Khan", 2, 3), ("Ahmed", "Abid", 1, 1),
("Mark", "Hamill", 4, NULL), ("Tom", "Riddle", 1, NULL),
("Darth", "Vader", 3, NULL), ("Tony", "Stank", 2, 2),
