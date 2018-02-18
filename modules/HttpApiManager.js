const
	EventEmitter = require("events").EventEmitter,
	util = require("util"),
	fs = require("fs"),
	express = require('express'),
	http = require('http')
	;

const HttpApiManager = function (system) {
	this.system = system;
	this.app = express();
	this.httpServer = http.createServer(this.app).listen(this.system.config.http.port);

	// placeOrder request
	this.app.get('/', (req, res, next) => {
		res.set('Content-type', 'text/plain; charset=utf-8');
		if (!req.query.CountryCode || !req.query.Category || !req.query.BaseBid || isNaN(req.query.BaseBid * 1)) {
			res.send(this.system.config.texts.INVALID_URL);
		} else {
			this.system.stockExchange.placeOrder({
				countryCodes: req.query.CountryCode.split(',').map(el => { return el.trim(); }),
				categories: req.query.Category.split(',').map(el => { return el.trim(); }),
				baseBid: req.query.BaseBid * 1
			})
				.then(
				companyCode => res.send(companyCode),
				err => res.send(err)
				);
		}
	});

	// service page for monitoring
	this.app.get('/mon', (req, res, next) => {
		fs.readFile(this.system.config.monitoring.path, (err, data) => {
			res.send(data
				.toString('utf8')
				.replace('{port}', this.system.config.monitoring.port)
			);
		})
	});

	// invalid URL
	this.app.get('*', (req, res, next) => {
		res.set('Content-type', 'text/plain; charset=utf-8');
		res.send(this.system.config.texts.INVALID_URL);
	});



}

util.inherits(HttpApiManager, EventEmitter);

module.exports = HttpApiManager;