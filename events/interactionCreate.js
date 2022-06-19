const client = require("../index");
const {
    Guilds
} = require('../handler/dbObjects')
const distube = require('../Client/Distube')
const {
    Permissions
} = require('discord.js')

client.on("interactionCreate", async (interaction) => {

    let {
        options,
        member,
        guild,
        channel,
        reply
    } = interaction

    let guildProfile = await Guilds.findOne({
        where: {
            guildId: interaction.guildId
        }
    })

    let excmd = ['info']

    if (interaction.isCommand()) {
        let cmd = client.slashCommands.get(interaction.commandName);

        if (cmd.deletemessage === true) {
            if (interaction.options.getSubcommand().includes(excmd)) {} else {
                setTimeout(async function () {
                    try {
                        if (interaction.ephemeral === true) return
                        await interaction.deleteReply()
                    } catch (e) {
                        await interaction.followUp({
                            content: '```\nUne erreur est survenue : ' + e + '\n```',
                            ephemeral: true
                        })
                    }

                }, 10000)
            }


        }

        if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            if (guildProfile.commandId !== undefined && interaction.channelId !== guildProfile.commandId) {
                return await interaction.reply({
                    content: `Vous devez executer cette commande dans le salon <#${guildProfile.commandId}>`,
                    ephemeral: true
                })
            }

            console.log(guildProfile.commandId)



            if (cmd.voice_only === true) {

                let vrai
                let Voicechannel
                let mchannel = guildProfile.musicId
                let message
                if (mchannel !== member.voice.channelId) {
                    Voicechannel = guildProfile.musicId
                    vrai = 'oui'
                }
                if (guildProfile.musicId === undefined) {
                    Voicechannel = member.voice.channel
                    vrai = 'non'
                }

                if (vrai === 'oui') message = `Tu doit être dans le salon <#${Voicechannel}> !`

                if (vrai === 'non') message = `Tu doit être dans un salon vocal pour jouer de la musique !`


                if (!member.voice.channel)
                    return interaction.reply({
                        content: message,
                        ephemeral: true
                    })

                if (vrai === 'oui') {
                    if (mchannel !== member.voice.channelId) {
                        return interaction.reply({
                            content: message,
                            ephemeral: true
                        })
                    }
                }
            }
        }

        if (!cmd)
            return interaction.reply({
                content: "Une erreur est survenue ",
                ephemeral: true
            });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options ?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction, args);
    }

    if (interaction.isAutocomplete()) {
        if (interaction.commandName === 'filters') {
            const focusedValue = interaction.options.getFocused();
            let choices
            if (interaction.options.getSubcommand() === 'manage') {
                choices = [
                    '3d', '8d', 'surround',
                    'clear', 'rickroll', 'cursed',
                    'mcompand', 'haas', 'gate',
                    'flanger', 'karaoke', 'subboost',
                    'pulsator', 'treble', 'reverse',
                    'vibrato', 'tremolo', 'purebass',
                    'phaser', 'nightcore', 'vaporwave',
                    'bassboost', 'echo', 'earwaxe'
                ]
            }

            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            const response = await interaction.respond(
                filtered.map(choice => ({
                    name: choice,
                    value: choice
                })),
            );
        }
    }

    // Context Menu Handling
    if (interaction.isContextMenu()) {
        await interaction.deferReply({
            ephemeral: false
        });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
});