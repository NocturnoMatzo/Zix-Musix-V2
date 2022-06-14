module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Guilds', {
        guildName: {
            type: DataTypes.STRING,
        },
        guildId:{ 
            type : DataTypes.STRING,
        },
        musicId:{
            type : DataTypes.STRING,
        },
        commandId:{
            type : DataTypes.STRING,
        },
    });
};