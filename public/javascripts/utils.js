const moment = require('moment')
import _ from 'lodash'


	//Utility Globals
let formatString = "DD-MM-YYYY"

/**
 *
 * @param dayOfWeek The numerical day of the week, with 0 as Sunday.
 * @param duration The length of the trip, in days.
 * @returns {{dep: string, ret: string}}
 */
export function getTravelDates(dayOfWeek, duration) {
	let now = moment();
	let dateOfDay
	let dur
	if (dayOfWeek && duration) {
		dateOfDay = moment().day(dayOfWeek)
		// console.log(dateOfDay.day() +" / "+ now.day())
		// console.log(dateOfDay.format(formatString))
		try {
			dur = parseInt(duration)
		} catch (e) {
			console.error(e)
		}
	} else {
		dateOfDay = moment()
		dur = 5
	}

	dateOfDay.add(1, "months")
	// console.log(now.format(formatString))
	return {dep: dateOfDay.format(formatString), ret:dateOfDay.add(dur, 'days').format(formatString)}
}

export function getDate(dateString) {
	if(dateString) {
		// console.log(dateString)
		try {
			let date = moment(dateString, formatString)

			return date.toDate()
		} catch (e) {
			throw e
		}
	} else {
		return moment().toDate()
	}
}

export function getUrl(dep, ret) {
	return "http://www.momondo.com/flights/mco-1/any-6/flights-from-orlando-intl-to-take-me-anywhere.html?TripType=2&SegNo=2&SDP0=" +dep+ "&SDP1=" +ret+ "&AD=1&TK=ECO&DO=false&NA=false"
}
export function updateFlightUrl(url, dep, ret) {
	if(url.includes('SDP0=') && url.includes('SDP1=')) {
		let split1 = url.substring(0, url.indexOf('SDP0=')+5)
		let split2 = url.substring(url.indexOf('&', url.indexOf('SDP0=')), url.indexOf('SDP1=')+5)
		let split3 = url.substring(url.indexOf('&', url.indexOf('SDP1=')), url.length)

		let newUrl = split1 + dep + split2 + ret + split3
		// console.log(newUrl)
		return newUrl
	}
}