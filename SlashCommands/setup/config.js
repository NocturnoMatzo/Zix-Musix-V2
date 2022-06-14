const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow
} = require("discord.js");
const {
    Modal,
    TextInputComponent,
    SelectMenuComponent,
    showModal
} = require('discord-modals')
const {
    Guilds
} = require('../../handler/dbObjects')
module.exports = {
    name: "config",
    description: "configuration globale",
    type: 'CHAT_INPUT',
    is_eleved: true,
    options: [{
        name: 'options',
            description: 'choisis l\'options',
            type: 'STRING',
            choices: [{
                    name: 'music_channel',
                    value: 'music'
                },
                {
                    name: 'commands_channel',
                    value: 'commands'
                }
            ]
    }, ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if (interaction.options.getString('options') === 'music') {

            const modal = new Modal()
                .setCustomId('musicid')
                .setTitle('Paramètres')
                .addComponents(
                    new TextInputComponent()
                    .setCustomId('mid')
                    .setLabel("identifiants du salon musical")
                    .setRequired('true')
                    .setStyle('SHORT')
                )

            showModal(modal, {
                client: client,
                interaction: interaction,
            })

        } else if (interaction.options.getString('options') === 'commands') {

            const modal = new Modal()
                .setCustomId('commandid')
                .setTitle('Paramètres')
                .addComponents(
                    new TextInputComponent()
                    .setCustomId('cid')
                    .setLabel("identifiants du salon des commandes")
                    .setRequired('true')
                    .setStyle('SHORT')
                )

            showModal(modal, {
                client: client,
                interaction: interaction,
            })
        }
    },
};