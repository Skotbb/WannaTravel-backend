'use strict';

var _utils = require('../../public/javascripts/utils');

var _country = require('../../models/country');

var _city = require('../../models/city');

var _flight = require('../../models/flight');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var _ = require('lodash');

var Horseman = require('node-horseman');
var parsingManager = require('../../public/javascripts/parsingManager');
var databaseName = require('../../travel-settings');

//Models


var router = express.Router();

router.get('/getForAllCountries', function (req, res, next) {
	var _this = this;

	req.socket.setTimeout(10 * 60 * 1000);
	req.socket.addListener('timeout', function () {
		req.socket.destroy();
	});

	// await mongoose.connect(`mongodb://localhost/${databaseName.databaseName}`);
	// let db = mongoose.connection;

	try {
		_country.Country.find({}, function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(err, countries) {
				var _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, country;

				return regeneratorRuntime.wrap(function _callee$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								// If errors. Shit.
								if (err) {
									res.render('response', { title: "Oops", message: "Something went wrong. " + err });
								}
								//If there are countries in the db.

								if (!countries) {
									_context2.next = 30;
									break;
								}

								_loop = regeneratorRuntime.mark(function _loop(country) {
									var cities, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, city;

									return regeneratorRuntime.wrap(function _loop$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													//For each country in the db
													console.log('Getting cities for ' + country.name);

													_context.next = 3;
													return parsingManager.getCities(country.searchUrl);

												case 3:
													cities = _context.sent;
													// Get cities attached to country.
													console.log("Got cities.");
													_iteratorNormalCompletion2 = true;
													_didIteratorError2 = false;
													_iteratorError2 = undefined;
													_context.prev = 8;
													for (_iterator2 = cities[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
														city = _step2.value;
														// For each city in the list.
														console.log('Checking ' + city.name);

														// let dbCity = await City.addCity(city, country)  // Add city to db and return it
														_city.City.findOrCreate({ name: city.name }, {
															searchUrl: city.search,
															countryId: country._id
														}, function (err, createdCity, created) {
															country.cities.addToSet(createdCity._id); // Add city id to country's city array.
															country.save(function (err, saved) {
																// And save.
																if (err) {
																	console.log(err);
																}
																if (saved) {
																	console.log("Country updated.");
																}
															});
														});
													}
													_context.next = 16;
													break;

												case 12:
													_context.prev = 12;
													_context.t0 = _context['catch'](8);
													_didIteratorError2 = true;
													_iteratorError2 = _context.t0;

												case 16:
													_context.prev = 16;
													_context.prev = 17;

													if (!_iteratorNormalCompletion2 && _iterator2.return) {
														_iterator2.return();
													}

												case 19:
													_context.prev = 19;

													if (!_didIteratorError2) {
														_context.next = 22;
														break;
													}

													throw _iteratorError2;

												case 22:
													return _context.finish(19);

												case 23:
													return _context.finish(16);

												case 24:
												case 'end':
													return _context.stop();
											}
										}
									}, _loop, _this, [[8, 12, 16, 24], [17,, 19, 23]]);
								});
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context2.prev = 6;
								_iterator = countries[Symbol.iterator]();

							case 8:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context2.next = 14;
									break;
								}

								country = _step.value;
								return _context2.delegateYield(_loop(country), 't0', 11);

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
								console.log("Redirecting to get countries.");
								res.redirect('/country/get');

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

		res.render('results', { title: "Cities", message: "Added cities to database!" });
	} catch (e) {
		res.render('results', { title: "Oops!", message: "Something went wrong! " + e });
	}
});

////////////// Helper functions ///////////////////////


module.exports = router;
//# sourceMappingURL=cityRoutes.js.map