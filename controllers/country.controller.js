const countryModel = require('../models/country.model')

// ----------------- Non-Query Utils -------------------

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

// -----------------------------------------------------

// ---------------- Query Utils ------------------------

// Get all the available keys for the country
const availableKeys = (country) => {
	const arrTemp = []
	country.categories.forEach((category) => {
		arrTemp.push(...category.category.split('_'))
	})
	return [...new Set(arrTemp)]
}

const getKeyList = (keywordArr, country) => {
	const allKeys = availableKeys(country)
	return keywordArr.map((key) => {
		return {
			key,
			exists: allKeys.includes(key)
		}
	})
}

// OR operation
const orKeySearch = (keyList, country) => {
	let orKeyIds = []

	// Only add the keys which exist in the country category list.
	keyList.forEach((keyInstance) => {
		if (keyInstance.exists) {
			country.categories.forEach((categoryInstance) => {
				if (categoryInstance.category.includes(keyInstance.key)) {
					orKeyIds.push(categoryInstance.categoryId)
				}
			})
		}
	})
	return [...new Set(orKeyIds)]
}

// AND OPERATION
const andKeySearch = (keyList, country) => {
	let andKeyIds = []

	// Check if every key provided exists or not.
	// Only then proceed with the next step.
	if (keyList.every((keyInstance) => keyInstance.exists)) {
		country.categories.forEach((categoryInstance) => {
			if (
				keyList.every((keyInstance) =>
					categoryInstance.category.includes(keyInstance.key)
				)
			) {
				andKeyIds.push(categoryInstance.categoryId)
			}
		})
	}
	return andKeyIds
}

// -----------------------------------------------------

module.exports = {
	getCountryInfo: async (req, res) => {
		try {
			const countryId = req.params.id
			const country = await countryModel.findById(countryId)

			// Check 404
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

			// Check 404
			if (!country) {
				res.status(404).send({ message: 'Country not found!!' })
				return
			}

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
		// Array for storing all the keywords with their metadata
		let keywords = []

		// If multiple keywords are provided
		if (typeof req.query.key === 'object') {
			keywords.push(...req.query.key)
		}

		// If only a single keyword is provided
		if (typeof req.query.key === 'string') {
			keywords.push(req.query.key)
		}
		const operationType = req.query.operationType

		// Country Id
		const countryId = req.params.id
		const country = await countryModel.findById(countryId)

		// Check 404
		if (!country) {
			res.status(404).send({ message: 'Country not found!!' })
			return
		}
		const keyList = getKeyList(keywords, country)

		// 'OR' & 'AND' search results for the keywords provided
		const orSearchResult = orKeySearch(keyList, country)
		const andSearchResult = andKeySearch(keyList, country)

		// If both the lists are empty
		if (orSearchResult.length === 0 && andSearchResult.length === 0) {
			res.send({
				_id: country._id,
				countryName: country.countryName,
				filteredRecords: {
					message: 'No records found for the given parameters',
					operationType,
					keys: keyList
				}
			})
			return
		}

		let filteredRecords
		const yearWiseLength = country.yearWiseValues.length

		switch (req.SE) {
			case 'start-year':
				filteredRecords = getFilteredInfo({
					yearIndex: 0,
					country,
					operationType,
					keyList,
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
					keyList,
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
					keyList,
					andSearchResult,
					orSearchResult,
					SE: 'start-year'
				}).startYearInfoFiltered

				const endYearInfoFiltered = getFilteredInfo({
					yearIndex: yearWiseLength - 1,
					country,
					operationType,
					keyList,
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
				return
		}
	},
	getAllYearsInfo: async (req, res) => {
		try {
			const countryId = req.params.id
			const country = await countryModel.findById(countryId)

			// Check 404
			if (!country) {
				res.status(404).send({ message: 'Country not found!!' })
				return
			}

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
	keyList,
	andSearchResult,
	orSearchResult,
	SE
}) => {
	let filteredRecords
	switch (operationType) {
		case 'OR':
			if (orSearchResult.length === 0) {
				filteredRecords = []
			} else {
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
			}
			break
		case 'AND':
			if (andSearchResult.length === 0) {
				filteredRecords = []
			} else {
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
			}
			break
		default:
			if (orSearchResult.length === 0) {
				filteredRecords = []
			} else {
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
			}
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
			message: noRecordsMsg,
			operationType
		}
	}

	switch (SE) {
		case 'start-year':
			return {
				_id: country._id,
				countryName: country.countryName,
				startYearInfoFiltered: {
					year: country.startYear,
					keyList,
					filteredRecords
				}
			}
		case 'end-year':
			return {
				_id: country._id,
				countryName: country.countryName,
				endYearInfoFiltered: {
					year: country.endYear,
					keyList,
					filteredRecords
				}
			}
		case 'all-years':
			return {
				year: country.yearWiseValues[yearIndex].year,
				keyList,
				filteredRecords
			}
		default:
			return {
				errMessage: 'Default case!!'
			}
	}
}
