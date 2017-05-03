'use strict';

var _utils = require('../../public/javascripts/utils');

var _country = require('../../models/country');

var _city = require('../../models/city');

var _flight = require('../../models/flight');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var _ = require('lodash');

var parsingManager = require('../../public/javascripts/parsingManager');

//Models


var router = express.Router();

/**
 * flight/getForAllCities/int-#ofDays/0-6-dayOfWeek
 *  --Checks db for cities and gets flights for all cities.
 *  Uses travel-settings for amount of time to search each flight.
 */
router.get('/getForAllCities/:days/:dayOfWeek', function (req, res, next) {
	var _this = this;

	req.socket.setTimeout(10 * 60 * 1000);
	req.socket.addListener('timeout', function () {
		req.socket.destroy();
	});

	var days = req.params.days;
	var dow = req.params.dayOfWeek;

	var dates = (0, _utils.getTravelDates)(dow, days);

	try {
		_city.City.find({}, function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(err, cities) {
				var _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, city;

				return regeneratorRuntime.wrap(function _callee$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								// If errors. Shit.
								if (err) {
									res.render('response', { title: "Oops", message: "Something went wrong. " + err });
								}
								//If there are cities in the db.

								if (!cities) {
									_context2.next = 30;
									break;
								}

								_loop = regeneratorRuntime.mark(function _loop(city) {
									var newUrl, datedate, flight;
									return regeneratorRuntime.wrap(function _loop$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													//For each city in the db
													console.log('Getting flights for ' + city.name);
													newUrl = (0, _utils.updateFlightUrl)(city.searchUrl, dates.dep, dates.ret);
													datedate = (0, _utils.getDate)(dates.dep);
													_context.next = 5;
													return parsingManager.getFlights(newUrl);

												case 5:
													flight = _context.sent;
													// Get flights attached to city.
													console.log("Got flight.");

													// For the flight.
													console.log('Checking flights');

													_flight.Flight.findOrCreate({ searchUrl: newUrl }, {
														tripDuration: days,
														dayOfWeek: dow.toString(),
														cityName: city.name,
														cityId: city._id,
														date: datedate,
														best: flight.best,
														cheapest: flight.cheapest,
														searchUrl: newUrl
													}, function (err, createdFlight, created) {

														city.flights.addToSet(createdFlight._id); // Add flight id to city's flight array.
														if (!created) {
															if (createdFlight.best.price != flight.best.price || createdFlight.cheapest.price != flight.cheapest.price) {
																console.log('Best flight was $' + createdFlight.best.price + ' and is now $' + flight.best.price);
																console.log('Cheapest flight was $' + createdFlight.cheapest.price + ' and is now $' + flight.cheapest.price);
																createdFlight.best.price = flight.best.price;
																createdFlight.cheapest.price = flight.cheapest.price;
																createdFlight.save(function (err, save) {
																	if (err) {
																		throw err;
																	}
																	console.log('Flight to ' + save.cityName + ' had prices updated.');
																});
															}
														}
														city.save(function (err, saved) {
															// And save.
															if (err) {
																console.log(err);
															}
															if (saved) {
																console.log("City updated.");
															}
														});
													});

												case 9:
												case 'end':
													return _context.stop();
											}
										}
									}, _loop, _this);
								});
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context2.prev = 6;
								_iterator = cities[Symbol.iterator]();

							case 8:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context2.next = 14;
									break;
								}

								city = _step.value;
								return _context2.delegateYield(_loop(city), 't0', 11);

							case 11:
								_iteratorNormalCompletion = true;
								_context2.next = 8;
								break;

							case 14:
								_context2.next = 20;
								break;

							case 16:
								_context2.prev = 16;
								_context2.t1 = _context2['catch'](6);
								_didIteratorError = true;
								_iteratorError = _context2.t1;

							case 20:
								_context2.prev = 20;
								_context2.prev = 21;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 23:
								_context2.prev = 23;

								if (!_didIteratorError) {
									_context2.next = 26;
									break;
								}

								throw _iteratorError;

							case 26:
								return _context2.finish(23);

							case 27:
								return _context2.finish(20);

							case 28:
								_context2.next = 32;
								break;

							case 30:
								//No Countries in db.
								console.log("Redirecting to get cities.");
								res.redirect('/city/getForAllCountries');

							case 32:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee, _this, [[6, 16, 20, 28], [21,, 23, 27]]);
			}));

			return function (_x, _x2) {
				return _ref.apply(this, arguments);
			};
		}());

		res.render('results', { title: "Flights!", message: "Added Flights to database!" });
	} catch (e) {
		res.render('results', { title: "Oops!", message: "Something went wrong! " + e });
	}
});

////////////// Helper functions ///////////////////////


module.exports = router;
//# sourceMappingURL=flightRoutes.js.map