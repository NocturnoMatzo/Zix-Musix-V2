const client = require("../index");
const {
   Guilds
} = require('../handler/dbObjects')
const distube = require('../Client/Distube')
const {
   Permissions
} = require('discord.js')

client.on('modalSubmit', async (modal) => {
   if (modal.customId === 'musicid') {
      let choice = await modal.getTextInputValue('mid')
      const affectedRows = await Guilds.update({
         musicId: choice.toString()
      }, {
         where: {
            guildId: modal.guildId
         }
      });
      let guildProfile = await Guilds.findOne({
         where: {
            guildId: modal.guildId
         }
      })
      modal.reply({
         content: 'Le salon musical est maintenant' + ` <#${guildProfile.musicId}>`,
         ephemeral: true
      })
   }
   if (modal.customId === 'commandid') {
      let choice = await modal.getTextInputValue('cid')
      const affectedRows = await Guilds.update({
         commandId: choice.toString()
      }, {
         where: {
            guildId: modal.guildId
         }
      });
      let guildProfile = await Guilds.findOne({
         where: {
            guildId: modal.guildId
         }
      })
      modal.reply({
         content: 'Le salon des commandes est maintenant' + ` <#${guildProfile.commandId}>`,
         ephemeral: true
      })
   }
});