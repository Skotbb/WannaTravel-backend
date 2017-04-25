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

var citySchema = new Schema({
	name: { type: String, index: true, unique: true },
	flights: Array,
	countryId: Schema.Types.ObjectId,
	searchUrl: String
});
citySchema.plugin(_mongooseFindorcreate2.default);

citySchema.statics.addCity = function (city, country) {
	return City.findOne({ name: city.name }, function (err, result) {
		console.log("Finding.");
		// If no error
		if (!err) {
			// If no result
			if (!result) {
				// Create the city!
				console.log("Create new city.");
				return City.create({
					name: city.name,
					searchUrl: city.search,
					countryId: country._id || null
				}, function (err, city) {
					if (err) {
						console.log(err);
					} else {
						console.log(city.name + ' created.');
						return city;
					}
				});
			} else {
				console.log("City in db.");
				return result;
			}
		} else {
			console.log(err);
		}
	});
};

var City = _mongoose2.default.model('Cities', citySchema);
exports.City = City;
//# sourceMappingURL=city.js.map