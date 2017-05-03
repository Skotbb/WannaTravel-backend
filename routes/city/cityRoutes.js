let express = require('express');
const _ = require('lodash')

import {getUrl, getTravelDates} from '../../public/javascripts/utils'
let Horseman = require('node-horseman')
let parsingManager = require('../../public/javascripts/parsingManager')
let databaseName = require('../../travel-settings')

//Models
import {Country} from '../../models/country'
import {City} from '../../models/city'
import {Flight} from '../../models/flight'

let router = express.Router();

/**
 * city/getForAllCountries --Checks database for existing countries and gathers cities for those countries.
 */
router.get('/getForAllCountries', function (req, res, next) {
	req.socket.setTimeout(10 * 60 * 1000)
	req.socket.addListener('timeout', function () {
		req.socket.destroy()
	})

	// await mongoose.connect(`mongodb://localhost/${databaseName.databaseName}`);
	// let db = mongoose.connection;

	try {
		Country.find({}, async (err, countries) => {
			// If errors. Shit.
			if (err) {
				res.render('response', {title: "Oops", message: "Something went wrong. " + err})
			}
			//If there are countries in the db.
			if (countries) {
				for (let country of countries) {    //For each country in the db
					console.log(`Getting cities for ${country.name}`)

					let cities = await parsingManager.getCities(country.searchUrl)    // Get cities attached to country.
					console.log("Got cities.")
					for (let city of cities) {        // For each city in the list.
						console.log(`Checking ${city.name}`)

						// let dbCity = await City.addCity(city, country)  // Add city to db and return it
						City.findOrCreate({name: city.name}, {
							searchUrl: city.search,
							countryId: country._id,
						}, function(err, createdCity, created) {
							country.cities.addToSet(createdCity._id);      // Add city id to country's city array.
							country.save((err,saved) => {             // And save.
								if(err){
									console.log(err)
								}
								if(saved){
									console.log("Country updated.")
								}
							})
						})


					}
				}
			} else {  //No Countries in db.
				console.log("Redirecting to get countries.")
				res.redirect('/country/get')
			}
		})

		res.render('results', {title: "Cities", message: "Added cities to database!"})
	} catch (e) {
		res.render('results', {title: "Oops!", message: "Something went wrong! " + e})
	}
})


////////////// Helper functions ///////////////////////



module.exports = router;