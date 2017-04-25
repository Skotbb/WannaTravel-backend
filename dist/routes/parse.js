'use strict';

var _country = require('../models/country');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var moment = require('moment');
var _ = require('lodash');
var mongoose = require('mongoose');
var Horseman = require('node-horseman');
var parsingManager = require('../public/javascripts/parsingManager');
// var databaseName =  require('../travel-settings')

//Models


var router = express.Router();

// let countriesILike = [
// 	"Ireland", "United Kingdom", "Australia", "Spain", "Canada", "Italy", "New Zealand", "Germany", "Netherlands",
// 	"Japan", "Ireland", "Greece", "Norway", "Sweden", "Denmark", "Iceland"
// ]
var countriesILike = ["Ireland"];

/* GET selections from form. */
router.get('/:days/:dayOfWeek', function (req, res, next) {
	req.socket.setTimeout(30 * 60 * 1000);
	req.socket.addListener('timeout', function () {
		req.socket.destroy();
	});
	// let dbString = "mongodb://localhost/" + databaseName.databaseName
	// mongoose.connect(dbString);

	try {
		// Get form variables
		var days = req.params.days;
		var dow = req.params.dayOfWeek;

		var dep = null;
		var ret = null;

		var dates = getTravelDates(dow, days);
		var horseman = new Horseman({ timeout: 10000 });
		//  "http://www.momondo.com/flights/mco-1/any-6/flights-from-orlando-intl-to-take-me-anywhere.html?TripType=2&SegNo=2&SDP0=03-05-2017&SDP1=10-05-2017&AD=1&TK=ECO&DO=false&NA=false"
		//var url = "http://www.momondo.com/flights/mco-1/any-6/flights-from-orlando-intl-to-take-me-anywhere.html?TripType=2&SegNo=2&SDP0=" +dep+ "&SDP1=" +ret+ "&AD=1&TK=ECO&DO=false&NA=false"
		console.log("Horseman created");
		// Variables from page
		var pageTitle = '';
		var countries = [];

		horseman.on("consoleMessage", function (msg) {
			console.log(msg);
		}).open(getUrl(dates.dep, dates.ret)).title().then(function (title) {
			console.log("Open");
			pageTitle = title;
			console.log(title);
			//res.render('results', {title: title, message: "Momondo?"});
		}).waitForSelector('div.ng-scope > div > div.flexiblesearch-option-content > label:nth-child(2) > div > span').click('div.ng-scope > div > div.flexiblesearch-option-content > label:nth-child(2) > div > span').log("Sorting by most popular").waitForSelector('div.flexiblesearch-main.ng-scope > div:nth-child(2) > div > div.ng-scope > div:nth-child(1) > span:nth-child(1) > div > div > a > span.flexiblesearch-result-button.ng-scope').screenshot("screen.png").evaluate(function (countriesILike) {
			var countries = [];
			console.log("In page.");
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
				var _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, country;

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								console.log('Checking ' + results.length + ' countries.');
								countries = results;

								_loop = function _loop(country) {
									try {
										_country.Country.findOne({ name: country.name }, function (err, result) {
											// If no error
											if (!err) {
												// If no result
												if (!result) {
													// Create the country!
													result = new _country.Country({
														name: country.name,
														searchUrl: country.search
													});
													console.log(country.name + ' created.');
													//Save new Country!
													result.save(function (error) {
														if (error) {
															throw error;
														}
														console.log("Saved.");
													});
												}
											}
										});
									} catch (e) {

										console.log(e);
									}
								};

								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context.prev = 6;
								for (_iterator = countries[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
									country = _step.value;

									_loop(country);
								}
								//countries = await parsingManager.parseCountry(countries)

								_context.next = 14;
								break;

							case 10:
								_context.prev = 10;
								_context.t0 = _context['catch'](6);
								_didIteratorError = true;
								_iteratorError = _context.t0;

							case 14:
								_context.prev = 14;
								_context.prev = 15;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 17:
								_context.prev = 17;

								if (!_didIteratorError) {
									_context.next = 20;
									break;
								}

								throw _iteratorError;

							case 20:
								return _context.finish(17);

							case 21:
								return _context.finish(14);

							case 22:
								res.render('results', { title: pageTitle, message: "Yooo, Momondo" });

							case 23:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[6, 10, 14, 22], [15,, 17, 21]]);
			}));

			return function (_x) {
				return _ref.apply(this, arguments);
			};
		}()).catch(function (error) {
			console.log(error);
		}).log("Closing.").close();
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
//# sourceMappingURL=parse.js.map