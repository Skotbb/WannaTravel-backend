import mongoose from 'mongoose'
import findOrCreate from 'mongoose-findorcreate'

let Schema = mongoose.Schema;

/**
 * Schema for flights
 */
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

let Flight = mongoose.model('Flights', flightSchema);
export {Flight}