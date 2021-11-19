const mongoose = require('mongoose')

const countrySchema = mongoose.Schema({
	countryName: {
		type: String,
		required: true
	},
	startYear: {
		type: Number,
		required: true
	},
	endYear: {
		type: Number,
		required: true
	},
	yearWiseValue: [
		{
			year: {
				type: Number,
				required: true
			},
			categories: [
				{
					value: { type: Number, required: true },
					category: { type: String, required: true }
				}
			]
		}
	],
	categories: [{ type: String }]
})

const Country = mongoose.model('Country', countrySchema)
module.exports = Country
