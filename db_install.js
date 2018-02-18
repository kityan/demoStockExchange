const
	mysql = require('mysql'),
	fs  = require('fs')
	config = require("./modules/config.js");
;

let connection = mysql.createConnection({
	host: config.storage.host,
	user: config.storage.user,
	password: config.storage.pass,
	database: config.storage.name,
	port: config.storage.port,
	multipleStatements: true	
});

connection.connect();

fs.readFile('./model/export.sql', (err, data) => {
	let query = data.toString('utf8').replace(/demo_stock_exchange/g, config.storage.name);
	connection.query(query, () => {
		console.log('Data successfully installed. Now you can start the app.')
	});
	connection.end();	
});