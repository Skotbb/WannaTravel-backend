import mongoose from 'mongoose'
import findOrCreate from 'mongoose-findorcreate'
import { databaseName } from '../travel-settings'

// mongoose.connect(`mongodb://localhost/${databaseName}`)

let Schema = mongoose.Schema;

/**
 * Schema for Cities
 */
const citySchema = new Schema({
	name: {type: String, index: true, unique: true},
	flights: Array,
	countryId: Schema.Types.ObjectId,
	searchUrl: String,
});
citySchema.plugin(findOrCreate)


let City = mongoose.model('Cities', citySchema);
export { City }