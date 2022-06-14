const client = require("../index");
const distube = require('../Client/Distube')
const {
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton,
  } = require("discord.js");
  const paginationEmbed = require("discordjs-button-pagination");

  /**
   * @param {CommandInteraction} interaction
   */
client.on("interactionCreate", async (interaction) => {
   const {
      options,
      member,
      guild,
      channel,
  } = interaction
   
   if(!interaction.isButton()) return

   if(interaction.customId === 'close') {
            interaction.message.delete()
   }

});
