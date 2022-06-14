const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    description: "returns websocket ping",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        let ping = client.ws.ping
        const embed1 = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('__Latence du Bot__')
        .setDescription(`Le ping du bot est de ${ping} ms.`)
        .setThumbnail('https://emoji.gg/assets/emoji/7431-the-connection-is-excellent.png')
        const embed2 = new MessageEmbed()
        .setColor('YELLOW')
        .setTitle('__Latence du Bot__')
        .setDescription(`Le ping du bot est de ${ping} ms.`)
        .setThumbnail('https://emoji.gg/assets/emoji/3657-the-connection-is-good.png')
        const embed3 = new MessageEmbed()
        .setColor('RED')
        .setTitle('__Latence du Bot__')
        .setDescription(`Le ping du bot est de ${ping} ms.`)
        .setThumbnail('https://emoji.gg/assets/emoji/8920-the-connection-is-bad.png')
        
        if(ping <= 100) {
            interaction.reply({ embeds: [embed1]});
        }else if (ping > 100 || ping < 300) {
            await interaction.reply({ embeds: [embed2]});
        }else if(ping >= 300) {
            interaction.reply({ embeds: [embed3]});
        }

        client.log.success('Ping : ' + ping)
    },
};
