const
	EventEmitter = require("events").EventEmitter,
	util = require("util"),
	express = require('express'),
	http = require('http'),
	WebSocketServer = require('websocket').server
	;

const MonitoringManager = function (system) {
	this.system = system;
	this.wsServer = new WebSocketServer({
		httpServer: http.createServer(function () { }).listen(this.system.config.monitoring.port),
		autoAcceptConnections: false,
		maxReceivedFrameSize: 512000
	});
	this.wsServer.on('request', function (request) {
		let connection = request.accept(null, request.origin);
		connection.on('close', function () { });
	});

	// subscribe to events from logger and stockExchange, so we can send them to monitoring page
	this.system.logger.on('update', (data) => {
		sendToPages.call(this, {type: 'log', data: data});
	});
	this.system.stockExchange.on('update', (data) => {
		sendToPages.call(this, {type: 'state', data: data});
	});
}


function sendToPages(data) {
	for (var i = 0; i < this.wsServer.connections.length; i++) {
		this.wsServer.connections[i].send(JSON.stringify(data));
	}
}

util.inherits(MonitoringManager, EventEmitter);

module.exports = MonitoringManager;