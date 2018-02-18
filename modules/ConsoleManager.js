const
	ansi = require('ansi-escape-sequences'),
	util = require("util"),
	querystring = require('querystring'),
	url = require('url'),
	Table = require('cli-table')
	;

const ConsoleManager = function (system) {

	this.system = system;

	console.log(util.format(this.system.config.texts.CONSOLE_HELLO, this.system.config.http.port, this.system.config.http.port));

	let stdin = process.openStdin();

	// read stdin input
	stdin.addListener("data", d => {
		let str = d.toString().trim();
		switch (str) {
			case 'state':
				showState.call(this);
				break;
			case 'log':
				showLog.call(this);
				break;
			default:
				if (!processRequest.call(this, str)) {
					console.log(this.system.config.texts.CONSOLE_INVALID_FORMAT);
				}
		}
	});

}


function showLog(){
	this.system.logger.getLog().then(
		buf => console.log(buf.toString()),
		() => {}
	)
}


function showState() {
	this.system.stockExchange.getState()
		.then(companies => {
			let table = new Table({
				head: ['CompanyID', 'Countries', 'Budget', 'Bid', 'Category'],
				colWidths: [12, 20, 10, 10, 40],
				style: { head: ['grey'] }
			});
			for (company of companies) {
				table.push([company.CompanyID, company.Countries, company.Budget, company.Bid, company.Category]);
			}
			console.log(table.toString());
		});
}


function processRequest(str) {
	let request = url.parse(str);
	let params = querystring.parse(request.query);
	if (!params.CountryCode || !params.Category || !params.BaseBid || isNaN(params.BaseBid * 1)) {
		return false;
	} else {
		this.system.stockExchange.placeOrder({
			countryCodes: params.CountryCode.split(',').map(el => { return el.trim(); }),
			categories: params.Category.split(',').map(el => { return el.trim(); }),
			baseBid: params.BaseBid * 1
		})
			.then(
			companyCode => console.log(companyCode),
			err => console.log(err)
			);
		return true;
	}
}

module.exports = ConsoleManager;