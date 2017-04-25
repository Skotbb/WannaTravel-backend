import mongoose from 'mongoose'
import findOrCreate from 'mongoose-findorcreate'

let Schema = mongoose.Schema;

const flightSchema = new Schema({
	date: Date,
	best: {
		price: Number,
		duration: String
	},
	cheapest: {
		price: Number,
		duration: String
	},
	cityName: String,
	cityId: Schema.Types.ObjectId,
	searchUrl: String,
	dayOfWeek: String,
	tripDuration: Number,
});
flightSchema.plugin(findOrCreate)

flightSchema.statics.addFlight = async (flight, city) => {
	return Flight.findOne({searchUrl: flight.search}, async (err, result) => {
		console.log('Searching db')
		// If no error.
		if (!err) {
			// If no results
			if (!result) {
				// add flight
				await Flight.create({             // Add flight to db and return it
					tripDuration: flight.tripDuration,
					dayOfWeek: flight.dayOfWeek,
					cityName: city.name || null,
					cityId: city._id || null,
					date: flight.date,
					best: flight.best,
					cheapest: flight.cheapest,
					searchUrl: flight.search
				}, function(err, flight){
					if (err) {
						throw err
					} else {
						console.log("Flight added")
						return flight
					}
				})
			} else {
				//Flight is in db
				// Check if the prices are the same
				if (result.best !== flight.best || result.cheapest !== flight.cheapest) {
					console.log(`Best flight was $${result.best.price} and is now $${flight.best.price}`)
					console.log(`Cheapest flight was $${result.cheapest.price} and is now $${flight.cheapest.price}`)
					result.best = flight.best
					result.cheapest = flight.cheapest
					//save
					result.save((err, thing) => {
						if (err) {
							throw err
						}
						console.log(`Flights updated for ${city.name}`)
					})
					return result
				} else {
					console.log("Flight in db.")
					return result
				}
			}
		} else {
			console.log(err)
		}
	})
}

let Flight = mongoose.model('Flights', flightSchema);
export {Flight}