const {
    Client,
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton,
  } = require("discord.js");
  const distube = require('../../Client/Distube');

  module.exports = {
      name: "filters",
      description: "Ajoute ou retire des filtres à ta guise",
      type: 'CHAT_INPUT',
      voice_only : true,
      deletemessage: true,
      options: [
          {
              name: 'manage',
              description: 'Gère les filtres d\'une musique !',
              type: "SUB_COMMAND",
              options: [{
                  name: 'action',
                  description: 'sélectionne l\'action que tu veux faire',
                  type: 'STRING',
                  required: true,
                  choices: [
                      {
                          name : 'Ajouter', value: 'on',
                      },
                      {
                          name : 'Retirer', value: 'off',
                      },
                  ]
              },
              {
                  name: 'filtre',
                  description: 'nom du filtre',
                  type: 'STRING',
                  required: true,
                  autocomplete: true,
              },
          
          ]
          },
          {
              name : 'off',
              description: 'Retire tous les filtres actifs',
              type : 'SUB_COMMAND'
          }
         
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
               if (options.getSubcommand() === 'manage') {
                  let filtername = options.getString('filtre')
                  if(options.getString('action') === 'on') {
                      if(Object.keys(distube.filters).includes(filtername) == false) return interaction.reply({content : `🚨 Le filtre **${filtername}**, n\'existe pas !`, ephemeral : true})
                      if(Object.keys(distube.filters).includes(filtername)) queue.setFilter(filtername)
                      let fembed = new MessageEmbed().setColor('PURPLE').setTitle('Filtre ajoutée !').setDescription(`Le filtre **${filtername}** à été ajoutée`)
                      let inter = await interaction.reply({ embeds : [fembed]})
                  } else if(options.getString('action') === 'off') {
                     if(!distube.filters) return interaction.reply({content : '🚨 Il n\'y a pas de filtre(s) activé(s) !', ephemeral : true})
                     queue.setFilter(filtername, false)
                     let fembed = new MessageEmbed().setColor('PURPLE').setTitle('Filtre retiré !').setDescription(`Le filtre **${filtername}** à été retiré`)
                     let inter = await interaction.reply({ embeds : [fembed]})
                  }
              } else if (options.getSubcommand() === 'off') {
                  if (queue.filters.length === 0) return interaction.reply({content : '🚨 Il n\'y a pas de filtre(s) activé(s) !', ephemeral : true})
                  queue.setFilter(false)
                  let fembed = new MessageEmbed().setColor('PURPLE').setTitle('Filtres retirés !').setDescription(`Tout les filtres ont été retiré`)
                     let inter = await interaction.reply({ embeds : [fembed]})
              } 
  
  
          } catch (error) {
            if (interaction.deferred ) {
                await interaction.followUp({
                content: 'Erreur ! - ' + error,
                ephemeral: true
            })
            } else {
                await interaction.reply({
                    content: 'Erreur ! - ' + error,
                    ephemeral: true
                })
            }
          }
  
      },
  };