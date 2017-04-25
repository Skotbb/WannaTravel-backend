import mongoose from 'mongoose'
import findOrCreate from 'mongoose-findorcreate'
import { databaseName } from '../travel-settings'

// mongoose.connect(`mongodb://localhost/${databaseName}`)

let Schema = mongoose.Schema;

const citySchema = new Schema({
	name: {type: String, index: true, unique: true},
	flights: Array,
	countryId: Schema.Types.ObjectId,
	searchUrl: String,
});
citySchema.plugin(findOrCreate)



citySchema.statics.addCity = (city, country) => {
	return City.findOne({name: city.name}, (err, result) => {
		console.log("Finding.")
		// If no error
		if (!err) {
			// If no result
			if (!result) {
				// Create the city!
				console.log("Create new city.")
				return City.create({
					name: city.name,
					searchUrl: city.search,
					countryId: country._id || null
				}, function(err, city) {
					if(err) {
						console.log(err)
					} else {
						console.log(`${city.name} created.`)
						return city
					}
				})
			} else {
				console.log("City in db.")
				return result
			}
		} else {
			console.log(err)
		}
	})
}

let City = mongoose.model('Cities', citySchema);
export { City }