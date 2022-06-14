const {
    Client,
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton,
  } = require("discord.js");
  const paginationEmbed = require("discordjs-button-pagination");
  const {Guilds} = require('../../handler/dbObjects')
  const distube = require('../../Client/Distube');
 
  module.exports = {
      name: "info",
      description: "information sur la file ou la musique en cours",
      type: 'CHAT_INPUT',
      voice_only : true,
      options: [
          {
              name: 'queue',
              description: 'liste des musiques dans la file d\'attente',
              type: "SUB_COMMAND",
          },
          {
              name: 'now-playing',
              description: 'Informations sur la musique en cours de lecture',
              type: "SUB_COMMAND",
          },
         
      ],
      /**
       *
       * @param {Client} client
       * @param {CommandInteraction} interaction
       * @param {String[]} args
       */
      run: async (client, interaction, args) => {
          const {
              options,
              member,
              guild,
              channel,
          } = interaction

          const queue = await distube.getQueue(guild)
          if(!queue) return interaction.reply({ content : '🚨 Il n\'y a pas de musique en cours de lecture !', ephemeral : true})


          try {
             if (options.getSubcommand() === 'now-playing') {
                  let song = queue.songs[0]
                  const uni = `${song.playing ? '⏸️ |' : '🔴 |'}`;
                  let part = ''
                  if(song.isLive) part = 'nothing'
                  else part = Math.floor((queue.currentTime / song.duration) * 30);
                  let message = ''
                  if(song.isLive) message = 'En direct !'
                  else message = `\`\`\`${uni} ${'─'.repeat(part) + '🎶' + '─'.repeat(30 - part)}\`\`\``
                  let np = new MessageEmbed()
                  .setDescription(
                      `[${song.name}](${song.url})`
                    )
                    .setColor("PURPLE")
                    .setTitle(`🎶 - Musique en cours`)
                    .setImage(song.thumbnail)
                    .addField('Publié Par', `[${song.uploader.name}](${song.uploader.url})`, true)
                    .addField('Demandé par', `${song.user}`, true)
                    .addField('Volume', `${queue.volume} %`, true)
                    .addField('Vues', `${song.views} 👀`, true)
                    .addField('Likes', `${song.likes} 👍`, true)
                    .addField('Filtre(s)', `${queue.filters.join(", ") || "Normal"}`, true)
                    .addField(`Durée actuelle: [${queue.formattedCurrentTime}/${song.isLive ? '♾️' : `${song.formattedDuration}`}]`, message)
                  let inter = await interaction.reply({embeds : [np]})
                  setTimeout(function(){
                      interaction.deleteReply(inter)
                  },10000);
              }
              else if (options.getSubcommand() === 'queue') {
                  const config = client.config
                  const embeds = QueueEmbed(queue.songs);
                  const right = interaction.client.emojis.cache.find(
                    (emoji) => emoji.id === config.rightarrow
                  )
                  const left = interaction.client.emojis.cache.find(
                    (emoji) => emoji.id === config.leftarrow
                  )
              
                  const button1 = new MessageButton()
                    .setCustomId("previousbtn")
                    .setEmoji(left)
                    .setStyle("PRIMARY");
              
                  const button2 = new MessageButton()
                    .setCustomId("nextbtn")
                    .setEmoji(right)
                    .setStyle("PRIMARY");
  
                  const close = new MessageButton()
                    .setCustomId("close")
                    .setStyle('DANGER')
                    .setLabel('Fermer')
              
  
                  const pages = embeds;
                  const buttonList = [button1, button2, close];
                  const timeout = 3600000;
                  paginationEmbed(interaction, pages, buttonList, timeout);
              
                  function QueueEmbed(queue) {
                    try {
                      let embeds = [];
                      let k = 10;
                      for (let i = 0; i < queue.length; i += 10) {
                        const current = queue.slice(i, k);
                        let j = i;
                        k += 10;
                        const info = current
                          .map((song) => `**${++j} • [${song.name}](${song.url}) • ${song.user}**`)
                          .join("\n");
                        const embed = new MessageEmbed()
                          .setTitle("File d'attente")
                          .setColor('PURPLE')
                          .setDescription(
                            `**Musique actuelle - [${queue[0].name}](${queue[0].url})**\n\n**Reste de la file :**\n${info}`
                          );
                        embeds.push(embed);
                      }
                      return embeds;
                  }catch (e) {
                          interaction.reply({content : 'une erreur est survenue : ' + e, ephemeral : true})
                      }
                  }
              }
  
  
          } catch (error) {
               console.log(error)
               await interaction.reply({content : 'Erreur ! - ' + error, ephemeral : true})
          }
  
      },
  };