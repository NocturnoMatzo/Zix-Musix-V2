const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'https://github.com/NocturnoMatzo/database/blob/51a0da7489be3999f7fd2a6bab09a1767a760b17/database.sqlite',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const guildsModels = require('../models/guildShema')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);