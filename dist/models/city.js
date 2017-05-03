'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.City = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseFindorcreate = require('mongoose-findorcreate');

var _mongooseFindorcreate2 = _interopRequireDefault(_mongooseFindorcreate);

var _travelSettings = require('../travel-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// mongoose.connect(`mongodb://localhost/${databaseName}`)

var Schema = _mongoose2.default.Schema;

/**
 * Schema for Cities
 */
var citySchema = new Schema({
	name: { type: String, index: true, unique: true },
	flights: Array,
	countryId: Schema.Types.ObjectId,
	searchUrl: String
});
citySchema.plugin(_mongooseFindorcreate2.default);

var City = _mongoose2.default.model('Cities', citySchema);
exports.City = City;
//# sourceMappingURL=city.js.map