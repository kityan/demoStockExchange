const
	mysql = require('mysql'),
	EventEmitter = require("events").EventEmitter,
	util = require("util")
	;


const StorageManager = function (system) {
	this.system = system;
	let config = system.config.storage;
	this.pool = mysql.createPool({
		connectionLimit: 50,
		host: config.host,
		user: config.user,
		password: config.pass,
		database: config.name,
		port: config.port,
		multipleStatements: true
	});

}

util.inherits(StorageManager, EventEmitter);


/**
 * Get list of companies compared to given countryCodes and categories
 * @param {string[]} countryCodes 
 * @param {string[]} categories 
 */
StorageManager.prototype.getCompaniesForBaseTargeting = function (countryCodes, categories) {
	return new Promise((resolve, reject) => {
		let s1 = countryCodes.map(function (val) { return `countries.code = ${mysql.escape(val)}`; }).join(' OR ');
		let s2 = categories.map(function (val) { return `categories.title = ${mysql.escape(val)}`; }).join(' OR ');
		let query = `
			SELECT 
				companies.code, 
				GROUP_CONCAT(DISTINCT countries.code) AS countries, 
				GROUP_CONCAT(DISTINCT  categories.title) AS categories 
			FROM companies 
			LEFT JOIN companies_has_countries ON companies.id = companies_has_countries.companies_id
			LEFT JOIN countries ON countries.id = companies_has_countries.countries_id AND (${s1})
			LEFT JOIN companies_has_categories ON companies.id = companies_has_categories.companies_id 
			LEFT JOIN categories ON  companies_has_categories.categories_id = categories.id AND (${s2})
			GROUP BY companies.id
			`;
		this._runQuery(query, function (error, rows) {
			if (!error) { resolve(rows); } else { reject(error, query); }
		});
	});
}

/**
 * Get list of companies compared to some value of budget
 * We have in task this rule: 'Budget New = Budget - Bid'
 * That's why we need to check: 'budget >= bid' and not 'budget >= 0'
 */
StorageManager.prototype.getCompaniesForBudgetCheck = function(){
	return new Promise((resolve, reject) => {
		let query = `
			SELECT 
				code, 
				budget * 100 >= bid AS budgetCheck
			FROM companies;
			`;
		this._runQuery(query, function (error, rows) {
			if (!error) { resolve(rows); } else { reject(error, query); }
		});
	});
}

/**
 * Get list of companies compared to some value of bid
 * @param {number} compareTo - to comare bid to
 */
StorageManager.prototype.getCompaniesForBaseBidCheck = function(compareTo){
	return new Promise((resolve, reject) => {
		let query = `
			SELECT 
				code, 
				bid,
				bid >= ${compareTo} AS bidCheck
			FROM companies;
			`;
		this._runQuery(query, function (error, rows) {
			if (!error) { resolve(rows); } else { reject(error, query); }
		});
	});
}

/**
 * Update the budget
 * @param {string} companyCode
 */
StorageManager.prototype.updateBudget = function(companyCode){
	return new Promise((resolve, reject) => {
		let query = `
			UPDATE companies SET budget = budget - bid / 100
			WHERE budget * 100 >= bid AND code = ${mysql.escape(companyCode)};
			`;
		this._runQuery(query, function (error, rows) {
			if (!error) { resolve(rows); } else { reject(error, query); }
		});
	});
}



/**
 * Return view `stack_exchange_state` from db
 */
StorageManager.prototype.getStockExchangeState = function () {
	return new Promise((resolve, reject) => {
		let query = `
			SELECT * FROM stock_exchange_state;
			`;
		this._runQuery(query, function (error, rows) {
			if (!error) { resolve(rows); } else { reject(error, query); }
		});
	});
}

/**
 * Close all connections
 */
StorageManager.prototype.stop = function (callback) {
	this.pool.end(callback);
}

/**
 * Emit error event
 */
StorageManager.prototype._emitErrorEvent = function (error, query) {
	this.emit("error", { error: error, query: query });
}

/**
 * Wrapper for connections in pool
 * @param {string} query 
 * @param {function} callback 
 */
StorageManager.prototype._runQuery = function (query, callback) {
	this.pool.getConnection((error, connection) => {
		if (error) {
			this._emitErrorEvent(error, query);
			if (callback) { callback(error); }
		} else {
			connection.query(query, (error, rows, fields) => {
				connection.release();
				if (error) {
					this._emitErrorEvent(error, query);
				}
				if (callback) { callback(error, rows); }
			}
			);
		}
	});
}



module.exports = StorageManager;	