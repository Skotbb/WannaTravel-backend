import mongoose from 'mongoose'
import findOrCreate from 'mongoose-findorcreate'
import { databaseName } from '../travel-settings'

// mongoose.connect(`mongodb://localhost/${databaseName}`)

let Schema = mongoose.Schema;

/**
 * Schema for countries
 */
const countrySchema = new Schema({
	name: {type: String, index: true, unique: true},
	cities: [{type: Schema.Types.ObjectId, ref: 'City'}],
	searchUrl: String,
});
countrySchema.plugin(findOrCreate)



let Country = mongoose.model('Countries', countrySchema);

export { Country }