'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getTravelDates = getTravelDates;
exports.getDate = getDate;
exports.getUrl = getUrl;
exports.updateFlightUrl = updateFlightUrl;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moment = require('moment');


//Utility Globals
var formatString = "DD-MM-YYYY";

/**
 *
 * @param dayOfWeek The numerical day of the week, with 0 as Sunday.
 * @param duration The length of the trip, in days.
 * @returns {{dep: string, ret: string}}
 */
function getTravelDates(dayOfWeek, duration) {
	var now = moment();
	var dateOfDay = void 0;
	var dur = void 0;
	if (dayOfWeek && duration) {
		dateOfDay = moment().day(dayOfWeek);
		// console.log(dateOfDay.day() +" / "+ now.day())
		// console.log(dateOfDay.format(formatString))
		try {
			dur = parseInt(duration);
		} catch (e) {
			console.error(e);
		}
	} else {
		dateOfDay = moment();
		dur = 5;
	}

	dateOfDay.add(1, "months");
	// console.log(now.format(formatString))
	return { dep: dateOfDay.format(formatString), ret: dateOfDay.add(dur, 'days').format(formatString) };
}

function getDate(dateString) {
	if (dateString) {
		// console.log(dateString)
		try {
			var date = moment(dateString, formatString);

			return date.toDate();
		} catch (e) {
			throw e;
		}
	} else {
		return moment().toDate();
	}
}

function getUrl(dep, ret) {
	return "http://www.momondo.com/flights/mco-1/any-6/flights-from-orlando-intl-to-take-me-anywhere.html?TripType=2&SegNo=2&SDP0=" + dep + "&SDP1=" + ret + "&AD=1&TK=ECO&DO=false&NA=false";
}
function updateFlightUrl(url, dep, ret) {
	if (url.includes('SDP0=') && url.includes('SDP1=')) {
		var split1 = url.substring(0, url.indexOf('SDP0=') + 5);
		var split2 = url.substring(url.indexOf('&', url.indexOf('SDP0=')), url.indexOf('SDP1=') + 5);
		var split3 = url.substring(url.indexOf('&', url.indexOf('SDP1=')), url.length);

		var newUrl = split1 + dep + split2 + ret + split3;
		// console.log(newUrl)
		return newUrl;
	}
}
//# sourceMappingURL=utils.js.map