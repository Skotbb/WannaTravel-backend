let express = require('express');
const _ = require('lodash')
//const mongoose = require('mongoose')
import { getUrl, getTravelDates } from '../../public/javascripts/utils'
let Horseman = require('node-horseman')
let parsingManager = require('../../public/javascripts/parsingManager')
let settings =  require('../../travel-settings')

//Models
import { Country } from '../../models/country'
import { City } from '../../models/city'
import { Flight } from '../../models/flight'

let router = express.Router();

/**
 *  country/get --Checks travel-settings for list of countries to add to database.
 */
router.get('/get', function(req, res, next) {
	req.socket.setTimeout(5 * 60 * 1000)
	req.socket.addListener('timeout', function() {
		req.socket.destroy()
	})

	try {
		// Get form variables

		var dates = getTravelDates()
		var horseman = new Horseman({timeout: 10000})
		console.log("Horseman created")
		// Variables from page
		var pageTitle = ''
		var countries = []
		var countriesILike = settings.countriesILike
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
				// console.log("In page.")
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
						Country.findOrCreate({name: country.name}, {searchUrl: country.search},
							function(err, createdCountry, created) {
								if(created){
									console.log(`${createdCountry.name} was added to db.`)
								}
							})
					} catch (e) {
						console.log(e)
						res.render('results', {title: "Oops!", message: "Something went wrong! "+e})
					}
				}
				//countries = await parsingManager.parseCountry(countries)
				console.log("Finished.")
				res.render('results', {title: pageTitle, message: "Added countries to database!"})
			})
			.catch(function(error) {
				console.log(error)
			})
			.log("Closing.")
			.close()
	} catch (e) {
		console.log(e)
		res.render('results', {title: "Oops!", message: e})
	}
});


module.exports = router;
