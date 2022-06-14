const client = require('../index')
const {
  Permissions,
  MessageEmbed,
  Guild
} = require('discord.js')
const {
  Guilds
} = require("../handler/dbObjects");

/**
 * @param {Guild} guild
 */
client.on('guildCreate', async (guild) => {

  try {
    const guildcreate = await Guilds.create({
      guildName: guild.name,
      guildId: guild.id,
    });
    client.log.success('Guild added to database !')

  } catch (error) {
    return console.log('Erreur !' + error)
  }

  let channelToSend;

  guild.channels.cache.forEach((channel) => {
    if (channel.type === 'GUILD_TEXT' &&
      !channelToSend &&
      channel.permissionsFor(guild.me).has(Permissions.FLAGS.SEND_MESSAGES)
    ) channelToSend = channel;
  });

  if (!channelToSend) return;
  try {
    channelToSend.send({
      embeds: [new MessageEmbed().setDescription('@everyone Merci de m\'avoir invité sur votre serveur ! pour commencer vueillez me configurer : /config')]
    })

  } catch (error) {
    return console.log('Erreur !' + error)
  }

})