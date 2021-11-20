const countryModel = require('../models/country.model')

module.exports = {
	countries: async (req, res) => {
		try {
			const countriesData = await countryModel.find({})
			const filteredData = countriesData.map((country) => {
				return {
					_id: country._id,
					countryName: country.countryName,
					startYear: country.startYear,
					endYear: country.endYear
				}
			})
			res.send(filteredData)
		} catch (err) {
			console.log(err)
			res.status(500).send({ errMessage: 'Internal Server Error!!' })
		}
	}
}
