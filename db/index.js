const mongoose = require('mongoose')

const connect = async ({ connectionURL }, callback) => {
	// When connected successfully
	mongoose.connection.on('connected', function () {
		console.log(`[mongoose] Connected to the Database '${this.name}'...`)
		callback()
	})

	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {
		console.log('[mongoose] Connection closed!!')
	})

	try {
		await mongoose.connect(connectionURL, {
			useUnifiedTopology: true
		})
	} catch (err) {
		// If the connection throws an error
		console.log(`[mongoose] ${err}`)
	}
}

module.exports = {
	connect
}
