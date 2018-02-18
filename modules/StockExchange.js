const
	EventEmitter = require("events").EventEmitter,
	util = require("util")
	;

const StockExchange = function (system) {
	this.system = system;
}

util.inherits(StockExchange, EventEmitter);

/**
 * @typedef {Object} ApiRequest
 * @property {*} source 
 * @property {string[]} countryCodes
 * @property {string[]} categories
 * @property {number} baseBid
 */

/**
 * Process request to API made from any source (HTTP, STDIN)
 * @param {ApiRequest} apiRequest 
 */

StockExchange.prototype.placeOrder = function (apiRequest) {

	// this.system.logger.logRequest(apiRequest);

	return new Promise((resolve, reject) => {

		let checks = {
			'BaseTargeting': { anyPassed: false, details: {} },
			'Budget': { anyPassed: false, details: {} },
			'BaseBid': { anyPassed: false, details: {} }
		}

		// Base Targeting check

		this.system.storageManager.getCompaniesForBaseTargeting(apiRequest.countryCodes, apiRequest.categories)

			.then(companies => {
				let check = checks['BaseTargeting'];
				for (company of companies) {
					check.details[company.code] = (company.categories && company.countries) ? true : false;
					check.anyPassed = check.anyPassed || check.details[company.code];
				}
				this.system.logger.logBaseTargeting(check.details);
				if (!check.anyPassed) {
					reject(this.system.config.texts.FAIL_BASE_TARGETING);
					throw (new Error());
				} else {
					return true;
				}
			})

			// Budget Check

			.then(() => {
				return this.system.storageManager.getCompaniesForBudgetCheck();
			})

			.then(companies => {
				let check = checks['Budget'];
				for (company of companies) {
					check.details[company.code] = (company.budgetCheck) ? true : false;
					check.anyPassed = check.anyPassed || check.details[company.code];
				}
				this.system.logger.logBudgetCheck(check.details);
				if (!check.anyPassed) {
					reject(this.system.config.texts.FAIL_BUDGET_CHECK);
					throw (new Error());
				} else {
					return true;
				}
			})

			// BaseBid Check

			.then(() => {
				return this.system.storageManager.getCompaniesForBaseBidCheck(apiRequest.baseBid);
			})
			.then(companies => {
				let check = checks['BaseBid'];
				let bids = {};
				for (company of companies) {
					bids[company.code] = company.bid;
					check.details[company.code] = (company.bidCheck) ? true : false;
					check.anyPassed = check.anyPassed || check.details[company.code];
				}
				this.system.logger.logBaseBidCheck(check.details);
				if (!check.anyPassed) {
					reject(this.system.config.texts.FAIL_BASEBID_CHECK);
					throw (new Error());
				} else {
					return bids;
				}
			})

			// lets select companies passed all checks
			// we don't do it during steps because the task requires to log each check results independently (?)
			.then(bids => {

				// lets check all checks results
				let selected = [];
				for (let code in bids) {
					if (
						checks['BaseTargeting'].details[code] &&
						checks['BaseBid'].details[code] &&
						checks['Budget'].details[code]
					) {
						selected.push({ code: code, bid: bids[code] });
					}
				}

				if (!selected.length) {
					//this.system.logger.logAllChecksFail();
					reject(this.system.config.texts.FAIL_ALL_CHECKS);
					throw (new Error());
				} else {
					return selected;
				}

			})



			// Shortlisting and budget update
			.then(selected => {
				return new Promise((resolve, reject) => {

					let _placeOrder = () => {
						// on 2nd+ tries:
						if (!selected.length) { // no more companies in selected list
							//this.system.logger.logRaceConditionTotalFail();
							reject(this.system.config.texts.FAIL_ALL_CHECKS); // we had them at first, due to the race condition we failed
							return;
						}
						// now we try reduce the budget
						let company = selected.splice(_getIndexOfTheWinner(selected), 1)[0];
						// but we can fail due to the race condition
						this.system.storageManager.updateBudget(company.code).then(result => {
							if (result.affectedRows) { // ok, budget updated
								resolve(company.code);
							} else { // race condition
								// try again with another in the list
								_placeOrder();
							}
						})
					}

					_placeOrder(); // 1st try

				});
			})

			// finish
			.then(companyCode => {
				this.system.logger.logWinner(companyCode);
				resolve(companyCode);
				this.system.stockExchange.getState().then(companies => {
					this.emit('update', companies);
				});
			})

			.catch(err => {
				//console.log(err);
			});

	});
}


/**
 * Get stock exchage state
 */
StockExchange.prototype.getState = function () {
	return this.system.storageManager.getStockExchangeState();
}


/**
 * @typedef {Object} SelectedCompanies
 * @property {string} code
 * @property {number} bid
 */

/**
 * Get array index of the first company with maximum bid.
 * We need index, because we are going to manipulate the array
 * @param {SelectedCompanies} selectedCompanies 
 * @returns {number}
 */
function _getIndexOfTheWinner(selectedCompanies) {
	let maxValue = -Infinity;
	let index = null;
	for (let i = 0, qty = selectedCompanies.length; i < qty; i++) {
		if (selectedCompanies[i].bid > maxValue) {
			maxValue = selectedCompanies[i].bid;
			index = i;
		}
	}
	return index;
}


module.exports = StockExchange;
