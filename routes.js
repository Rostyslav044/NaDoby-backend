const authRoutes = require('./components/auth/auth.routes')
const userRoutes = require('./components/users/users.routes')
const uploadRoutes = require('./routes/upload');
const apartmentRoutes = require('./components/apartments/apartments.routes');
const versionOne = (routeName) => `/api/v1/${routeName}`

module.exports = (app) => {
	app.use(versionOne('auth'), authRoutes)
	app.use(versionOne('users'), userRoutes)
	app.use(versionOne('upload'), uploadRoutes); // здесь загрузка
	app.use(versionOne('apartments'), apartmentRoutes); 
}
