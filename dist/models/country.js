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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// mongoose.connect(`mongodb://localhost/${databaseName}`)

var Schema = _mongoose2.default.Schema;

var countrySchema = new Schema({
	name: { type: String, index: true, unique: true },
	cities: [{ type: Schema.Types.ObjectId, ref: 'City' }],
	searchUrl: String
});
countrySchema.plugin(_mongooseFindorcreate2.default);

countrySchema.statics.addCountry = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(country) {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						Country.findOne({ name: country.name }, function (err, result) {
							console.log("Finding.");
							// If no error
							if (!err) {
								// If no result
								if (!result) {
									// Create the country!
									console.log("Create new country.");
									Country.create({
										name: country.name,
										searchUrl: country.search
									}, function (err, country) {
										if (err) {
											console.log(err);
										} else {
											console.log(country.name + ' created.');
										}
									});
								}
								console.log("country in db.");
								return;
							} else {
								console.log(err);
							}
						});

					case 1:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function (_x) {
		return _ref.apply(this, arguments);
	};
}();

var Country = _mongoose2.default.model('Countries', countrySchema);

exports.Country = Country;
//# sourceMappingURL=country.js.map