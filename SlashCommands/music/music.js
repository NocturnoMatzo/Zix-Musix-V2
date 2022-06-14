const {
    Client,
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton,
} = require("discord.js");
const paginationEmbed = require("discordjs-button-pagination");
const distube = require('../../Client/Distube');

module.exports = {
    name: "music",
    description: "Commandes musicales",
    type: 'CHAT_INPUT',
    voice_only: true,
    deletemessage: true,
    options: [{
            name: 'play',
            description: 'Joue de la musique',
            type: 1,
            options: [{
                name: 'recherche',
                description: 'nom ou url de la musique',
                type: 'STRING',
                required: true,
            }]
        },
        {
            name: 'stop',
            description: 'Arrête la lecture de la musique',
            type: "SUB_COMMAND",
        },
        {
            name: 'pause',
            description: 'Arrête temporairement la leture de la musique',
            type: "SUB_COMMAND",
        },
        {
            name: 'resume',
            description: 'Reprend la lecture de la musique',
            type: "SUB_COMMAND",
        },
        {
            name: 'skip',
            description: 'Passe à la musique suivante',
            type: "SUB_COMMAND",
        }, {
            name: 'jump',
            description: 'Passe à une certaine musique dans la file d\'attente',
            type: "SUB_COMMAND",
            options: [{
                name: 'position',
                description: 'position dans la file d\'attente (la suivante est 1, 2,... et la précédent est -1, -2,...)',
                required: true,
                type: 'NUMBER'
            }]
        },
        {
            name: 'previous',
            description: 'Revient à la musique précédente',
            type: "SUB_COMMAND",
        },
        {
            name: 'volume',
            description: 'Augmente ou diminue le volume !',
            type: "SUB_COMMAND",
            options: [{
                name: 'niveau',
                description: '10-100%',
                type: 'NUMBER',
                required: true,
            }]
        },
        {
            name: 'autoplay',
            description: 'joue en permanence les musiques recommandées liées a la dernière musique écouté',
            type: "SUB_COMMAND",
        },
        {
            name: 'loop',
            description: 'joue en continue la musique en cours ou toute la file d\'attente',
            type: "SUB_COMMAND",
            options: [{
                name: 'type',
                description: 'file d\'attente ou musique',
                type: 'STRING',
                required: true,
                choices: [{
                        name: 'musique actuelle',
                        value: 'song'
                    },
                    {
                        name: 'file entière',
                        value: 'queue'
                    },
                    {
                        name: 'Désactivé',
                        value: 'off'
                    }
                ],

            }, ]
        },
        {
            name: 'shuffle',
            description: 'Mélange les musiques de la files d\'attentes',
            type: "SUB_COMMAND",
        },
        {
            name: 'seek',
            description: 'Règle le temps de lecture sur une autre position',
            type: "SUB_COMMAND",
            options: [{
                name: 'temps',
                description: 'nombre',
                type: 'NUMBER',
                required: true,
            }]
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
            reply
        } = interaction

        try {
            if (options.getSubcommand() === 'play') {
                let search = new MessageEmbed().setColor('PURPLE').setTitle('🎶 Recherche en cours !').setDescription(`<@${member.id}>, cela ne durera que quelques secondes !`)
                await interaction.reply({
                    embeds: [search],
                    ephemeral: true
                })
                await distube.play(member.voice?.channel, options.getString('recherche'), {
                    textChannel: channel,
                    member: member
                })
            } else if (options.getSubcommand() === 'volume') {
                if (!distube.getQueue(guild)) return interaction.reply({
                    content: '🚨 Il n\'y a pas de musique en cours de lecture !',
                    ephemeral: true
                })
                const p = options.getNumber('niveau')
                if (p < 10 || p > 100 || isNaN(p)) return interaction.reply({
                    content: '🚨 Veuillez indiquer un nombre entre 10 et 100% inclue',
                    ephemeral: true
                })
                distube.setVolume(interaction, p)
                let vembed = new MessageEmbed().setTitle('🔊 Volume mis à jour').setDescription(`le volume de la musique à été mis à jour à ${p}%`).setColor('PURPLE')
                inter = await interaction.reply({
                    embeds: [vembed]
                })

            } else if (options.getSubcommand() === 'stop') {
                if (!distube.getQueue(guild)) return interaction.reply({
                    content: '🚨 Il n\'y a pas de musique en cours de lecture !',
                    ephemeral: true
                })
                distube.stop(guild)
                let stopped = new MessageEmbed().setColor('PURPLE').setTitle('Changement de programme !').setDescription('La musique a été arrêté par ' + `<@${member.id}>`)
                let inter = await interaction.reply({
                    embeds: [stopped]
                })

            } else if (options.getSubcommand() === 'pause') {
                if (!distube.getQueue(guild)) return interaction.reply({
                    content: '🚨 Il n\'y a pas de musique en cours de lecture !',
                    ephemeral: true
                })
                if (distube.getQueue(guild).paused) return interaction.reply({
                    content: '🚨 La musique a déjà été mise en pauses !',
                    ephemeral: true
                })
                distube.pause(guild)
                let paused = new MessageEmbed().setColor('PURPLE').setTitle('Changement de programme !').setDescription('La musique a été mise en pause par ' + `<@${member.id}>`)
                let inter = await interaction.reply({
                    embeds: [paused]
                })

            } else if (options.getSubcommand() === 'resume') {
                if (!distube.getQueue(guild)) return interaction.reply({
                    content: '🚨 Il n\'y a pas de musique en cours de lecture !',
                    ephemeral: true
                })
                if (distube.getQueue(guild).playing) return interaction.reply({
                    content: '🚨 La musique est déjà en cours de lecture !',
                    ephemeral: true
                })
                distube.resume(guild)
                let resumed = new MessageEmbed().setColor('PURPLE').setTitle('De retour sur la piste !').setDescription('La musique à repris grâce à ' + `<@${member.id}>`)
                let inter = await interaction.reply({
                    embeds: [resumed]
                })

            } else if (options.getSubcommand() === 'skip') {
                if (!distube.getQueue(guild)) return interaction.reply({
                    content: '🚨 Il n\'y a pas de musique en cours de lecture !',
                    ephemeral: true
                })
                if (distube.getQueue(guild).songs.length < 2) return interaction.reply({
                    content: '🚨 Il n\'y a plus de musique après celle-ci !',
                    ephemeral: true
                })
                distube.skip(guild)
                let skipped = new MessageEmbed().setColor('PURPLE').setTitle('Changement de programme !').setDescription('La musique à été passé par ' + `<@${member.id}>`)
                let inter = await interaction.reply({
                    embeds: [skipped]
                })

            } else if (options.getSubcommand() === 'jump') {
                if (!distube.getQueue(guild)) return interaction.reply({
                    content: '🚨 Il n\'y a pas de musique en cours de lecture !',
                    ephemeral: true
                })
                if (distube.getQueue(guild).songs.length < 2) return interaction.reply({
                    content: '🚨 Il n\'y a qu\'une seul musique dans la file d\'attente',
                    ephemeral: true
                })
                distube.jump(guild, options.getNumber('position'))
                let skippedto = new MessageEmbed().setColor('PURPLE').setTitle('Changement de programme !').setDescription('La musique à été passé par ' + `<@${member.id}>`)
                let inter = await interaction.reply({
                    embeds: [skippedto]
                })

            } else if (options.getSubcommand() === 'previous') {
                if (!distube.getQueue(guild)) return interaction.reply({
                    content: '🚨 Il n\'y a pas de musique en cours de lecture !',
                    ephemeral: true
                })
                if (distube.getQueue(guild).previousSongs.length == 0) return interaction.reply({
                    content: '🚨 Il n\'y a pas de musique avant celle-ci !',
                    ephemeral: true
                })
                distube.previous(guild)
                let prev = new MessageEmbed().setColor('PURPLE').setTitle('Changement de programme !').setDescription('La musique à été passé par ' + `<@${member.id}>`)
                let inter = await interaction.reply({
                    embeds: [prev]
                })

            } else if (options.getSubcommand() === 'autoplay') {
                const queue = distube.getQueue(guild)
                if (!distube.getQueue(guild)) return interaction.reply({
                    content: '🚨 Il n\'y a pas de musique en cours de lecture !',
                    ephemeral: true
                })
                distube.toggleAutoplay(guild)
                let aplay = new MessageEmbed().setColor('PURPLE').setTitle('Lecture Automatique modifié !').setDescription('La lecture automatique à été ' + `${queue.autoplay ? 'activé par' : 'désactivé par'}` + `<@${member.id}>`)
                let inter = await interaction.reply({
                    embeds: [aplay]
                })

            } else if (options.getSubcommand() === 'loop') {
                const queue = distube.getQueue(guild)
                if (!queue) return interaction.reply({
                    content: '🚨 Il n\'y a pas de musique en cours de lecture !',
                    ephemeral: true
                })
                if (options.getString('type') === 'song') {
                    queue.setRepeatMode(1)
                } else if (options.getString('type') === 'off') {
                    queue.setRepeatMode(0)
                } else if (options.getString('type') === 'queue') {
                    queue.setRepeatMode(2)
                }
                let mode = queue.repeatMode
                mode = mode ? mode == 2 ? "Activé pour la file d'attente par" : "activé pour la musique actuelle par" : "Désactivé par";
                let r = new MessageEmbed().setColor('PURPLE').setTitle('Mode de répétion modifié !').setDescription('La répétion à été ' + `${mode}` + `<@${member.id}>`)
                let inter = await interaction.reply({
                    embeds: [r]
                })

            } else if (options.getSubcommand() === 'shuffle') {
                let queue = distube.getQueue(guild)
                if (!queue) return interaction.reply({
                    content: '🚨 Il n\'y a pas de musique en cours de lecture !',
                    ephemeral: true
                })
                if (queue.songs.length < 2) return interaction.reply({
                    content: '🚨 Il n\'y a qu\'une seul musique dans la file d\'attente',
                    ephemeral: true
                })
                distube.shuffle(guild)
                let shu = new MessageEmbed().setColor('PURPLE').setTitle('On joue au chamboule tout ?!').setDescription('La queue à été mélangé par ' + `<@${member.id}>`)
                let inter = await interaction.reply({
                    embeds: [shu]
                })
            }

        } catch (error) {
            console.log(error)
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