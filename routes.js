const authRoutes = require('./components/auth/auth.routes')
const userRoutes = require('./components/users/users.routes')
const uploadRoutes = require('./routes/upload');

const versionOne = (routeName) => `/api/v1/${routeName}`

module.exports = (app) => {
	app.use(versionOne('auth'), authRoutes)
	app.use(versionOne('users'), userRoutes)
	app.use(versionOne('upload'), uploadRoutes); // здесь загрузка
}
