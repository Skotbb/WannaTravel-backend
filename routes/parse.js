var express = require('express');
const moment = require('moment')
const _ = require('lodash')
const mongoose = require('mongoose')
var Horseman = require('node-horseman')
var parsingManager = require('../public/javascripts/parsingManager')
// var databaseName =  require('../travel-settings')

//Models
import { Country } from '../models/country'

var router = express.Router();

// let countriesILike = [
// 	"Ireland", "United Kingdom", "Australia", "Spain", "Canada", "Italy", "New Zealand", "Germany", "Netherlands",
// 	"Japan", "Ireland", "Greece", "Norway", "Sweden", "Denmark", "Iceland"
// ]
let countriesILike = ["Ireland"]

/* GET selections from form. */
router.get('/:days/:dayOfWeek', function(req, res, next) {
	req.socket.setTimeout(30 * 60 * 1000)
	req.socket.addListener('timeout', function() {
		req.socket.destroy()
	})
	// let dbString = "mongodb://localhost/" + databaseName.databaseName
	// mongoose.connect(dbString);

	try {
		// Get form variables
		var days = req.params.days
		var dow = req.params.dayOfWeek

		var dep = null
		var ret = null

		var dates = getTravelDates(dow, days)
		var horseman = new Horseman({timeout: 10000})
		//  "http://www.momondo.com/flights/mco-1/any-6/flights-from-orlando-intl-to-take-me-anywhere.html?TripType=2&SegNo=2&SDP0=03-05-2017&SDP1=10-05-2017&AD=1&TK=ECO&DO=false&NA=false"
		//var url = "http://www.momondo.com/flights/mco-1/any-6/flights-from-orlando-intl-to-take-me-anywhere.html?TripType=2&SegNo=2&SDP0=" +dep+ "&SDP1=" +ret+ "&AD=1&TK=ECO&DO=false&NA=false"
		console.log("Horseman created")
		// Variables from page
		var pageTitle = ''
		var countries = []

		horseman
			.on("consoleMessage", function(msg){
				console.log(msg);
			})
			.open(getUrl(dates.dep, dates.ret))
			.title()
			.then(function (title) {
				console.log("Open")
				pageTitle = title
				console.log(title)
				//res.render('results', {title: title, message: "Momondo?"});
			})
			.waitForSelector('div.ng-scope > div > div.flexiblesearch-option-content > label:nth-child(2) > div > span')
			.click('div.ng-scope > div > div.flexiblesearch-option-content > label:nth-child(2) > div > span')
			.log("Sorting by most popular")
			.waitForSelector('div.flexiblesearch-main.ng-scope > div:nth-child(2) > div > div.ng-scope > div:nth-child(1) > span:nth-child(1) > div > div > a > span.flexiblesearch-result-button.ng-scope')
			.screenshot("screen.png")
			.evaluate(function(countriesILike) {
				var countries = []
				console.log("In page.")
				console.log(countriesILike)

				$('div.mui-goexplore-result-row.ng-scope')
					.each(function() {
						$(this).children()
							.each(function () {
								var name = $(this).find('div > div.container > a > span.city.ng-binding').text()
								var searchHref = $(this).find('div > div.container > a').attr('href')
								// console.log(name)
								var country = {
									name: name,
									search: 'http://www.momondo.com' + searchHref
								}
								if(_.indexOf(countriesILike, country.name) !== -1) {
									countries.push(country)
								}
							})
					})
				return countries
			}, countriesILike)
			.then(async function (results) {
				console.log(`Checking ${results.length} countries.`)
				countries = results

				for(let country of countries) {
					try {
						Country.findOne({name: country.name}, (err, result) => {
							// If no error
							if (!err) {
								// If no result
								if (!result) {
									// Create the country!
									result = new Country({
										name: country.name,
										searchUrl: country.search
									})
									console.log(`${country.name} created.`)
									//Save new Country!
									result.save((error) => {
										if (error) {
											throw error;
										}
										console.log("Saved.")
									})
								}
							}
						})
					} catch (e) {

						console.log(e)
					}
				}
				//countries = await parsingManager.parseCountry(countries)

				res.render('results', {title: pageTitle, message: "Yooo, Momondo"})
			})
			.catch(function(error) {
				console.log(error)
			})
			.log("Closing.")
			.close()
	} catch (e) {
		console.log(e)
	}
});


module.exports = router;
