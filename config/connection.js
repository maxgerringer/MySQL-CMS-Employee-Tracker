const mysql = require("mysql");
let connection = mysql.createConnection({
	
	host: "localhost",
	port: 3306,
	user: "root",
	password: "12345678",
	database: "employeesDB",
});

connection.connect(function (err) {
	if (err) throw err;
});

module.exports = connection;