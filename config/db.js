const mongoose = require('mongoose')
console.log('MONGO_URI:', process.env.MONGO_URI);
const DBconnection = async () => {
	const conn = await mongoose
		.connect ("mongodb+srv://nadoby:5RpkigUspUKMc5T@cluster0.pgxwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",

		// (process.env.MONGO_URI, 
			{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.catch((err) => {
			console.log(`For some reasons we couldn't connect to the DB`.red, err)
		})

	console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = DBconnection
