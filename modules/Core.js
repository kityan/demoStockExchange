const Core = function () {
	let system = {}

	system.config = require("./config.js");
	system.logger = new (require('./Logger.js'))(system);
	system.storageManager = new (require('./StorageManager.js'))(system);
	system.stockExchange = new (require('./StockExchange.js'))(system);

	system.consoleManager = new (require('./ConsoleManager.js'))(system);
	system.httpApiManager = new (require('./HttpApiManager.js'))(system);
	system.monitoringManager = new (require('./MonitoringManager.js'))(system);
	

	system.storageManager.on('error', function (error) {
		console.log(error);
	})

	this.system = system;

}

module.exports = Core;