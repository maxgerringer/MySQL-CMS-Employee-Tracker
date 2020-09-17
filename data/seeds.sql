USE employeesDB;

-- Departments
INSERT INTO department (name)
VALUES ("Admin");

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Operations");

INSERT INTO department (name)
VALUES ("Risk/QA");

-- Roles
INSERT INTO role (title, salary, department_id)
VALUES ("Senior Manager", 150000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Associate Manager", 75000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Level 3 Engineer", 125000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Level 2 Engineer", 100000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Controller", 150000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Staff Accountant", 50000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Risk Manager", 75000, 4);

-- Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Max", "Gerringer", 1, null); 

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jake", "Crumley", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Beckert", 2, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Brooke", "Beckert", 3, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Elizabeth", "Tully", 4, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Finn", "Thehuman", 5, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tanya", "Tucker", 6, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Christina", "Van Voorhis", 7, null);