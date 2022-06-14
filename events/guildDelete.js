const client = require('../index')
const { Guilds } = require("../handler/dbObjects");

client.on('guildDelete', async (guild) => {
     try {
        const guilddelete = await Guilds.destroy({where : {guildId: guild.id}})
      }
      catch (error) {
          return console.log('Pas de donnée(s)')
    }

})