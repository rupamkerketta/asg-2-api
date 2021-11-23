const countryModel = require('../models/country.model')

module.exports = {
	countries: async (req, res) => {
		try {
			// Get only selected fields from the database
			const countriesData = await countryModel.find(
				{},
				'-yearWiseValues -categories'
			)
			res.send(countriesData)
		} catch (err) {
			console.log(err)
			res.status(500).send({ errMessage: 'Internal Server Error!!' })
		}
	}
}
