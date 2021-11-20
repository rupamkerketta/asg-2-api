const countryModel = require('../models/country.model')

module.exports = {
	getCountryInfo: async (req, res) => {
		try {
			const countryId = req.params.id
			const country = await countryModel.findById(countryId)

			res.send({
				_id: country._id,
				countryName: country.countryName,
				startYear: country.startYear,
				endYear: country.endYear,
				categories: country.categories.map((category) => category.category)
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({ errMessage: 'Internal Server Error!!' })
		}
	},
	getSEYearInfo: async (req, res) => {
		try {
			const SE = req.SE
			const countryId = req.params.id
			const country = await countryModel.findById(countryId)

			let startYearCategories = country.yearWiseValues[0].categories.map(
				(c) => {
					return {
						value: c.value,
						category: country.categories.find(
							(cc) => cc.categoryId === c.category
						).category
					}
				}
			)

			let endYearCategories = country.yearWiseValues[
				country.yearWiseValues.length - 1
			].categories.map((c) => {
				return {
					value: c.value,
					category: country.categories.find(
						(cc) => cc.categoryId === c.category
					).category
				}
			})

			switch (SE) {
				case 'start-year':
					res.send({
						_id: country.id,
						countryName: country.countryName,
						startYearInfo: {
							year: country.startYear,
							categories: startYearCategories
						}
					})
					break
				case 'end-year':
					res.send({
						_id: country.id,
						countryName: country.countryName,
						endYearInfo: {
							year: country.endYear,
							categories: endYearCategories
						}
					})
					break
				case 'start-and-end-year':
					res.send({
						_id: country.id,
						countryName: country.countryName,
						startYearInfo: {
							year: country.startYear,
							categories: startYearCategories
						},
						endYearInfo: {
							year: country.endYear,
							categories: endYearCategories
						}
					})
					break
				default:
					res.send({ errMessage: 'Something smells fishy!!' })
			}
		} catch (err) {
			console.log(err)
			res.status(500).send({ errMessage: 'Internal Server Error!!' })
		}
	},
	getAllYearsInfo: async (req, res) => {
		try {
			const countryId = req.params.id
			const country = await countryModel.findById(countryId)

			let allYearsInfo = country.yearWiseValues.map((yearInfo) => {
				return {
					year: yearInfo.year,
					categories: yearInfo.categories.map((c) => {
						return {
							value: c.value,
							category: country.categories.find(
								(cc) => cc.categoryId === c.category
							).category
						}
					})
				}
			})

			res.send({
				_id: country.id,
				countryName: country.countryName,
				allYearsInfo
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({ errMessage: 'Internal Server Error!!' })
		}
	}
}
