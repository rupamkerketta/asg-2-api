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
	yearWiseValues: [
		{
			year: {
				type: Number,
				required: true
			},
			categories: [
				{
					value: { type: Number, required: true },
					category: { type: Number, required: true }
				}
			]
		}
	],
	categories: [
		{
			categoryId: { type: Number, required: true },
			category: { type: String, required: true },
			categoryTags: [{ type: String, required: true }]
		}
	]
})

const Country = mongoose.model('Country', countrySchema)
module.exports = Country
