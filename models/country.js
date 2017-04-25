import mongoose from 'mongoose'
import findOrCreate from 'mongoose-findorcreate'
import { databaseName } from '../travel-settings'

// mongoose.connect(`mongodb://localhost/${databaseName}`)

let Schema = mongoose.Schema;

const countrySchema = new Schema({
	name: {type: String, index: true, unique: true},
	cities: [{type: Schema.Types.ObjectId, ref: 'City'}],
	searchUrl: String,
});
countrySchema.plugin(findOrCreate)


countrySchema.statics.addCountry = async (country) => {
	Country.findOne({name: country.name}, (err, result) => {
		console.log("Finding.")
		// If no error
		if (!err) {
			// If no result
			if (!result) {
				// Create the country!
				console.log("Create new country.")
				Country.create({
					name: country.name,
					searchUrl: country.search,
				}, function(err, country) {
					if(err) {
						console.log(err)
					} else {
						console.log(`${country.name} created.`)
					}
				})
			}
			console.log("country in db.")
			return
		} else {
			console.log(err)
		}
	})
}

let Country = mongoose.model('Countries', countrySchema);

export { Country }