'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Country = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseFindorcreate = require('mongoose-findorcreate');

var _mongooseFindorcreate2 = _interopRequireDefault(_mongooseFindorcreate);

var _travelSettings = require('../travel-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// mongoose.connect(`mongodb://localhost/${databaseName}`)

var Schema = _mongoose2.default.Schema;

/**
 * Schema for countries
 */
var countrySchema = new Schema({
	name: { type: String, index: true, unique: true },
	cities: [{ type: Schema.Types.ObjectId, ref: 'City' }],
	searchUrl: String
});
countrySchema.plugin(_mongooseFindorcreate2.default);

var Country = _mongoose2.default.model('Countries', countrySchema);

exports.Country = Country;
//# sourceMappingURL=country.js.map