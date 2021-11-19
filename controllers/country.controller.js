const countryModel = require('../models/country.model')

module.exports = {
	countries: async (req, res) => {
		try {
			const countriesData = await countryModel.find({})
			res.send(countriesData)
		} catch (err) {
			console.log(error)
			res.status(500).send({ errMessage: 'Internal Server Error!!' })
		}
	}
}
