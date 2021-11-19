const mongoose = require('mongoose')
// const connectionURL = `mongodb://${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connect = async (
	{ connectionURL, mongoUsername, mongoPassword },
	callback
) => {
	// When successfully connected
	mongoose.connection.on('connected', function () {
		console.log(`[mongoose] Connected to the Database '${this.name}'...`)
		callback()
	})

	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {
		console.log('[mongoose] Connection closed!!')
	})

	try {
		await mongoose.connect(
			connectionURL,
			{ user: mongoUsername, pass: mongoPassword },
			{
				useUnifiedTopology: true,
				useFindAndModify: false
			}
		)
	} catch (err) {
		// If the connection throws an error
		console.log(`[mongoose] ${err}`)
	}
}

module.exports = {
	connect
}
