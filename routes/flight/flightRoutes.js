let express = require('express');
const _ = require('lodash')

import {updateFlightUrl, getTravelDates, getDate} from '../../public/javascripts/utils'

let parsingManager = require('../../public/javascripts/parsingManager')


//Models
import {Country} from '../../models/country'
import {City} from '../../models/city'
import {Flight} from '../../models/flight'

let router = express.Router();

router.get('/getForAllCities/:days/:dayOfWeek', function (req, res, next) {
	req.socket.setTimeout(10 * 60 * 1000)
	req.socket.addListener('timeout', function () {
		req.socket.destroy()
	})

	let days = req.params.days
	let dow = req.params.dayOfWeek

	let dates = getTravelDates(dow, days);

	try {
		City.find({}, async (err, cities) => {
			// If errors. Shit.
			if (err) {
				res.render('response', {title: "Oops", message: "Something went wrong. " + err})
			}
			//If there are cities in the db.
			if (cities) {
				for (let city of cities) {    //For each city in the db
					console.log(`Getting flights for ${city.name}`)
					let newUrl = updateFlightUrl(city.searchUrl, dates.dep, dates.ret)
					let datedate = getDate(dates.dep)
					let flight = await parsingManager.getFlights(newUrl)    // Get flights attached to city.
					console.log("Got flight.")

					// For the flight.
					console.log(`Checking flights`)

					Flight.findOrCreate({searchUrl: newUrl}, {
						tripDuration: days,
						dayOfWeek: dow.toString(),
						cityName: city.name,
						cityId: city._id,
						date: datedate,
						best: flight.best,
						cheapest: flight.cheapest,
						searchUrl: newUrl
					}, function (err, createdFlight, created) {

						city.flights.addToSet(createdFlight._id);      // Add flight id to city's flight array.
						if (!created) {
							if (createdFlight.best.price != flight.best.price || createdFlight.cheapest.price != flight.cheapest.price) {
								console.log(`Best flight was $${createdFlight.best.price} and is now $${flight.best.price}`)
								console.log(`Cheapest flight was $${createdFlight.cheapest.price} and is now $${flight.cheapest.price}`)
								createdFlight.best.price = flight.best.price
								createdFlight.cheapest.price = flight.cheapest.price
								createdFlight.save((err, save) => {
									if (err) {
										throw err
									}
									console.log(`Flight to ${save.cityName} had prices updated.`)
								})
							}
						}
						city.save((err, saved) => {              // And save.
							if (err) {
								console.log(err)
							}
							if (saved) {
								console.log("City updated.")
							}
						})
					})


				}
			} else {  //No Countries in db.
				console.log("Redirecting to get cities.")
				res.redirect('/city/getForAllCountries')
			}
		})

		res.render('results', {title: "Flights!", message: "Added Flights to database!"})
	} catch (e) {
		res.render('results', {title: "Oops!", message: "Something went wrong! " + e})
	}
})


////////////// Helper functions ///////////////////////


module.exports = router;