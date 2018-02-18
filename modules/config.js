const
	ansi = require('ansi-escape-sequences')
	;

module.exports = {
	storage: {
		host: 'localhost',
		port: 3306,
		name: 'demo_stock_exchange',
		user: 'user',
		pass: 'pass'
	},
	logger: {
		path: {
			common: __dirname + './../logs/common.log'
		}
	},
	http: {
		port: 80
	},
	monitoring: {
		path: __dirname + './../misc/mon.html',
		port: 8080	// != http.port
	},
	texts: {
		FAIL_BASE_TARGETING: 'No Companies Passed from Targeting',
		FAIL_BUDGET_CHECK: 'No Companies Passed from Budget',
		FAIL_BASEBID_CHECK: 'No Companies Passed from BaseBid check',
		FAIL_ALL_CHECKS: 'No Companies Passed from all checks',
		LOG_REQUEST: 'Request:',
		LOG_FAILED: 'Failed',
		LOG_PASSED: 'Passed',
		LOG_BASE_TARGETING: 'BaseTargeting:',
		LOG_BUDGET_CHECK: 'BudgetCheck:',
		LOG_BASE_BID: 'BaseBid:',
		LOG_WINNER: 'Winner = ',
		CONSOLE_HELLO: [
			'Web server is listening on http://localhost:%s for requests.',
			'URL format: ' + ansi.style.cyan + 'http://localhost:%s/?CountryCode={CountryCode}&Category={Category}&BaseBid={BaseBid}' + ansi.style.reset,
			'You can access monitoring page on ' + ansi.style.cyan + '/mon.' + ansi.style.reset,
			'Type here:\n' + ansi.style.green + 'state' + ansi.style.reset + ' - to see stock exchage state,\n' + ansi.style.green + 'log' + ansi.style.reset + ' - to see log events\nor enter request right here in URL format.\nPress Ctrl+C to exit\n'
		].join('\n'),
		CONSOLE_INVALID_FORMAT: ansi.style.red + 'Unknown command or invalid URL format.' + ansi.style.reset,
		INVALID_URL: 'Invalid URL format'
	}
}