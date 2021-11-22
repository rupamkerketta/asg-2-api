const countryModel = require('../models/country.model')

const getStartYearCategories = (country) => {
	return country.yearWiseValues[0].categories.map((c) => {
		return {
			value: c.value,
			category: country.categories.find((cc) => cc.categoryId === c.category)
				.category
		}
	})
}

const getEndYearCategories = (country) => {
	return country.yearWiseValues[
		country.yearWiseValues.length - 1
	].categories.map((c) => {
		return {
			value: c.value,
			category: country.categories.find((cc) => cc.categoryId === c.category)
				.category
		}
	})
}

const getAllYearsProcessed = (country) => {
	return country.yearWiseValues.map((yearInfo) => {
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
}

module.exports = {
	getCountryInfo: async (req, res) => {
		try {
			const countryId = req.params.id
			const country = await countryModel.findById(countryId)

			if (!country) {
				res.status(404).send({ message: 'Country not found!!' })
				return
			}

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

			let startYearCategories = getStartYearCategories(country)
			let endYearCategories = getEndYearCategories(country)

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
	getSEYearInfoFiltered: async (req, res) => {
		let keywords = []
		if (typeof req.query.key === 'object') {
			console.log('[key (array)]')
			keywords.push(...req.query.key)
		}

		if (typeof req.query.key === 'string') {
			keywords.push(req.query.key)
		}
		const operationType = req.query.operationType

		// Country Id
		const countryId = req.params.id
		const country = await countryModel.findById(countryId)

		// Get all the available keys for the country
		const availableKeys = () => {
			const arrTemp = []
			country.categories.forEach((category) => {
				arrTemp.push(...category.category.split('_'))
			})
			return [...new Set(arrTemp)]
		}

		const getKeyList = (keywordArr) => {
			const allKeys = availableKeys()
			return keywordArr.map((key) => {
				return {
					key,
					valid: allKeys.includes(key)
				}
			})
		}

		const keyList = getKeyList(keywords)

		// OR operation
		const orKeySearch = (keyList) => {
			let orKeyIds = []
			keyList.forEach((keyInstance) => {
				if (keyInstance.valid) {
					country.categories.forEach((categoryInstance) => {
						if (categoryInstance.category.includes(keyInstance.key)) {
							orKeyIds.push(categoryInstance.categoryId)
						}
					})
				}
			})
			return [...new Set(orKeyIds)]
		}

		const orSearchResult = orKeySearch(keyList)

		// AND OPERATION
		const andKeySearch = (keyList) => {
			let andKeyIds = []
			country.categories.forEach((categoryInstance) => {
				if (
					keyList.every((keyInstance) =>
						categoryInstance.category.includes(keyInstance.key)
					)
				) {
					andKeyIds.push(categoryInstance.categoryId)
				}
			})
			return andKeyIds
		}
		const andSearchResult = andKeySearch(keyList)

		let filteredRecords
		const yearWiseLength = country.yearWiseValues.length

		switch (req.SE) {
			case 'start-year':
				filteredRecords = getFilteredInfo({
					yearIndex: 0,
					country,
					operationType,
					andSearchResult,
					orSearchResult,
					SE: req.SE
				})

				res.send({
					...filteredRecords
				})
				return
			case 'end-year':
				filteredRecords = getFilteredInfo({
					yearIndex: yearWiseLength - 1,
					country,
					operationType,
					andSearchResult,
					orSearchResult,
					SE: req.SE
				})

				res.send({
					...filteredRecords
				})
				return
			case 'start-and-end-year':
				const startYearInfoFiltered = getFilteredInfo({
					yearIndex: 0,
					country,
					operationType,
					andSearchResult,
					orSearchResult,
					SE: 'start-year'
				}).startYearInfoFiltered

				const endYearInfoFiltered = getFilteredInfo({
					yearIndex: yearWiseLength - 1,
					country,
					operationType,
					andSearchResult,
					orSearchResult,
					SE: 'end-year'
				}).endYearInfoFiltered

				res.send({
					_id: country._id,
					countryName: country.countryName,
					startYearInfoFiltered,
					endYearInfoFiltered
				})
				return
			case 'all-years':
				const allYearFilteredRecords = country.yearWiseValues.map(
					(yearInfo, index) => {
						return getFilteredInfo({
							yearIndex: index,
							country,
							operationType,
							andSearchResult,
							orSearchResult,
							SE: 'all-years'
						})
					}
				)
				res.send({
					_id: country._id,
					countryName: country.countryName,
					allYearFilteredRecords
				})
		}
	},
	getAllYearsInfo: async (req, res) => {
		try {
			const countryId = req.params.id
			const country = await countryModel.findById(countryId)

			let allYearsInfo = getAllYearsProcessed(country)

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

const getFilteredInfo = ({
	yearIndex,
	country,
	operationType,
	andSearchResult,
	orSearchResult,
	SE
}) => {
	let filteredRecords
	switch (operationType) {
		case 'OR':
			filteredRecords = country.yearWiseValues[yearIndex].categories
				.map((categoryInfo) => {
					if (orSearchResult.includes(categoryInfo.category)) {
						return {
							value: categoryInfo.value,
							category: country.categories.find(
								(c) => c.categoryId === categoryInfo.category
							).category
						}
					}
				})
				.filter((record) => typeof record !== 'undefined')
			break
		case 'AND':
			filteredRecords = country.yearWiseValues[yearIndex].categories
				.map((categoryInfo) => {
					if (andSearchResult.includes(categoryInfo.category)) {
						return {
							value: categoryInfo.value,
							category: country.categories.find(
								(c) => c.categoryId === categoryInfo.category
							).category
						}
					}
				})
				.filter((record) => typeof record !== 'undefined')
			break
		default:
			filteredRecords = country.yearWiseValues[yearIndex].categories
				.map((categoryInfo) => {
					if (orSearchResult.includes(categoryInfo.category)) {
						console.log(categoryInfo)
						return {
							value: categoryInfo.value,
							category: country.categories.find(
								(c) => c.categoryId === categoryInfo.category
							).category
						}
					}
				})
				.filter((record) => typeof record !== 'undefined')
	}

	let noRecordsMsg = ''
	if (yearIndex === 0) {
		noRecordsMsg =
			'No records found for the starting year for the given parameters'
	} else if (yearIndex === country.yearWiseValues.length - 1) {
		noRecordsMsg =
			'No records found for the ending year for the given parameters'
	} else {
		noRecordsMsg = 'No records found for the given parameters'
	}

	if (filteredRecords.length === 0) {
		filteredRecords = {
			message: noRecordsMsg
		}
	}

	switch (SE) {
		case 'start-year':
			return {
				_id: country._id,
				countryName: country.countryName,
				startYearInfoFiltered: {
					year: country.startYear,
					filteredRecords
				}
			}
		case 'end-year':
			return {
				_id: country._id,
				countryName: country.countryName,
				endYearInfoFiltered: {
					year: country.endYear,
					filteredRecords
				}
			}
		case 'all-years':
			return {
				year: country.yearWiseValues[yearIndex].year,
				filteredRecords
			}
		default:
			return {
				errMessage: 'Default case!!'
			}
	}
}
