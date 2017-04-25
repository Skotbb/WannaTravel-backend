'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Flight = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseFindorcreate = require('mongoose-findorcreate');

var _mongooseFindorcreate2 = _interopRequireDefault(_mongooseFindorcreate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Schema = _mongoose2.default.Schema;

var flightSchema = new Schema({
	date: Date,
	best: {
		price: Number,
		duration: String
	},
	cheapest: {
		price: Number,
		duration: String
	},
	cityName: String,
	cityId: Schema.Types.ObjectId,
	searchUrl: String,
	dayOfWeek: String,
	tripDuration: Number
});
flightSchema.plugin(_mongooseFindorcreate2.default);

flightSchema.statics.addFlight = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(flight, city) {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						return _context2.abrupt('return', Flight.findOne({ searchUrl: flight.search }, function () {
							var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(err, result) {
								return regeneratorRuntime.wrap(function _callee$(_context) {
									while (1) {
										switch (_context.prev = _context.next) {
											case 0:
												console.log('Searching db');
												// If no error.

												if (err) {
													_context.next = 20;
													break;
												}

												if (result) {
													_context.next = 7;
													break;
												}

												_context.next = 5;
												return Flight.create({ // Add flight to db and return it
													tripDuration: flight.tripDuration,
													dayOfWeek: flight.dayOfWeek,
													cityName: city.name || null,
													cityId: city._id || null,
													date: flight.date,
													best: flight.best,
													cheapest: flight.cheapest,
													searchUrl: flight.search
												}, function (err, flight) {
													if (err) {
														throw err;
													} else {
														console.log("Flight added");
														return flight;
													}
												});

											case 5:
												_context.next = 18;
												break;

											case 7:
												if (!(result.best !== flight.best || result.cheapest !== flight.cheapest)) {
													_context.next = 16;
													break;
												}

												console.log('Best flight was $' + result.best.price + ' and is now $' + flight.best.price);
												console.log('Cheapest flight was $' + result.cheapest.price + ' and is now $' + flight.cheapest.price);
												result.best = flight.best;
												result.cheapest = flight.cheapest;
												//save
												result.save(function (err, thing) {
													if (err) {
														throw err;
													}
													console.log('Flights updated for ' + city.name);
												});
												return _context.abrupt('return', result);

											case 16:
												console.log("Flight in db.");
												return _context.abrupt('return', result);

											case 18:
												_context.next = 21;
												break;

											case 20:
												console.log(err);

											case 21:
											case 'end':
												return _context.stop();
										}
									}
								}, _callee, undefined);
							}));

							return function (_x3, _x4) {
								return _ref2.apply(this, arguments);
							};
						}()));

					case 1:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}();

var Flight = _mongoose2.default.model('Flights', flightSchema);
exports.Flight = Flight;
//# sourceMappingURL=flight.js.map