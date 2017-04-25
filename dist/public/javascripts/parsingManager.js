'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

/**
 * getCities Takes a country search url and parses the first row of cities
 * @param url - A Momondo-constructed search url
 * @returns {Promise.<void>}
 */
var getCities = exports.getCities = function () {
	var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(url) {
		var horseman, result;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						horseman = new Horseman({ timeout: 30000 });
						result = void 0;

						console.log("Getting cities for country.");
						return _context2.abrupt('return', horseman
						// .on("consoleMessage", function (msg) {
						// 	console.log(msg);
						// })
						.open(url)
						//.log("Opened for Cities in Country")
						.status().waitForSelector('div.ng-scope > div > div.flexiblesearch-option-content > label:nth-child(2) > div > span').click('div.ng-scope > div > div.flexiblesearch-option-content > label:nth-child(2) > div > span').log("Sorting by most popular").waitForSelector('div.flexiblesearch-main.ng-scope > div:nth-child(2) > div > div.ng-scope > div:nth-child(1) > span:nth-child(1) > div > div > a > span.flexiblesearch-result-button.ng-scope').screenshot("Cities.png").evaluate(function () {
							var cities = [];
							console.log("In city page.");

							$('div.flexiblesearch-main.ng-scope > div:nth-child(2) > div > div:nth-child(2)').find(' > div:nth-child(1)').children().each(function () {
								var name = $(this).find('div > div.container > a > span.city.ng-binding').text();
								var searchHref = $(this).find('div > div.container > a').attr('href');
								//console.log(name)
								var city = {
									name: name,
									search: 'http://www.momondo.com' + searchHref
								};
								cities.push(city);
							});
							//TODO Add support for parsing a second row of cities.

							return cities;
						}).then(function (results) {
							return result = results;
						}).close());

					case 4:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function getCities(_x2) {
		return _ref2.apply(this, arguments);
	};
}();

/**
 * getFlights function returns a "flight" object that consists of {best: {price: , duration}, cheapest: {price: , duration}}
 * @param url - momondo constructed url that directs to the flight page in the search results.
 * @returns {Promise.<void>}
 */


var getFlights = exports.getFlights = function () {
	var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(url) {
		var horseman, result;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						horseman = new Horseman({ timeout: 60000 });
						result = void 0;
						//console.log("Parsing in flights.")

						return _context3.abrupt('return', horseman
						// .on("consoleMessage", function (msg) {
						// 	console.log(msg);
						// })
						.open(url).log("Getting flights for City").status().waitForSelector('div#searchProgressText').wait(settings.searchTime)
						// .evaluate(function(){
						// 	return document.getElementById('searchProgressText').innerText
						// })
						// .then(function(result) {
						// 	console.log(result)
						//
						// 	if(result !== "Search complete"){
						// 		this.wait(5000)
						// 	}
						// })   //Good waitFor method
						// .waitFor(function(){
						// 	return document.getElementById('searchProgressText').innerText === "Search complete"
						// }, true)
						.screenshot("Flights.png").evaluate(function () {

							console.log("In flight page.");
							var cheapInner = document.getElementById('flight-tickets-sortbar-cheapest').querySelector('.inner');
							var cPrice = cheapInner.querySelector('span.price').querySelector('span.value').innerText;
							var cDur = cheapInner.querySelector('span.info').innerText;
							var bestInner = document.getElementById('flight-tickets-sortbar-bestdeal').querySelector('.inner');
							var bPrice = bestInner.querySelector('span.price').querySelector('span.value').innerText;
							var bDur = bestInner.querySelector('span.info').innerText;
							//console.log(nodeList)

							return {
								cheapest: {
									price: parseInt(cPrice) || -1,
									duration: cDur || "Unavailable"
								},
								best: {
									price: parseInt(bPrice) || -1,
									duration: bDur || "Unavailable"
								}
							};
						}).then(function (results) {
							return result = results;
						}).catch(function (err) {
							console.log(err);
						}).close());

					case 3:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function getFlights(_x3) {
		return _ref3.apply(this, arguments);
	};
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var moment = require('moment');
var Horseman = require('node-horseman');
var settings = require('../../travel-settings');

var parseCountry = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(countryArray) {
		var cities, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, country, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, city;

		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						cities = [];
						//console.log("Parsing Countries")

						_context.prev = 1;
						_iteratorNormalCompletion = true;
						_didIteratorError = false;
						_iteratorError = undefined;
						_context.prev = 5;
						_iterator = countryArray[Symbol.iterator]();

					case 7:
						if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
							_context.next = 45;
							break;
						}

						country = _step.value;
						_context.next = 11;
						return getCities(country.search);

					case 11:
						country.cities = _context.sent;

						console.log('Country: ' + country.name);

						_iteratorNormalCompletion2 = true;
						_didIteratorError2 = false;
						_iteratorError2 = undefined;
						_context.prev = 16;
						_iterator2 = country.cities[Symbol.iterator]();

					case 18:
						if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
							_context.next = 28;
							break;
						}

						city = _step2.value;
						_context.next = 22;
						return getFlights(city.search);

					case 22:
						city.flights = _context.sent;

						console.log(city.name);
						console.log(city.flights);

					case 25:
						_iteratorNormalCompletion2 = true;
						_context.next = 18;
						break;

					case 28:
						_context.next = 34;
						break;

					case 30:
						_context.prev = 30;
						_context.t0 = _context['catch'](16);
						_didIteratorError2 = true;
						_iteratorError2 = _context.t0;

					case 34:
						_context.prev = 34;
						_context.prev = 35;

						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}

					case 37:
						_context.prev = 37;

						if (!_didIteratorError2) {
							_context.next = 40;
							break;
						}

						throw _iteratorError2;

					case 40:
						return _context.finish(37);

					case 41:
						return _context.finish(34);

					case 42:
						_iteratorNormalCompletion = true;
						_context.next = 7;
						break;

					case 45:
						_context.next = 51;
						break;

					case 47:
						_context.prev = 47;
						_context.t1 = _context['catch'](5);
						_didIteratorError = true;
						_iteratorError = _context.t1;

					case 51:
						_context.prev = 51;
						_context.prev = 52;

						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}

					case 54:
						_context.prev = 54;

						if (!_didIteratorError) {
							_context.next = 57;
							break;
						}

						throw _iteratorError;

					case 57:
						return _context.finish(54);

					case 58:
						return _context.finish(51);

					case 59:
						return _context.abrupt('return', countryArray);

					case 62:
						_context.prev = 62;
						_context.t2 = _context['catch'](1);

						console.log(_context.t2);

					case 65:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined, [[1, 62], [5, 47, 51, 59], [16, 30, 34, 42], [35,, 37, 41], [52,, 54, 58]]);
	}));

	return function parseCountry(_x) {
		return _ref.apply(this, arguments);
	};
}();
//# sourceMappingURL=parsingManager.js.map