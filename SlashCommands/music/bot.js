const {
    Client,
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton,

} = require("discord.js");
const discord = require('discord.js')
const distube = require('../../Client/Distube');
const voice = require('@discordjs/voice')
const pack = require('../../package.json')

module.exports = {
    name: "bot",
    description: "Inetraction pouvant me controler",
    type: 'CHAT_INPUT',
    deletemessage: true,
    options: [{
            name: 'join',
            description: 'Rejoindre un salon vocal',
            type: "SUB_COMMAND",
            options: [{
                    name: 'salon',
                    description: 'sélectionne le salon vocal que je doit rejoindre',
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_VOICE', 'GUILD_STAGE_VOICE'],
                    required: true,
                },

            ]
        },
        {
            name: 'leave',
            description: 'Quitter un salon vocal',
            type: 'SUB_COMMAND',
        },
        {
            name: 'info',
            description: 'information sur l\'application',
            type: 'SUB_COMMAND',
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
        try {
            let channelid = await options.getChannel('salon')
            if (options.getSubcommand() === 'join') {
                distube.voices.join(channelid)
                let jembed = new MessageEmbed().setColor('PURPLE').setDescription(`J'ai rejoint le salon ${channelid} !`)
                await interaction.reply({
                    embeds: [jembed]
                })

            } else if (options.getSubcommand() === 'leave') {

                if (!distube.voices.has(guild.id)) return interaction.reply({
                    content: 'Je ne suis dans aucun salons !',
                    ephemeral: true
                })
                let fembed = new MessageEmbed().setColor('PURPLE').setDescription(`J'ai quitté le salon <#${interaction.guild.me.voice.channelId}> !`)
                await interaction.reply({
                    embeds: [fembed]
                })
                distube.voices.leave(guild.id)

            } else if (options.getSubcommand() === 'info') {
                let bots = client.users.cache.filter((u) => u.bot === true).size
                let users = client.users.cache.size
                let value = users - bots
                let info = new MessageEmbed()
                    .setColor('PURPLE')
                    .setThumbnail(interaction.guild.me.displayAvatarURL())
                    .setTitle('Informations')
                    .setDescription(`Informations pratiques de l'application **ZIX MUSIC** développée à partir de l'API de discord.\n\n`)
                    .addField('Versions :', pack.version, true)
                    .addField('Développeur :', 'NocturnoMatzo#9713', true)
                    .addField('Serveurs :', client.guilds.cache.size.toString(), true)
                    .addField('Utilisateurs :', value.toString(), true)
                    .addField('Latence :', `\`\`${client.ws.ping} ms\`\``, true)
                    .addField('Librairies :', `**distube.js** : \`\`${pack.dependencies['distube']}\`\`\n**discord.js** : \`\`${pack.dependencies["discord.js"]}\`\``)

                interaction.reply({
                    embeds: [info]
                })

            }



        } catch (error) {
            console.log(error)
            if (interaction.deferred) {
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