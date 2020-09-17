const inquirer = require("inquirer");
const table = require("console.table");

const connection = require("./config/connection");

const prompt = require("./config/prompt");

// A cool ASCII banner forked from the interwebs
console.log(`╔═════════════════════════════════════════════════════╗
║                                                     ║
║     _____                 _                         ║
║    | ____|_ __ ___  _ __ | | ___  _   _  ___  ___   ║
║    |  _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\  ║
║    | |___| | | | | | |_) | | (_) | |_| |  __/  __/  ║
║    |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|  ║
║                    |_|            |___/             ║
║                                                     ║
║     __  __                                          ║
║    |  \\/  | __ _ _ __   __ _  __ _  ___ _ __        ║
║    | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |\/ _ \\ '__|       ║
║    | |  | | (_| | | | | (_| | (_| |  __/ |          ║
║    |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|          ║
║                              |___/                  ║
║                                                     ║
\╚═════════════════════════════════════════════════════╝
`);

function initPrompt() {
   inquirer.prompt(prompt.initPrompt).then(function ({ task }) {
		switch (task) {
			case "View Employees":
				viewEmployee();
				break;
			case "View Employees by Manager":
				viewEmployeeByManager();
				break;
			case "View Employees by Department":
				viewEmployeeByDepartment();
				break;
			case "View Departments":
				viewDepartments();
				break;
			case "View Roles":
				viewRoles();
				break;
			case "View Department Budget":
				viewDepartmentBudget();
				break;
			case "Add Employee":
				addEmployee();
				break;
			case "Add Department":
				addDepartment();
				break;
			case "Add Role":
				addRole();
				break;
			case "Update Employee Role":
				updateEmployeeRole();
				break;
			case "Update Employee Manager":
				updateEmployeeManager();
				break;
			case "Remove Employee":
				deleteEmployee();
				break;
			case "Remove Department":
				deleteDepartment();
				break;
			case "Remove Role":
				deleteRole();
				break;
			case "Exit":
				console.log(
					`\n“So long, and thanks for all the fish!"\n`,
				);
				connection.end();
				break;
		}
	});
};

// View Functions...
function viewEmployee() {
	console.log("Employees:\n");

	let query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
   FROM employee e
   LEFT JOIN role r
	ON e.role_id = r.id
   LEFT JOIN department d
   ON d.id = r.department_id
   LEFT JOIN employee m
	ON m.id = e.manager_id`;

	connection.query(query, function (err, res) {
		if (err) throw err;

		console.table(res);
		console.log("\n=======================================\n");

		initPrompt();
	});
};

function viewEmployeeByManager() {
	console.log("Managers:\n");

	let query = `SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role r
	ON e.role_id = r.id
  	LEFT JOIN department d
  	ON d.id = r.department_id
  	LEFT JOIN employee m
	ON m.id = e.manager_id GROUP BY e.manager_id`;

	connection.query(query, function (err, res) {
		if (err) throw err;

		const managerChoices = res
			// Filter NULL (prevents selecting employees with no assigned manager)
			.filter((mgr) => mgr.manager_id)
			.map(({ manager_id, manager }) => ({
				value: manager_id,
				name: manager,
			}));

		inquirer
			.prompt(prompt.viewByManagerPrompt(managerChoices))
			.then(function (answer) {

				let query = `SELECT e.id, e.first_name, e.last_name, r.title, CONCAT(m.first_name, ' ', m.last_name) AS manager
			   FROM employee e
			   JOIN role r
			   ON e.role_id = r.id
			   JOIN department d
			   ON d.id = r.department_id
			   LEFT JOIN employee m
			   ON m.id = e.manager_id
			   WHERE m.id = ?`;

				connection.query(query, answer.managerId, function (err, res) {
					if (err) throw err;

					console.table("\nManager's reports:", res);
					console.log("\n==============================================\n");

					initPrompt();
				});
			});
	});
};

function viewEmployeeByDepartment() {
	console.log("View employees by department\n");

	let query = `SELECT d.id, d.name
	FROM employee e
	LEFT JOIN role r
	ON e.role_id = r.id
	LEFT JOIN department d
	ON d.id = r.department_id
	GROUP BY d.id, d.name`;

	connection.query(query, function (err, res) {
		if (err) throw err;

		const departmentChoices = res.map((data) => ({
			value: data.id,
			name: data.name,
		}));

		inquirer
			.prompt(prompt.viewByDepartmentPrompt(departmentChoices))
			.then(function (answer) {
				let query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
			   FROM employee e
			   JOIN role r
				ON e.role_id = r.id
			   JOIN department d
			   ON d.id = r.department_id
			   WHERE d.id = ?`;

				connection.query(query, answer.departmentId, function (err, res) {
					if (err) throw err;

					console.table("\nDepartments: ", res);
					console.log("\n============================================\n");

					initPrompt();
				});
			});
	});
};

function viewDepartments() {
	let query = "SELECT * FROM department";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.log(`\nDepartments:\n`);
		res.forEach((department) => {
			console.log(`ID: ${department.id} | ${department.name} Department`);
		});
		console.log("\n===========================================\n");
		initPrompt();
	});
}

function viewRoles() {
	let query = "SELECT * FROM role";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.log(`\nRoles:\n`);
		res.forEach((role) => {
			console.log(
				`ID: ${role.id} | Title: ${role.title}\n Salary: ${role.salary}\n`,
			);
		});
		console.log("\n===========================================\n");
		initPrompt();
	});
}

function viewDepartmentBudget() {
	let query = `SELECT d.name, 
	r.salary, sum(r.salary) AS budget
	FROM employee e 
	LEFT JOIN role r ON e.role_id = r.id
	LEFT JOIN department d ON r.department_id = d.id
	group by d.name`;

	connection.query(query, function (err, res) {
		if (err) throw err;

		console.log(`\nDepartment Budgets:\n`);
		res.forEach((department) => {
			console.log(
				`Department: ${department.name}\n Budget: ${department.budget}\n`,
			);
		});
		console.log("\n===========================================\n");
		initPrompt();
	});
}

// Add new functions...

const addEmployee = () => {
	let departmentArray = [];
	connection.query(`SELECT * FROM department`, (err, res) => {
		if (err) throw err;

		res.forEach((element) => {
			departmentArray.push(`${element.id} ${element.name}`);
      });
      
		let roleArray = [];
		connection.query(`SELECT id, title FROM role`, (err, res) => {
			if (err) throw err;

			res.forEach((element) => {
				roleArray.push(`${element.id} ${element.title}`);
         });
         
			let managerArray = [];
			connection.query(
				`SELECT id, first_name, last_name FROM employee`,
				(err, res) => {
					if (err) throw err;
					res.forEach((element) => {
						managerArray.push(
							`${element.id} ${element.first_name} ${element.last_name}`,
						);
					});

					inquirer
						.prompt(
							prompt.insertEmployee(departmentArray, roleArray, managerArray),
						)
						.then((response) => {

							let roleCode = parseInt(response.role);
							let managerCode = parseInt(response.manager);
							connection.query(
								"INSERT INTO employee SET ?",
								{
									first_name: response.firstName,
									last_name: response.lastName,
									role_id: roleCode,
									manager_id: managerCode,
								},
								(err, res) => {
									if (err) throw err;
									console.log("\n" + res.affectedRows + " employee added");
									console.log(
										"\n===========================================\n",
									);
									viewEmployee();
								},
							);
						});
				},
			);
		});
	});
};

function addDepartment() {
	inquirer.prompt(prompt.insertDepartment).then(function (answer) {
		var query = "INSERT INTO department (name) VALUES ( ? )";
		connection.query(query, answer.department, function (err, res) {
			if (err) throw err;
			console.log(
				`${answer.department.toUpperCase()} department has been created.`,
			);
		});
		console.log("\n============================================\n");
		viewDepartments();
	});
};


function addRole() {
	let query = `SELECT * FROM department`;

	connection.query(query, function (err, res) {
		if (err) throw err;

		const departmentChoices = res.map(({ id, name }) => ({
			value: id,
			name: `${id} ${name}`,
		}));

		inquirer
			.prompt(prompt.insertRole(departmentChoices))
			.then(function (answer) {
				let query = `INSERT INTO role SET ?`;

				connection.query(
					query,
					{
						title: answer.roleTitle,
						salary: answer.roleSalary,
						department_id: answer.departmentId,
					},
					function (err, res) {
						if (err) throw err;

						console.log("\n" + res.affectedRows + " role created");
						console.log("\n========================================\n");

						viewRoles();
					},
				);
			});
	});
};

// Update existing...
const updateEmployeeRole = () => {

	let employees = [];
	connection.query(
		`SELECT id, first_name, last_name
  FROM employee`,
		(err, res) => {
			if (err) throw err;

			res.forEach((element) => {
				employees.push(
					`${element.id} ${element.first_name} ${element.last_name}`,
				);
			});
		
			let job = [];
			connection.query(`SELECT id, title FROM role`, (err, res) => {
				if (err) throw err;

				res.forEach((element) => {
					job.push(`${element.id} ${element.title}`);
				});

				inquirer.prompt(prompt.updateRole(employees, job)).then((response) => {
			
					let idCode = parseInt(response.update);
					let roleCode = parseInt(response.role);
					connection.query(
						`UPDATE employee SET role_id = ${roleCode} WHERE id = ${idCode}`,
						(err, res) => {
							if (err) throw err;

							console.log(
								"\n" + "\n" + res.affectedRows + " Updated successfully!",
							);
							console.log("\n==================================================\n");
							initPrompt();
						},
					);
				});
			});
		},
	);
};

const updateEmployeeManager = () => {
	
	let employees = [];
	connection.query(
		`SELECT id, first_name, last_name
  FROM employee`,
		(err, res) => {
			res.forEach((element) => {
				
				employees.push(
					`${element.id} ${element.first_name} ${element.last_name}`,
				);
			});
	
			inquirer.prompt(prompt.updateManager(employees)).then((answer) => {
				
				let idCode = parseInt(answer.update);
				let managerCode = parseInt(answer.manager);
				connection.query(
					
					`UPDATE employee SET manager_id = ${managerCode} WHERE id = ${idCode}`,
					(err, res) => {
						if (err) throw err;

						console.log(
							"\n" + "\n" + res.affectedRows + " Updated successfully!",
						);
						console.log("\n==========================================\n");
						initPrompt();
					},
				);
			});
		},
	);
};

// Delete functions...
function deleteEmployee() {
	console.log("Deleting an employee");

	let query = `SELECT e.id, e.first_name, e.last_name
      FROM employee e`;

	connection.query(query, function (err, res) {
		if (err) throw err;
	
		const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
			value: id,
			name: `${id} ${first_name} ${last_name}`,
		}));

		inquirer
			.prompt(prompt.deleteEmployeePrompt(deleteEmployeeChoices))
			.then(function (answer) {
				let query = `DELETE FROM employee WHERE ?`;
				// after prompting, remove item from the db
				connection.query(query, { id: answer.employeeId }, function (err, res) {
					if (err) throw err;

					console.log("\n" + res.affectedRows + "  employee deleted");
					console.log("\n============================================\n");

					initPrompt();
				});
			});
	});
};

function deleteDepartment() {
	console.log("\nRemove a Department:\n");

	let query = `SELECT e.id, e.name FROM department e`;

	connection.query(query, function (err, res) {
		if (err) throw err;
		
		const deleteDepartmentChoices = res.map(({ id, name }) => ({
			value: id,
			name: `${id} ${name}`,
		}));

		inquirer
			.prompt(prompt.deleteDepartmentPrompt(deleteDepartmentChoices))
			.then(function (answer) {
				let query = `DELETE FROM department WHERE ?`;
				
				connection.query(query, { id: answer.departmentId }, function (
					err,
					res,
				) {
					if (err) throw err;

					console.log("\n" + res.affectedRows + " department deleted");
					console.log("\n===============================================\n");

					viewDepartments();
				});
			});
	});
};

function deleteRole() {
	console.log("Deleting a role");

	let query = `SELECT e.id, e.title, e.salary, e.department_id FROM role e`;

	connection.query(query, function (err, res) {
		if (err) throw err;
		
		const deleteRoleChoices = res.map(({ id, title }) => ({
			value: id,
			name: `${id} ${title}`,
		}));

		inquirer
			.prompt(prompt.deleteRolePrompt(deleteRoleChoices))
			.then(function (answer) {
				let query = `DELETE FROM role WHERE ?`;
				
				connection.query(query, { id: answer.roleId }, function (err, res) {
					if (err) throw err;

					console.log("\n" + res.affectedRows + " role deleted");
					console.log("\n==========================================\n");

					viewRoles();
				});
			});
	});
};

initPrompt();