const moment = require('moment')
let Horseman = require('node-horseman')
let settings = require('../../travel-settings')

const parseCountry = async (countryArray) => {
	let cities = []
	//console.log("Parsing Countries")

	try {
		for (let country of countryArray) {
			country.cities = await getCities(country.search)
			console.log(`Country: ${country.name}`)

			for(let city of country.cities) {
				city.flights = await getFlights(city.search)
				console.log(city.name)
				console.log(city.flights)
			}
		}
		// countryArray[2].cities = await getCities(countryArray[2].search)


		return countryArray
	} catch (e) {
		console.log(e)
	}
}

/**
 * getCities Takes a country search url and parses the first row of cities
 * @param url - A Momondo-constructed search url
 * @returns {Promise.<void>}
 */
export async function getCities(url) {
	let horseman = new Horseman({timeout: 30000})
	let result
	console.log("Getting cities for country.")
	return horseman
	// .on("consoleMessage", function (msg) {
	// 	console.log(msg);
	// })
		.open(url)
		//.log("Opened for Cities in Country")
		.status()
		.waitForSelector('div.ng-scope > div > div.flexiblesearch-option-content > label:nth-child(2) > div > span')
		.click('div.ng-scope > div > div.flexiblesearch-option-content > label:nth-child(2) > div > span')
		.log("Sorting by most popular")
		.waitForSelector('div.flexiblesearch-main.ng-scope > div:nth-child(2) > div > div.ng-scope > div:nth-child(1) > span:nth-child(1) > div > div > a > span.flexiblesearch-result-button.ng-scope')
		.screenshot("Cities.png")
		.evaluate(function () {
			let cities = []
			console.log("In city page.")

			$('div.flexiblesearch-main.ng-scope > div:nth-child(2) > div > div:nth-child(2)').find(' > div:nth-child(1)').children()
				.each(function () {
					var name = $(this).find('div > div.container > a > span.city.ng-binding').text()
					var searchHref = $(this).find('div > div.container > a').attr('href')
					//console.log(name)
					var city = {
						name: name,
						search: 'http://www.momondo.com' + searchHref
					}
					cities.push(city)
				})
			//TODO Add support for parsing a second row of cities.

			return cities
		})
		.then(function (results) {
			return result = results
		})
		.close()
}

/**
 * getFlights function returns a "flight" object that consists of {best: {price: , duration}, cheapest: {price: , duration}}
 * @param url - momondo constructed url that directs to the flight page in the search results.
 * @returns {Promise.<void>}
 */
export async function getFlights(url) {
	let horseman = new Horseman({timeout: 60000})
	let result
	//console.log("Parsing in flights.")
	return horseman
	// .on("consoleMessage", function (msg) {
	// 	console.log(msg);
	// })
		.open(url)
		.log("Getting flights for City")
		.status()
		.waitForSelector('div#searchProgressText')
		.wait(settings.searchTime)
		// .evaluate(function(){
		// 	return document.getElementById('searchProgressText').innerText
		// })
		// .then(function(result) {
		// 	console.log(result)
		//
		// 	if(result !== "Search complete"){
		// 		this.wait(5000)
		// 	}
		// })   //Good waitFor method
		// .waitFor(function(){
		// 	return document.getElementById('searchProgressText').innerText === "Search complete"
		// }, true)
		.screenshot("Flights.png")
		.evaluate(function () {

				console.log("In flight page.")
				let cheapInner = document.getElementById('flight-tickets-sortbar-cheapest').querySelector('.inner')
				let cPrice = cheapInner.querySelector('span.price').querySelector('span.value').innerText
				let cDur = cheapInner.querySelector('span.info').innerText
				let bestInner = document.getElementById('flight-tickets-sortbar-bestdeal').querySelector('.inner')
				let bPrice = bestInner.querySelector('span.price').querySelector('span.value').innerText
				let bDur = bestInner.querySelector('span.info').innerText
				//console.log(nodeList)

				return {
					cheapest: {
						price: parseInt(cPrice) || -1,
						duration: cDur || "Unavailable"
					},
					best: {
						price: parseInt(bPrice) || -1,
						duration: bDur || "Unavailable"
					}
				}
			}
		)
		.then(function (results) {
			return result = results
		})
		.catch(function (err) {
			console.log(err)
		})
		.close()
}