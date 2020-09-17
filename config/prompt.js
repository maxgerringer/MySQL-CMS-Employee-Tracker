module.exports = {

	initPrompt: {
		type: "list",
		name: "task",
		message: "Make a selection:",
		choices: [
			
			"View Employees", // viewEmployee();
			"View Employees by Manager", // viewEmployeeByManager();
			"View Employees by Department", // viewEmployeeByDepartment();
			"View Departments", // viewDepartments();
			"View Roles", // viewRoles();
			"View Department Budget", // viewDepartmentBudget();
			
			"Add Employee", // addEmployee();
			"Add Department", // addDepartment();
			"Add Role", // addRole();
			
			"Update Employee Role", // updateEmployeeRole();
			"Update Employee Manager", // updateEmployeeManager();
			
			"Remove Employee", // removeEmployees();
			"Remove Department", // removeDepartment();
			"Remove Role", // removeRole();
			
			"Exit",
		],
   },

// View By...
   viewByManagerPrompt: (managerChoices) => [
		{
			type: "list",
			name: "managerId",
			message: "Which manager will you choose?",
			choices: managerChoices,
		},
   ],
   
	viewByDepartmentPrompt: (departmentChoices) => [
		{
			type: "list",
			name: "departmentId",
			message: "Which department will you choose?",
			choices: departmentChoices,
		},
   ],

// Add new...
   insertEmployee: (departmentArray, roleArray, managerArray) => [
		{
			name: "firstName",
			type: "input",
			message: "Enter employee's first name:",
		},

		{
			name: "lastName",
			type: "input",
			message: "Enter employee's last name:",
		},

		{
			name: "department",
			type: "list",
			message: "Choose employee's department",
			choices: departmentArray,
		},

		{
			name: "role",
			type: "list",
			message: "Choose employee's job position",
			choices: roleArray,
		},

		{
			name: "manager",
			type: "list",
			message: "Choose the manager of this employee:",
			choices: managerArray,
		},
	],

	insertDepartment: {
		name: "department",
		type: "input",
		message: "What is the name of the new department?",
	},

	insertRole: (departmentChoices) => [
		{
			type: "input",
			name: "roleTitle",
			message: "Role title?",
		},
		{
			type: "input",
			name: "roleSalary",
			message: "Role Salary",
		},
		{
			type: "list",
			name: "departmentId",
			message: "Department?",
			choices: departmentChoices,
		},
   ],
   
   // Update existing...
   updateRole: (employees, job) => [
		{
			name: "update",
			type: "list",
			message: "Choose the employee whose role is to be updated:",
			choices: employees,
		},

		{
			name: "role",
			type: "list",
			message: "Choose employee's job position",
			choices: job,
		},
	],

	updateManager: (employees) => [
		{
			name: "update",
			type: "list",
			message: "Choose the employee whose manager is to be updated:",
			choices: employees,
		},

		{
			name: "manager",
			type: "list",
			message: "Choose employee's new manager",
			choices: employees,
		},
   ],
   
// Delete existing...
	deleteEmployeePrompt: (deleteEmployeeChoices) => [
		{
			type: "list",
			name: "employeeId",
			message: "Which employee do you want to remove?",
			choices: deleteEmployeeChoices,
		},
	],

	deleteDepartmentPrompt: (deleteDepartmentChoices) => [
		{
			type: "list",
			name: "departmentId",
			message: "Which department do you want to remove?",
			choices: deleteDepartmentChoices,
		},
	],

	deleteRolePrompt: (deleteRoleChoices) => [
		{
			type: "list",
			name: "roleId",
			message: "Which role do you want to remove?",
			choices: deleteRoleChoices,
		},
	],
};
