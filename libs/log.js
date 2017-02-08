'use strict';

var log4js = require('log4js');
var config = require('./../configs/config');

/**
 * @Constructor
 */
var Logger = function (fileName, isPrintConsole) {
	// Write log to file
	var appenders = [{
		type: 'dateFile',
		filename: fileName,
		pattern: '.yyyy.MM.dd',
		alwaysIncludePattern: false,
		category: 'Server'
	}];

	// Write log to console
	if (isPrintConsole) {
		appenders.push({
			type: 'console'
		});
	}

	log4js.configure({
		appenders: appenders
	});

	this.logger = log4js.getLogger('Server');
};

/**
 * Set level to write log
 */
Logger.prototype.setLevel = function (level) {
	this.logger.setLevel(level);
};

/**
 * Trace
 */
Logger.prototype.trace = function (content) {
	this.logger.trace(content);
};

/**
 * Debug
 */
Logger.prototype.debug = function (content) {
	this.logger.debug(content);
};

/**
 * Info
 */
Logger.prototype.info = function (content) {
	this.logger.info(content);
};

/**
 * Warning
 */
Logger.prototype.warn = function (content) {
	this.logger.warn(content);
};

/**
 * Error
 */
Logger.prototype.error = function (content) {
	this.logger.error(content);
};

/**
 * Fatal
 */
Logger.prototype.fatal = function (content) {
	this.logger.fatal(content);
};

module.exports = new Logger(config.log.file_name, config.log.print_console);