const
	EventEmitter = require("events").EventEmitter,
	util = require("util"),
	fs = require('fs'),
	dateFormat = require('dateformat')
	;

const Logger = function (system) {
	this.system = system;
	this.logFile = fs.openSync(this.system.config.logger.path.common, "a+");
}

util.inherits(Logger, EventEmitter);

Logger.prototype.log = function (data) {
	var dt = new Date();
	this.emit("update", { dt: dt, data: data });
	fs.write(this.logFile, dateFormat(dt, 'yyyy-mm-dd HH:MM:ss') + '\t' + data + '\n', () => { });
}

Logger.prototype.logBaseTargeting = function (details) {
	this.log(this.system.config.texts.LOG_BASE_TARGETING + createString.call(this, details));
}

Logger.prototype.logBudgetCheck = function (details) {
	this.log(this.system.config.texts.LOG_BUDGET_CHECK + createString.call(this, details));
}

Logger.prototype.logBaseBidCheck = function (details) {
	this.log(this.system.config.texts.LOG_BASE_BID + createString.call(this, details));
}

Logger.prototype.logRequest = function (apiRequest) {
	this.log(this.system.config.texts.LOG_REQUEST + JSON.stringify(apiRequest));
}

Logger.prototype.logWinner = function (code) {
	this.log(this.system.config.texts.LOG_WINNER + code);
}

Logger.prototype.getLog = function () {
	// stream?
	return new Promise((resolve, reject) => {
		fs.readFile(this.logFile, (err, buf) => { if (err) { reject(); } else { resolve(buf); } });
	});
}


/**
 * Create log string accoriding to the task: {C1, Passed},{C2,Failed},{C1,Passed}
 */
function createString(details) {
	let strs = [];
	for (let k in details) {
		strs.push('{' + k + ',' + (details[k] ? this.system.config.texts.LOG_PASSED : this.system.config.texts.LOG_FAILED) + '}');
	}
	return strs.join(',');
}


module.exports = Logger;