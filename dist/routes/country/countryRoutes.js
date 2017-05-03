'use strict';

var _utils = require('../../public/javascripts/utils');

var _country = require('../../models/country');

var _city = require('../../models/city');

var _flight = require('../../models/flight');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var _ = require('lodash');
//const mongoose = require('mongoose')

var Horseman = require('node-horseman');
var parsingManager = require('../../public/javascripts/parsingManager');
var settings = require('../../travel-settings');

//Models


var router = express.Router();

/**
 *  country/get --Checks travel-settings for list of countries to add to database.
 */
router.get('/get', function (req, res, next) {
	req.socket.setTimeout(5 * 60 * 1000);
	req.socket.addListener('timeout', function () {
		req.socket.destroy();
	});

	try {
		// Get form variables

		var dates = (0, _utils.getTravelDates)();
		var horseman = new Horseman({ timeout: 10000 });
		console.log("Horseman created");
		// Variables from page
		var pageTitle = '';
		var countries = [];
		var countriesILike = settings.countriesILike;
		horseman.on("consoleMessage", function (msg) {
			console.log(msg);
		}).open((0, _utils.getUrl)(dates.dep, dates.ret)).title().then(function (title) {
			console.log("Open");
			pageTitle = title;
			console.log(title);
			//res.render('results', {title: title, message: "Momondo?"});
		}).waitForSelector('div.ng-scope > div > div.flexiblesearch-option-content > label:nth-child(2) > div > span').click('div.ng-scope > div > div.flexiblesearch-option-content > label:nth-child(2) > div > span').log("Sorting by most popular").waitForSelector('div.flexiblesearch-main.ng-scope > div:nth-child(2) > div > div.ng-scope > div:nth-child(1) > span:nth-child(1) > div > div > a > span.flexiblesearch-result-button.ng-scope').screenshot("screen.png").evaluate(function (countriesILike) {
			var countries = [];
			// console.log("In page.")
			console.log(countriesILike);

			$('div.mui-goexplore-result-row.ng-scope').each(function () {
				$(this).children().each(function () {
					var name = $(this).find('div > div.container > a > span.city.ng-binding').text();
					var searchHref = $(this).find('div > div.container > a').attr('href');
					// console.log(name)
					var country = {
						name: name,
						search: 'http://www.momondo.com' + searchHref
					};
					if (_.indexOf(countriesILike, country.name) !== -1) {
						countries.push(country);
					}
				});
			});
			return countries;
		}, countriesILike).then(function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(results) {
				var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, country;

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								console.log('Checking ' + results.length + ' countries.');
								countries = results;

								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context.prev = 5;
								for (_iterator = countries[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
									country = _step.value;

									try {
										_country.Country.findOrCreate({ name: country.name }, { searchUrl: country.search }, function (err, createdCountry, created) {
											if (created) {
												console.log(createdCountry.name + ' was added to db.');
											}
										});
									} catch (e) {
										console.log(e);
										res.render('results', { title: "Oops!", message: "Something went wrong! " + e });
									}
								}
								//countries = await parsingManager.parseCountry(countries)
								_context.next = 13;
								break;

							case 9:
								_context.prev = 9;
								_context.t0 = _context['catch'](5);
								_didIteratorError = true;
								_iteratorError = _context.t0;

							case 13:
								_context.prev = 13;
								_context.prev = 14;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 16:
								_context.prev = 16;

								if (!_didIteratorError) {
									_context.next = 19;
									break;
								}

								throw _iteratorError;

							case 19:
								return _context.finish(16);

							case 20:
								return _context.finish(13);

							case 21:
								console.log("Finished.");
								res.render('results', { title: pageTitle, message: "Added countries to database!" });

							case 23:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[5, 9, 13, 21], [14,, 16, 20]]);
			}));

			return function (_x) {
				return _ref.apply(this, arguments);
			};
		}()).catch(function (error) {
			console.log(error);
		}).log("Closing.").close();
	} catch (e) {
		console.log(e);
		res.render('results', { title: "Oops!", message: e });
	}
});

module.exports = router;
//# sourceMappingURL=countryRoutes.js.map