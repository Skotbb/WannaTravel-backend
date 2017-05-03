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

var Schema = _mongoose2.default.Schema;

/**
 * Schema for flights
 */
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

var Flight = _mongoose2.default.model('Flights', flightSchema);
exports.Flight = Flight;
//# sourceMappingURL=flight.js.map